require('dotenv-extended').load();
var builder    = require('botbuilder');
var restify    = require('restify');
var giphy      = require('giphy-api')();
var forismatic = require('forismatic-node')();
var connector  = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot        = new builder.UniversalBot(connector);
var intents    = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matches(/^search/i, [
    function (session) {
        builder.Prompts.text(session, 'What do you want to search?');
    },
    function (session, results) {
        var target = results.response;
        giphy.search({q:target,limit:1,fmt:'json'}, function (err, res) {
            console.log(res.data[0]);
            if(res && res.data && res.data.length>0) {
                var message = createMessage(session, res.data)
                session.send(message);
            } else {
                session.send("Nothing found, try again...");
            }
        });
    }
]);

intents.matches(/^trending/i, [
    function (session, results) {
        giphy.trending({limit:1,fmt:'json'}, function (err, res) {
            console.log(res.data[0]);
            if(res && res.data && res.data.length>0) {
                var message = createMessage(session, res.data)
                session.send(message);
            } else {
                session.send("Nothing found, try again...");
            }
        });
    }
]);

intents.matches(/^quote/i, [
    function (session, results) {
        console.log(results);
        forismatic.getQuote(function (error, quote) {
            if (!error) {
                var text = quote.quoteText;
                if(quote.quoteAuthor) text += '\n (' + quote.quoteAuthor + ')';
                
                session.send(text);
            } else {
                session.send("Sorry, no quotes available.");
            }
        });
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.greetings) {
            session.userData.greetings = true;
            session.send("Welcome");
            session.beginDialog('/help');
        } else {
            session.beginDialog('/help');
        }
    }
]);

bot.dialog('/help', [
    function (session, results) {
        session.send("You can type *search*, *trending*, *quote* or *help* to get this message");
        session.endDialog();
    }
]);


function createMessage(session, data) {
    var cards = data.map(function(item){
        var card = new builder.HeroCard(session);
        card.title(item.slug);
        card.images([builder.CardImage.create(session, item.images.fixed_width_still.url)]);
        var text = 'type: ' + item.type + '\n' + item.source; 
        card.text(text);
        card.tap(new builder.CardAction.openUrl(session, item.url));
        return card;
    });

    var message = new builder.Message(session).attachments(cards).attachmentLayout('carousel');

    return message;
}


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());
