// server.js

// set up ==================
  var express = require('express'),
      fs = require('fs'),
      gm = require('gm'),
      _ = require('lodash'),
      nodemailer = require("nodemailer"),
      elasticsearch = require('elasticsearch'),
      gmailAuth = require('./accountproperties.json'),

      imageMagick = gm.subClass({ imageMagick: true }),

      app = express(),

      smtpTransport = nodemailer.createTransport("SMTP", gmailAuth),


      client = new elasticsearch.Client({
        host: 'localhost:9200'
        //log: 'trace'
      }),

      allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
      },

      searchIndex = function (index, query, callback) {
        // search for documents (and also promises!!)
        client.search({
          index: index,
          size: 50,
          body: {
            query: query
          }
        }).then(function (resp) {
          if(resp.hits) {
            callback(resp.hits.hits);
          }
        })
      },

      saveImages = function ( images, id ) {
        _.each(images, function ( image, index ) {
          var base64Data = image.replace(/^data:image\/jpeg;base64,/,'');
          var base64Data = base64Data.replace(/^data:image\/png;base64,/,'');
          var img = new Buffer(base64Data, 'base64');

          console.log(id, index);

          saveImage(img, id + '-' + index, 60, '2000', 'original');
          saveImage(img, id + '-' + index, 60, '600', 'regular');
          saveImage(img, id + '-' + index, 60, '250', 'small');
          saveImage(img, id + '-' + index, 60, '150', 'thumbnail');
        });
      },

      saveImage = function ( buffer, name, quality, size, type ) {
        imageMagick(buffer, name)
        .compress('JPEG')
        .resize(size, null)
        .quality(quality)
        .write('public/images/' + type + '/' + name + '.jpg', function (err) {
          if (!err) {
            console.log('done');
          }
          else {
            console.log(err);
          }
        });
      },

      sendEmail = function ( receivers, subject, text, html ) {
        var mailOptions = {
            from: 'Highscore.no ✔ <high.score@gmail.com>', // sender address
            to: receivers, // list of receivers
            subject: subject, // Subject line
            text: text, // plaintext body
            html: html // html body
        };

        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
            }else{
                console.log("Message sent: " + response.message);
            }
        });

      },

      getUrlUnfriendly = function ( name ) {
        return name.replace(/-/g, ' ');
      };

  app.configure(function() {
    app.use(allowCrossDomain); // Cross domain
    app.use(express.static(__dirname + '/public')); // static file location
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.bodyParser({limit: '50mb'})); // pull information from html in post
    app.use(express.methodOverride()); // simulate delete and put
  });

// Routes ==================

  app.get('/api/levels', function(req, res) {
    var levels = [];
    searchIndex('levels', {
            'match_all': {}
        },function(data) {
            _.each(data, function(level){
              levels.push(level['_source']);
            });
            res.send(JSON.stringify(levels));
        });
  });


app.get('/api/level/:console/:game/:level/all', function ( req, res ) {
      var unApprovedRecords = [],
          _console = getUrlUnfriendly(req.params.console),
          _game = getUrlUnfriendly(req.params.game),
          _level = getUrlUnfriendly(req.params.level);

          console.log(_console, _game, _level);

      searchIndex('records', {
              'match': {
                level: _level
              }
          },function(data) {
              _.each(data, function(record){
                record['_source']['_id'] = record._id;
                unApprovedRecords.push(record['_source']);
              });
              res.send(JSON.stringify(unApprovedRecords));
          });

    });


  app.get('/api/records/unapproved', function ( req, res ) {
      var unApprovedRecords = [];

      searchIndex('records', {
              'match': {
                status: 'unapproved'
              }
          },function(data) {
              _.each(data, function(record){
                record['_source']['_id'] = record._id;
                unApprovedRecords.push(record['_source']);
              });
              res.send(JSON.stringify(unApprovedRecords));
          });
    });

  app.get('/api/records/all', function ( req, res ) {
      var unApprovedRecords = [];

      searchIndex('records', {
              'match_all': {}
          },function(data) {
              _.each(data, function(record){
                record['_source']['_id'] = record._id;
                unApprovedRecords.push(record['_source']);
              });
              res.send(JSON.stringify(unApprovedRecords));
          });
    });

  app.get('/api/records/approved', function ( req, res ) {
      var approvedRecords = [];

      searchIndex('records', {
              'match': {
                status: 'approved'
              }
          },function(data) {
              _.each(data, function(record){
                record['_source']['_id'] = record._id;
                approvedRecords.push(record['_source']);
              });
              res.send(JSON.stringify(approvedRecords));
          });
    });

  app.get('/api/records/rejected', function ( req, res ) {
      var approvedRecords = [];

      searchIndex('records', {
              'match': {
                status: 'rejected'
              }
          },function(data) {
              _.each(data, function(record){
                record['_source']['_id'] = record._id;
                approvedRecords.push(record['_source']);
              });
              res.send(JSON.stringify(approvedRecords));
          });
    });


  app.put('/api/record/:status', function ( req, res ) {
    var record = req.body;

    

    if(req.params.status == 'approve') {
      record.status = 'approved';
    };

    if(req.params.status == 'unapprove') {
      record.status = 'unapproved';
    };

        if(req.params.status == 'reject') {
      record.status = 'rejected';
    };


    console.log(record, req.params.status);

      client.index({
        index: 'records',
        type: 'record',
        id: record._id,
        body: record
      }, function ( err, resp ) {
          if( !err ) {
            res.send('success', 200);
          } else {
            res.send('Inproper id provided', 404);
          }
      });
  });


  app.post('/api/record/:id/approve', function ( req, res ) {

    var id = req.params.id;
    var record = req.body;

    record.status = 'approved';

    if(id && record) {



    } else {
      
    }
  });

  app.post('/api/record', function(req, res) {
    var record = req.body;
    var images = [];

    _.each(record.images, function(image, index) {
      images.push(image.image);
      record.images[index] = image.comment;
    });



    record.status = 'unapproved';

    client.create({
      index: 'records',
      type: 'record',
      body: record
    }, function (err, resp) {

        var id = resp._id;

        if(err) {
            res.send('Document may or may not exist, depending on the moon', 404);
        }

        saveImages(images, id);
        sendEmail(record.email, 'Rekorden din er sendt til godkjenning', 'Rekorden din blir vanligvis godkjent på max 1 dag', 'Rekorden din blir vanligvis godkjent på max 1 dag');

        res.send(JSON.stringify({id: id}));
    });
  });

// Initiate server ==================
app.listen(8080);
console.log('App listening on port 8080');