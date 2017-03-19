require('dotenv-extended').load();
var builder      = require('botbuilder');
var restify      = require('restify');
var connector    = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot          = new builder.UniversalBot(connector);

// Sub-Dialogs
bot.library(require('./libraries/reset-password-dialog'));

// Validators
bot.library(require('./libraries/phone-validator'));

const ChangePasswordOption = 'Change Password';
const ResetPasswordOption  = 'Reset Password';

bot.dialog('/', [
    (session) => {
        builder.Prompts.choice(session,
            'What do yo want to do today?',
            [ChangePasswordOption, ResetPasswordOption],
            { listStyle: builder.ListStyle.button });
    },
    (session, result) => {
        if (result.response) {
            switch (result.response.entity) {
                case ChangePasswordOption:
                    session.send('This functionality is not yet implemented! Try resetting your password.');
                    session.reset();
                    break;
                case ResetPasswordOption:
                    session.beginDialog('reset-password:/');
                    break;
            }
        } else {
            session.send(`I am sorry but I didn't understand that. I need you to select one of the options below`);
        }
    },
    (session, result) => {
        if (result.resume) {
            session.send('You identity was not verified and your password cannot be reset');
            session.reset();
        }
    }
]);


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());

