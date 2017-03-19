require('dotenv-extended').load();
var builder       = require('botbuilder');
var restify       = require('restify');
var request       = require('request');
var connector     = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot           = new builder.UniversalBot(connector);
var queryString    = 'https://' + process.env.SEARCH_NAME_MUSIC + '.search.windows.net/indexes/' + process.env.SEARCH_INDEX_MUSIC + '/docs?api-key=' + process.env.SEARCH_KEY_MUSIC + '&api-version=2015-02-28&';

bot.dialog('/', [
    function (session) {
        var choices = ["Musician Explorer", "Musician Search"]
        builder.Prompts.choice(session, "How would you like to explore the classical music bot?", choices);
    },
    function (session, results) {
        if (results.response) {
            var selection = results.response.entity;
            // route to corresponding dialogs
            switch (selection) {
                case "Musician Explorer":
                    session.replaceDialog('/musicianExplorer');
                    break;
                case "Musician Search":
                    session.replaceDialog('/musicianSearch');
                    break;
                default:
                    session.reset('/');
                    break;
            }
        }
    }
]);


bot.dialog('/musicianExplorer', [
    function (session) {
        //Syntax for faceting results by 'Era'
        var queryString = searchQueryStringBuilder('facet=Era');
        performSearchQuery(queryString, function (err, result) {
            if (err) {
                console.log("Error when faceting by era:" + err);
            } else if (result && result['@search.facets'] && result['@search.facets'].Era) {
                eras = result['@search.facets'].Era;
                var eraNames = [];
                //Pushes the name of each era into an array
                eras.forEach(function (era, i) {
                    eraNames.push(era['value'] + " (" + era.count + ")");
                })    
                //Prompts the user to select the era he/she is interested in
                builder.Prompts.choice(session, "Which era of music are you interested in?", eraNames);
            } else {
                session.endDialog("I couldn't find any genres to show you");
            }
        })
    },
    function (session, results) {
        //Chooses just the era name - parsing out the count
        var era = results.response.entity.split(' ')[0];;

        //Syntax for filtering results by 'era'. Note the $ in front of filter (OData syntax)
        var queryString = searchQueryStringBuilder('$filter=Era eq ' + '\'' + era + '\'');

        performSearchQuery(queryString, function (err, result) {
            if (err) {
                console.log("Error when filtering by genre: " + err);
            } else if (result && result['value'] && result['value'][0]) {
                //If we have results send them to the showResults dialog (acts like a decoupled view)
                session.replaceDialog('/showResults', { result });
            } else {
                session.endDialog("I couldn't find any musicians in that era :0");
            }
        })
    }
]);


bot.dialog('/musicianSearch', [
    function (session) {
        //Prompt for string input
        builder.Prompts.text(session, "Type in the name of the musician you are searching for:");
    },
    function (session, results) {
        //Sets name equal to resulting input
        var name = results.response;

        var queryString = searchQueryStringBuilder('search= ' + name);
        performSearchQuery(queryString, function (err, result) {
            if (err) {
                console.log("Error when searching for musician: " + err);
            } else if (result && result['value'] && result['value'][0]) {
                //If we have results send them to the showResults dialog (acts like a decoupled view)
                session.replaceDialog('/showResults', { result });
            } else {
                session.endDialog("No musicians by the name \'" + name + "\' found");
            }
        })
    }
]);


bot.dialog('/showResults', [
    function (session, args) {
        var msg = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel);
            args.result['value'].forEach(function (musician, i) {
                msg.addAttachment(
                    new builder.HeroCard(session)
                        .title(musician.Name)
                        .subtitle("Era: " + musician.Era + " | " + "Search Score: " + musician['@search.score'])
                        .text(musician.Description)
                        .images([builder.CardImage.create(session, musician.imageURL)])
                );
            })
            session.endDialog(msg);
    }
]);


/* UTILITY FUNCTIONS */
searchQueryStringBuilder = function (query) {
    return queryString + query;
}

performSearchQuery = function (queryString, callback) {
    request(queryString, function (error, response, body) {
        if (!error && response && response.statusCode == 200) {
            var result = JSON.parse(body);
            callback(null, result);
        } else {
            callback(error, null);
        }
    })
}


/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());
