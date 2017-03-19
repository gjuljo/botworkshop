var request = require('request');

function Client(opts) {
    if (!opts.knowledgebaseId) throw new Error('knowledgebaseId is required');
    if (!opts.subscriptionKey) throw new Error('subscriptionKey is required');
    
    var self = this;
    this.knowledgebaseId = opts.knowledgebaseId;
    this.subscriptionKey = opts.subscriptionKey;
}

Client.prototype.get = function (opts, cb) {
    return new Promise((resolve, reject) => {

        if (!opts.question) throw new Error('question is required');
        var top  = opts.top || 3;

        cb = cb || (() => {});
        var self = this;

        var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/' + self.knowledgebaseId + '/generateAnswer';

        var options = {
            url : url,
            method : 'POST',
  			headers: {
    		    'Content-Type': 'application/json',
    			'Ocp-Apim-Subscription-Key': self.subscriptionKey
  			},
			body: JSON.stringify({"question": opts.question, "top":3})            
        };

        return request(options, function(err, response, result) {
            if (err) {
                reject(err);
                return cb(err);
            }

            if (response.statusCode !== 200) {
                var error = new Error('Error invoking web request, statusCode: ' + 
                    response.statusCode + ' statusMessage: ' + 
                    response.statusMessage + ' URL: ' + options.url);

                reject(error);
                return cb(error)
            }

            resolve(result);
            return cb(null, result);
        });
    });
}

module.exports = Client;