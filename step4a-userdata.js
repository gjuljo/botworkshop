require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            if(session.message.text && session.message.text == 'reset') {
                delete session.userData.name;
                session.endDialog('Your name has been sucessfully cancelled.');
            } else {
                next();
            }
        }
    },
    function (session, results) {
        session.send('Hello %s! Type *reset* to cancel your name.', session.userData.name);        
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, "Hi! What's your name?");
    },    
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

/* this is better, but too early....
bot.dialog('reset', function (session) {
    // reset data
    if(session.userData.name) {
        delete session.userData.name;
        session.endDialog('Your name has been sucessfully cancelled.');
    } else {
        session.endDialog("I don't know your name yet!");
    }
}).triggerAction({ matches: /^reset/i });
*/

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());