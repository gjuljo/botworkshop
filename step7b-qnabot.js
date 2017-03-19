require('dotenv-extended').load();
var builder    = require('botbuilder');
var restify    = require('restify');
var QnAClient  = require('./utils/qnamaker-client.js');
var connector  = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot        = new builder.UniversalBot(connector);

bot.dialog('/', [
	function(session) {
        builder.Prompts.text(session, 'Please enter your question: ')
    },
    function(session, result) {
		var client = new QnAClient({
    					'knowledgebaseId': process.env.QNA_KNOWLEDGEBASEID,
						'subscriptionKey': process.env.QNA_SUBSCRIPTIONKEY
		});

		session.sendTyping();

		client.get({'question': result.response, "top":3}, function (error, response) {
			if(error) {
				session.send("Error: " + error);
			} else {
				var result = JSON.parse(response);
				if(result.answers.length > 0) {
					session.send(result.answers[0].answer);
				} else {
					session.send("No answers found");
				}
			}

			session.replaceDialog('/');
		});
    }
]);

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());