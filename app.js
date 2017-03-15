var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var fileUpload = require('express-fileupload');
var port = process.env.PORT || 3000;

app.use(fileUpload());
app.use("/public", express.static(__dirname + '/public'))
app.use("/images", express.static(__dirname + '/images'))

commands = [];
numOfPlayers = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', function(req, res) {
  let sampleFile = req.files.image;
  sampleFile.mv('images/test.png', function(err) {
    if (err)
      return res.status(500).send(err);
    io.emit('update picture', sampleFile.data)
    res.send('File uploaded!');
  });
});

app.get('/commands', function(req,res)
{
  res.send(commands);
});

app.get('/clear', function(req,res){
  commands = [];
  res.send("Cleared Commands");
});

io.on('connection', function(socket){
  io.emit('players', ++numOfPlayers);
  socket.on('chat message', function(msg){
    if(msg.indexOf('<><>') == -1) return;
    let name = msg.substr(0,msg.indexOf('<><>')),
        cmd = msg.substr(msg.indexOf('<><>')+4);
    commands.push(cmd);
    io.emit('chat message', name + ': ' + cmd);
  });

  socket.on('disconnect', function() {
    io.emit('players', --numOfPlayers);
  })
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
