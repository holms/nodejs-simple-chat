var socket = io.connect();

function addMessage(msg, nickname) {
  $("#chatEntries").append('<div class="message"><p>' + nickname + ' : ' + msg + '</p></div>');
  $("#chatEntries").scrollTop($("#chatEntries")[0].scrollHeight);
}

function sendMessage() {
   if ($('#messageInput').val() != "") 
   {
      socket.emit('message', $('#messageInput').val());
      addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
      $('#messageInput').val('');
   }
}

function setNickname() {
   if ($("#nicknameInput").val() != "")
   {
      socket.emit('setNickname', $("#nicknameInput").val());
      $('#chatControls').show();
      $('#messageInput').focus();
      $('#nicknameInput').hide();
      $('#nicknameSet').hide();
   }
}

socket.on('message', function(data) {
   addMessage(data['message'], data['nickname']);
});

$(function() {
   $("#nicknameInput").focus();
   $("#chatControls").hide();
   $("#nicknameSet").click(function() {setNickname()});
   $("#nicknameInput").keypress(function(event) {
      if (event.which == 13) {
        event.preventDefault();
	setNickname();
      }
   });
   $("#messageInput").keypress(function(event) {
      if (event.which == 13) {
        event.preventDefault();
	sendMessage();
      }
   });
   $("#submit").click(function() {sendMessage();});
});

