require('dotenv-extended').load();
var builder   = require('botbuilder');
var express   = require('express');
var connector = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot       = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        session.send('Hello World');
    }
]);

/* LISTEN IN THE CHAT CONNECTOR */
var app = express();
app.post('/api/messages', connector.listen())
var listener = app.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('listening on port %s', listener.address().port); 
});