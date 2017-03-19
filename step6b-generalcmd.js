require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

bot.dialog('/', [
    function(session) {
        session.send('[MAIN] message from main dialog');
        session.beginDialog('/child')
    }
]);

bot.dialog('/child', [
    function(session, args, next) {
        session.send('>[CHILD] message1 from child dialog, you can cancel this dialog by issuing *cancel* or *exit* to end the conversation');
    }
]).cancelAction('cancel', '>[CHILD CANCEL ACTION] dialog canceled', { matches: /^cancel/i });

bot.dialog('exit', (session, args, next) => {
    // end the conversation to cancel the operation
    session.endConversation('[EXIT COMMAND] Conversation ended. Bye Bye.');
}).triggerAction({
    matches: /^exit$/i
});


bot.dialog('help', [ 
    function(session, args, next) {
        // send help message to the user and end this dialog
        session.send("[HELP COMMAND] This is the help message. Issue *exit* to close the conversation.");
        session.beginDialog(args.source);
    }
]).triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // overrides default behavior of replacing the dialog stack
        // This will add the help dialog to the stack
        var stacklength = session.sessionState.callstack.length;
        args.source = session.sessionState.callstack[stacklength-1].id;
        session.beginDialog(args.action, args);
    }
});


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());