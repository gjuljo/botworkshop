require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var sleep        = require('system-sleep');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        builder.Prompts.choice(session,"make a choice", ['alpha','beta'], {
            maxRetries: 1,
            retryPrompt: 'please try again!'
        });
    },
    function (session, results) {
        var text;
        if(results.response) { // regular response
            text = results.response.entity;
        } else { // renponse extra 
            text = session.message.text;
        }
        session.send("your choice is '" + text + "'");
    }
]);


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());