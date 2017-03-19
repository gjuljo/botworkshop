var builder          = require('botbuilder');
var testUtils        = require('./utils/unit-test-utils');
var testBot          = require('./step8b-bot');
var greetingMessages = require('./tests/greetings-flow');
var inputMessages    = require('./tests/input-flow');

//Our parent block
describe('Bot Tests', () => {

    it('greetings test', function (done) { 
      var connector = new builder.ConsoleConnector();

      var bot = testBot.create(connector);       
      testUtils.doTestBot(bot, greetingMessages, done);
    });

    it('text input test', function (done) { 
      var connector = new builder.ConsoleConnector();

      var bot = testBot.create(connector);       
      testUtils.doTestBot(bot, inputMessages, done);
    });

});
