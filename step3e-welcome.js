require('dotenv-extended').load();
var builder   = require('botbuilder');
var restify   = require('restify');
var sleep     = require('system-sleep');
var connector = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot       = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        session.send('[MAIN DIALOG]');
    }
]);

bot.dialog('/menu', [
    function(session) {
        builder.Prompts.choice(session,"[MENU DIALOG] make a choice", ['alpha','beta'], {
            maxRetries: 1,
            retryPrompt: "[MENU DIALOG] please try again"
        });
    },
    function (session, results) {
        var text;
        if(results.response) {
            // regular response
            text = results.response.entity;
        } else {
            // renponse extra 
            text = session.message.text;
        }
        session.send("[MENU DIALOG] your choice is '" + text +"'");
        session.endDialog();
    }
]);


bot.on('conversationUpdate',
    function (message) {
        if (message.membersAdded && message.membersAdded.length > 0) {
            var membersAdded = message.membersAdded.filter(function (m) {
                var isSelf = (m.id === message.address.bot.id);
                return !isSelf;
            })
            .map(function(m){
                return m.name;   
            })
            .join(', ');

            if(membersAdded.length>0) {
                bot.send(new builder.Message()
                    .address(message.address)
                    .text('[ON CONVERSATION] Welcome ' + membersAdded));
                sleep(500);
                bot.beginDialog(message.address, '/menu');
            }
        }
        if (message.membersRemoved && message.membersRemoved.length > 0) {
            var membersRemoved = message.membersRemoved
                .map(function (m) {
                    var isSelf = m.id === message.address.bot.id;
                    return (isSelf ? message.address.bot.name : m.name) || '' + ' (Id: ' + m.id + ')';
                })
                .join(', ');

            bot.send(new builder.Message()
                .address(message.address)
                .text('[ON CONVERSATION] The following members ' + membersRemoved + ' were removed or left the conversation :('));
        }
    } 
);

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());
