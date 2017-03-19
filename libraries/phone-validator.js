var builder = require('botbuilder');

const PhoneRegex = new RegExp(/^(\+\d{2}[\s.])?\d{3}([\s.])?\d{7}$/);

const library = new builder.Library('phone-validator');

library.dialog('phonenumber',
    builder.DialogAction.validatedPrompt(builder.PromptType.text, (response) =>
        PhoneRegex.test(response)));

module.exports = library;
module.exports.PhoneRegex = PhoneRegex;