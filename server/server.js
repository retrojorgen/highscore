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

      searchLevels = function (query, callback) {
        // search for documents (and also promises!!)
        client.search({
          index: 'levels',
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
    searchLevels({
            'match_all': {}
        },function(data) {
            _.each(data, function(level){
              levels.push(level['_source']);
            });
            res.send(JSON.stringify(levels));
        });
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