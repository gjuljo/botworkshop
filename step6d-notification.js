require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
      savedAddress = session.message.address;
      var message = 'Hello! In a few seconds I\'ll send you a message proactively to demonstrate how bots can initiate messages.';
      session.send(message);
  
      message = 'You can also make me send a message by accessing: ';
      message += 'http://localhost:' + server.address().port + '/api/sendmessage';
      session.send(message);

      setTimeout(() => {
        sendProactiveMessage(savedAddress);
      }, 5000);
    }
]);

// send simple notification
function sendProactiveMessage(address) {
  var msg = new builder.Message().address(address);
  msg.text('Hello, this is a notification');
  msg.textLocale('en-US');
  bot.send(msg);
}

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());

// Do GET this endpoint to delivey a notification
server.get('/api/sendmessage', (req, res, next) => {
    sendProactiveMessage(savedAddress);
    res.send('triggered');
    next();
  }
);

