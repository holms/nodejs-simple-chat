// npm install express jade socket.io sanitize validator

var express = require('express')
    , helmet = require('helmet')
    , check = require('validator').check
    , sanitize = require('validator').sanitize
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , jade = require('jade')
    , toobusy = require('toobusy');


helmet.defaults(app);
helmet.hidePoweredBy();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", { layout: false });

app.configure(function() {
   app.use(express.limit(1000));
   app.use(express.favicon());
   app.use(express.static(__dirname + '/public'));
   app.use(function(req, res, next) {
 	 if (toobusy()) res.send(503, "I'm busy right now, sorry.");
	 else next();
   });
});

app.get('/', function(req, res){
  res.render('index.jade');
});
server.listen(80);


io.sockets.on('connection', function (socket) {

	socket.on('setNickname', function (data) {
	   socket.set('nickname', sanitize(data).entityEncode().toString().substr(0,10));
	});

	socket.on('message', function (message) {
	   socket.get('nickname', function (error, name) {
	      name = sanitize(name).entityEncode().toString().substr(0,10);
              message = sanitize(message).entityEncode().toString().substr(0,100);
	      var data = { 'message' : message,  nickname : name };

	      socket.broadcast.emit('message', data);
	      console.log("user " + name + " send this : " + message + "...");
	   })
	});

});




