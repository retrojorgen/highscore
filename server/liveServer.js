// server.js

// set up ==================
  var _ = require('lodash'),
      mongoose = require('mongoose'),
      io = require('socket.io').listen(6060),

      allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        next();
      },

      getUrlUnfriendly = function ( name ) {
        return name.replace(/-/g, ' ');
      };''

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

// Events ==================

io.sockets.on('connection', function (socket) {

  socket.on('get levels', function() {
    Level.find({}, function ( err, levels ) {
      if(err) {
        socket.emit('get levels failed', err);
        return;
      }

      socket.emit('levels done', levels);
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
