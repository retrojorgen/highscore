// server.js

// set up ==================
  var express = require('express'),
      fs = require('fs'),
      gm = require('gm'),
      imageMagick = gm.subClass({ imageMagick: true }),
      app = express(),
      allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
      };

  app.configure(function() {
    app.use(allowCrossDomain); // Cross domain
    app.use(express.static(__dirname + '/public')); // static file location
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.bodyParser({limit: '50mb'})); // pull information from html in post
    app.use(express.methodOverride()); // simulate delete and put
  });

// Routes ==================
  app.post('/api/records', function(req, res) {
    var image = req.body[0];
    var base64Data = image.replace(/^data:image\/jpeg;base64,/,'');
    var img = new Buffer(base64Data, 'base64');



    imageMagick(img, 'image.jpg')
    .compress('JPEG')
    .quality(60)
    .write('public/images/original/resize2.jpg', function (err) {
      if (!err) {
        console.log('done');
      }
      else {
        console.log(err);
      }
    });

    imageMagick(img)
    .resize('600', null)
    .compress('JPEG')
    .quality(50)
    .write('public/images/regular/resize3.jpg', function (err) {
      if (!err) {
        console.log('done');
      }
      else {
        console.log(err);
      }
    });

    imageMagick(img)
    .resize('150', null)
    .compress('JPEG')
    .quality(50)
    .write('public/images/thumbnail/resize3.jpg', function (err) {
      if (!err) {
        console.log('done');
      }
      else {
        console.log(err);
      }
    });

  });

// Initiate server ==================
app.listen(8080);
console.log('App listening on port 8080');