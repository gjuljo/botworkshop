require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);
var model        = process.env.LUIS_MODEL;
var recognizer   = new builder.LuisRecognizer(model);
var intents      = new builder.IntentDialog({ recognizers: [recognizer] });

var welcomeMsg   = "Dammi un ordine da eseguire (i.e. 'spegni la cucina' o 'accendi il salotto')";

bot.dialog('/', intents);

intents
    .matches('TURN_ON', [
        function (session, args, next) {
            session.dialogData.entities = args.entities;
            var room = builder.EntityRecognizer.findEntity(args.entities, 'LUOGO');
            if (room && room) {
                session.send("TORN ON, ENTITY = " + room.entity);
            } else {
                session.send("TORN ON, NO ENTITY");
            }
        }
    ])
    .matches('TURN_OFF', [
        function (session, args, next) {
            session.dialogData.entities = args.entities;
            var room = builder.EntityRecognizer.findEntity(args.entities, 'LUOGO');
            if (room && room.entity) {
                session.send("TORN OFF, ENTITY = " + room.entity);
            } else {
                session.send("TORN OFF, NO ENTITY");
            }
        }     
    ])
    .onDefault([
        function (session, results, next) {
            builder.Prompts.text(session, welcomeMsg);
            next();
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
                bot.send(new builder.Message().address(message.address).text("Ciao " + membersAdded + "!"));
                bot.send(new builder.Message().address(message.address).text(welcomeMsg));
            }
        }
     } 
);

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());