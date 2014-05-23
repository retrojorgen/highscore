// server.js

// set up ==================
  var _ = require('lodash'),
      mongoose = require('mongoose'),
      levels = require('./levels.json'),
      io = require('socket.io').listen(6060),

      allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
      },

      getUrlUnfriendly = function ( name ) {
        return name.replace(/-/g, ' ');
      },

      saveLevels = function(levels) {
        _.each(levels, function(level) {
          var _level  = new Level(level);

          _level.save(function(err, __level) {
            if(err) {
              console.log(err);
            }
          });
        });
      };


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

  var achievementSchema = mongoose.Schema({
    email: String,
    name: String,
    points: Number
  });

  var Record = mongoose.model('record', recordSchema);
  var Level = mongoose.model('level', recordSchema);
  var Achievement = mongoose.model('achievement', achievementSchema);


  saveLevels(levels);

// Events ==================

io.sockets.on('connection', function (socket) {

  socket.on('get levels', function() {
    Level.find({}, function ( err, levels ) {
      console.log(levels);
      if(err) {
        socket.emit('get levels failed', err);
        return;
      }

      socket.emit('levels done', levels);
    });
  });

  socket.on('add level', function(level) {
    var newLevel = new Level(level);
    newLevel.save(function(err, _level) {
      if(err) {
        socket.emit('add level failed', err);
        return;
      }

      socket.emit('add level done', _level);
    });
  });

  socket.on('get records', function(selection) {
    Record.find(
      {
        console: selection.console,
        game: selection.game,
        level: selection.level,
        type: selection.type,
        status: 'approved'
      }, function(err, records) {
        if(err) {
          socket.emit('get records failed', err);
          return;
        }

        socket.emit('get records done', records);
      });
  });

  socket.on('new record', function(record) {

    record.status = 'approved';
    record.createddate = new Date();

    console.log(record);

    var newRecord = new Record(record);

    newRecord.save(function ( err, record ) {
      if(err) {
        socket.emit('new record failed', err);
        return;
      }

      socket.emit('new record done', record);

      socket.broadcast.emit('record', record);
    });
  });
});

// Initiate server ==================
