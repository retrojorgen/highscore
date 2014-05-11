// server.js

// set up ==================
  var express = require('express'),
      fs = require('fs'),
      gm = require('gm'),
      _ = require('lodash'),
      nodemailer = require("nodemailer"),
      mongoose = require('mongoose'),
      gmailAuth = require('./accountproperties.json'),

      imageMagick = gm.subClass({ imageMagick: true }),

      app = express(),

      smtpTransport = nodemailer.createTransport("SMTP", gmailAuth),

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

// Express config ===================================

  app.configure(function() {
    app.use(allowCrossDomain); // Cross domain
    app.use(express.static(__dirname + '/public')); // static file location
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.bodyParser({limit: '50mb'})); // pull information from html in post
    app.use(express.methodOverride()); // simulate delete and put
  });


// Mongoose config ===================================

  mongoose.connect('mongodb://localhost/records');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
    console.log('yoohooo');
  });

  var recordSchema = mongoose.Schema({
      nickname: String,
      email: String,
      createddate: String,
      type: String,
      lap: String,
      time: Number,
      score: Number,
      game: String,
      console: String,
      level: String,
      status: String,
      images: [String]
  });

  var levelSchema = mongoose.Schema({
    level: String,
    game: String,
    console: String
  });

  var record = mongoose.model('record', recordSchema);
  var level = mongoose.model('level', recordSchema);

// Routes ==================

  app.get('/api/levels', function(req, res) {
    var levels = [];
  });


app.get('/api/level/:console/:game/:level/all', function ( req, res ) {
      var unApprovedRecords = [],
          _console = getUrlUnfriendly(req.params.console),
          _game = getUrlUnfriendly(req.params.game),
          _level = getUrlUnfriendly(req.params.level);
    });


  app.get('/api/records/unapproved', function ( req, res ) {
      var unApprovedRecords = [];
    });

  app.get('/api/records/all', function ( req, res ) {
      var unApprovedRecords = [];

    });

  app.get('/api/records/approved', function ( req, res ) {
      var approvedRecords = [];
    });

  app.get('/api/records/rejected', function ( req, res ) {
      var approvedRecords = [];
    });


  app.put('/api/record/status/:status', function ( req, res ) {
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
  });


  app.post('/api/record', function(req, res) {
    var record = req.body;
    var images = [];

    _.each(record.images, function(image, index) {
      images.push(image.image);
      record.images[index] = image.comment;
    });

    record.status = 'unapproved';

    console.log(record);

  });

// Initiate server ==================
app.listen(8080);
console.log('App listening on port 8080');