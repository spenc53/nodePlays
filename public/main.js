$(function () {
  var socket = io();
  $('form').submit(function () {
    if ($('#message').val() == "") return false;
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });
  socket.on('chat message', function (msg) {
    $('#messages').prepend('<li>&nbsp;&nbsp;&nbsp;&nbsp;' + msg + '</li>');
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.on('update picture', function (data) {
    var bytes = new Uint8Array(data);
    var image = document.getElementById('game-picture');
    image.src = "data:image/png;base64," + encode(bytes);
  })
  socket.on('players', function(data) {
    $('#user-count').text('Online: ' + data);
  })
});

function encode(input) {
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
  var i = 0;

  while (i < input.length) {
    chr1 = input[i++];
    chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
    chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
      keyStr.charAt(enc3) + keyStr.charAt(enc4);
  }
  return output;
}