var request = require('request');
var rp = require('request-promise-native');


exports.sendMessage = function(objectToSend) {

    var options = {
        method: 'POST',
        uri: 'https://hooks.zapier.com/hooks/catch/373280/cfmxar/',
        body: objectToSend,
        json: true
      };
     
    return rp(options);
}