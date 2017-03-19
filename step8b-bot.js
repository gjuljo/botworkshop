require('dotenv-extended').load();
var builder = require('botbuilder');

function create(connector) {
    var bot = new builder.UniversalBot(connector);

    bot.dialog('/', [
        function(session) {
            builder.Prompts.text(session, 'Please enter your name: ')
        },
        function(session, result) {
            session.send('Hello ' + result.response);
        }
    ]);

    return bot;
}

module.exports = { create }