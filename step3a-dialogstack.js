require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var sleep        = require('system-sleep');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        session.send('[MAIN DIALOG] START');
        sleep(1000);
        session.beginDialog('/sub1');
    },
    function (session, results) {
        session.send('[MAIN DIALOG] END');
        session.endConversation('[MAIN DIALOG] Goodbye!');
    }
]);

bot.dialog('/sub1', [
    function (session) {
        session.send('>[SUB1 DIALOG] START');
        sleep(1000);
        session.beginDialog('/sub2');
    },
    function (session, results) {
        session.send('>[SUB1 DIALOG] END');
        sleep(1000);
        // try to comment the line below to see that happens
        session.endDialog();  
    }
]);

bot.dialog('/sub2', [
    function (session) {
        session.send('>>[SUB2 DIALOG] START');
        sleep(1000);
        session.send('>>[SUB2 DIALOG] END');
        sleep(1000);
        session.endDialog();
    }
]);


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());
