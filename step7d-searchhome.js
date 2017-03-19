require('dotenv-extended').load();
var builder       = require('botbuilder');
var restify       = require('restify');
var _             = require('lodash');
var util          = require('util');
var SearchLibrary = require('./utils/SearchDialogLibrary');
var AzureSearch   = require('./utils/SearchProviders/azure-search');
var connector     = new builder.ChatConnector({appId: process.env.MICROSOFT_APP_ID, appPassword: process.env.MICROSOFT_APP_PASSWORD});
var bot           = new builder.UniversalBot(connector);

// Azure Search
var azureSearchClient      = AzureSearch.create(process.env.SEARCH_NAME, process.env.SEARCH_KEY, process.env.SEARCH_INDEX);
var realStateResultsMapper = SearchLibrary.defaultResultsMapper(realstateToSearchHit);

bot.dialog('/', [
    function (session) {
        // Trigger Search
        SearchLibrary.begin(session);
    },
    function (session, args) {
        // Process selected search results
        session.send(
            'Done! For future reference, you selected these properties: %s',
            args.selection.map(function (i) { return i.key; }).join(', '));
    }
]);


// Register Search Dialogs Library with bot
bot.library(SearchLibrary.create({
    multipleSelection: true,
    search: function (query) { return azureSearchClient.search(query).then(realStateResultsMapper); },
    refiners: ['region', 'city', 'type', 'beds'],
    refineFormatter: function (refiners) {
        return _.zipObject(
            refiners.map(function (r) { return 'By ' + _.capitalize(r); }),
            refiners);
    }
}));

// Maps the AzureSearch RealState Document into a SearchHit that the Search Library can use
function realstateToSearchHit(realstate) {
    return {
        key: realstate.listingId,
        title: util.format('%d bedroom, %d bath in %s, $%s',
            realstate.beds, realstate.baths, realstate.city, realstate.price.toFixed(2)),
        description: realstate.description_it,
        imageUrl: realstate.thumbnail
    };
}

/* LISTEN IN THE CHAT CONNECTOR */
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
server.post('/api/messages', connector.listen());
