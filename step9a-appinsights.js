require('dotenv-extended').load();
var builder         = require('botbuilder');
var restify         = require('restify');
var telemetryModule = require('./utils/telemetry-module.js');
var appInsights     = require("applicationinsights").setup().start();
var connector       = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot             = new builder.UniversalBot(connector);
var intents         = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matches(/^alfa/i, [
    function (session) {
        session.beginDialog('/alfa');
    }
]);

intents.matches(/^beta/i, [
    function (session) {
        session.beginDialog('/beta');
    }
]);

intents.matches(/^gamma/i, [
    function (session) {
        session.beginDialog('/gamma');
    }
]);

intents.onDefault([
    function (session, results) {
        session.send('Hello!');
        // session.send('You can run any of the following commands: *alfa*, *beta* and *gamma*');
        builder.Prompts.choice(session,"You can run any of the following commands:", ['alfa','beta','gamma'], {
            maxRetries: 2,
            retryPrompt: "Please try again"
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
        session.beginDialog('/'+text);

    }
]);

bot.dialog('/alfa', [
    function (session) {
        var telemetry = telemetryModule.createTelemetry(session);
        appInsights.client.trackEvent("alfa", telemetry);
        session.send("Great, this is alfa");
        session.endDialog();
    }
]);

bot.dialog('/beta', [
    function (session) {
        var telemetry = telemetryModule.createTelemetry(session);
        appInsights.client.trackEvent("beta", telemetry);
        session.send("Great, this is beta");
        session.endDialog();
    }
]);

bot.dialog('/gamma', [
    function (session) {
        var telemetry = telemetryModule.createTelemetry(session);
        appInsights.client.trackEvent("gamma", telemetry);
        session.send("Great, this is gamma");
        session.endDialog();
    }
]);


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());
