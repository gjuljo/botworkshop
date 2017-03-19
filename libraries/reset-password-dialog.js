var builder      = require('botbuilder');
var randomstring = require('randomstring');

const library = new builder.Library('reset-password');

library.dialog('/', [
    (session) => {
        session.beginDialog('phone-validator:phonenumber', {
            prompt: 'Please enter your phone number (i.e. +39.555.1234567):',
            retryPrompt: 'The value entered is not phone number. Please try again using the following format (+xy) xyz.uvt.wxyz:',
            maxRetries: 2
        });
    },
    (session, args) => {
        if (args.resumed) {
            session.send('You have tried to enter your phone number many times. Please try again later.');
            session.endDialogWithResult({ resumed: builder.ResumeReason.notCompleted });
            return;
        }

        session.dialogData.phoneNumber = args.response;
        session.send('The phone you provided is: ' + args.response);

        builder.Prompts.time(session, 'Please enter your date of birth (MM/dd/yyyy):', {
            retryPrompt: 'The value you entered is not a valid date. Please try again:',
            maxRetries: 2
        });
    },
    (session, args) => {
        if (args.resumed) {
            session.send('You have tried to enter your date of birth many times. Please try again later.');
            session.endDialogWithResult({ resumed: builder.ResumeReason.notCompleted });
            return;
        }

        session.send('The date of birth you provided is: ' + args.response.entity);

        var newPassword = randomstring.generate(8);
        session.send('Thanks! Your new password is _' + newPassword + '_');

        session.endDialogWithResult({ resumed: builder.ResumeReason.completed });
    }
]).cancelAction('cancel', null, { matches: /^cancel/i });

module.exports = library;