require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);
var MsTranslator = require('mstranslator');

var translator   = new MsTranslator({api_key: process.env.TRANSLATOR_KEY}, true);

bot.dialog('/', [
    function(session) {
        translator.translate( {text: session.message.text, from: 'it', to: 'es'}, function(err,data) {
            if(err) session.send('Sorry, unable to translate. Error: ' + err);
            session.send(data);
        });
    }
]);


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());