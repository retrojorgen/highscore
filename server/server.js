// server.js

// set up ==================
  var express = require('express'),
      fs = require('fs'),
      gm = require('gm'),
      _ = require('lodash'),
      nodemailer = require("nodemailer"),
      mongoose = require('mongoose'),
      gmailAuth = require('./accountproperties.json'),
      levels = require('./levels.json'),


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

          saveImage(img, id + '-' + index, 60, '1200', '1200');
          saveImage(img, id + '-' + index, 60, '600', '600');
          saveImage(img, id + '-' + index, 60, '300', '300');
          saveImage(img, id + '-' + index, 60, '150', '150');
        });
      },

      saveImage = function ( buffer, name, quality, size, type ) {
        console.log(name, quality, size, type);
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
      time: String,
      milliseconds: Number,
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

  var Record = mongoose.model('record', recordSchema);
  var Level = mongoose.model('level', recordSchema);

// Routes ==================

  app.get('/api/levels', function(req, res) {
    var levels = [];
    Level.find(function ( err, levels ) {
      if(err) console.error(err);
      console.log(levels);
      res.send(levels);
    });
  });

 app.get('/api/records', function ( req, res ) {
    Record.find(function ( err, records ) {
      if(err) console.error(err);
      console.log(records);
      res.send(records);
    });
 });

 app.get('/api/records/unapproved', function ( req, res ) {
    Record.find({status: 'unapproved'}, function ( err, records ) {
      if(err) console.error(err);
      console.log(records);
      res.send(records);
    });
 });

app.get('/api/records/rejected', function ( req, res ) {
    Record.find({status: 'rejected'}, function ( err, records ) {
      if(err) console.error(err);
      console.log(records);
      res.send(records);
    });
 });

app.get('/api/records/:console', function ( req, res) {
  var console = getUrlUnfriendly(req.params.console);
  Record.find({ console: console, status: 'approved'}, null, {sort: {milliseconds: 1}}, function (err, records) {
    if(err) {
      res.send('failed', 404);
    } else {
      if(records.length === 0) {
        res.send('failed, no results', 404);
      } else {
        res.send(records);
      }
    }
  });
});

app.get('/api/records/:console/:game', function ( req, res) {
  var console = getUrlUnfriendly(req.params.console),
      game = getUrlUnfriendly(req.params.game);

  Record.find({ console: console, game: game, status: 'approved'}, null, {sort: {milliseconds: 1}}, function (err, records) {
    if(err) {
      res.send('failed', 404);
    } else {
      if(records.length === 0) {
        res.send('failed, no results', 404);
      } else {
        res.send(records);
      }
    }
  });
});

app.get('/api/records/:console/:game/:level', function ( req, res) {
  var console = getUrlUnfriendly(req.params.console),
      game = getUrlUnfriendly(req.params.game),
      level = getUrlUnfriendly(req.params.level);

  Record.find({ console: console, game: game, level: level, status: 'approved'}, null, {sort: {milliseconds: 1}}, function (err, records) {
    if(err) {
      res.send('failed', 404);
    } else {
      if(records.length === 0) {
        res.send('failed, no results', 404);
      } else {
        res.send(records);
      }
    }
  });
});


app.get('/api/records/:console/:game/:level/all', function ( req, res) {
  var console = getUrlUnfriendly(req.params.console),
      game = getUrlUnfriendly(req.params.game),
      level = getUrlUnfriendly(req.params.level);

  Record.find({ console: console, game: game, level: level}, null, {sort: {milliseconds: 1}}, function (err, records) {
    if(err) {
      res.send('failed', 404);
    } else {
      if(records.length === 0) {
        res.send('failed, no results', 404);
      } else {
        res.send(records);
      }
    }
  });
});


app.get('/api/record/:id/remove', function ( req, res) {
  var id = req.params.id;

  Record.findById(id, function ( err, record) {
    if(err) {
      res.send('failed', 404);
    } else {
      Record.remove({_id:id}, function ( err ) {
        if(err) res.send('failed', 404);
        else res.send('success', 200);
      });
    }
  });
});

app.get('/api/record/:id/status/:status', function ( req, res) {
  var id = req.params.id,
      status = req.params.status;

  Record.findById(id, function ( err, record) {
    if(err) {
      res.send('failed', 404);
    } else {
      Record.update({_id:id}, {status: status}, function ( err, numberAffected ) {
        if(err) res.send('failed', 404);
        else res.send('success ' + numberAffected, 200);
      });
    }
  });
});

app.put('/api/record/:id', function ( req, res) {
  var id = req.params.id,
      _record = req.body;

  delete _record._id;

  Record.findById(id, function ( err, record) {
    if(err) {
      res.send('failed', 404);
    } else {
      Record.update({_id:id}, _record, function ( err, numberAffected ) {
        console.log(err);
        if(err) res.send('failed', 404);
        else res.send('success ' + numberAffected, 200);
      });
    }
  });

});

  app.post('/api/record', function ( req, res ) {

    var _record = req.body;
    var record = {};
    var images = [];

    _.each(_record.images, function ( image, index ) {
      images.push(image.image);
      _record.images[index] = image.comment;
    });

    _record.status = 'unapproved';
    _record.createddate = new Date();

    record = new Record(_record);
    res.send(_record);
    console.log(_record.images);

    record.save(function ( err, record ) {
        console.log(record);
        res.send(record);
        saveImages(images, record._id);
        sendEmail(record.email, 'Rekorden din er sendt til godkjenning', 'Rekorden din blir vanligvis godkjent på max 1 dag', 'Rekorden din blir vanligvis godkjent på max 1 dag');
    });


  });

// Initiate server ==================
app.listen(8080);
console.log('App listening on port 8080');