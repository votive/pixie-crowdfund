var request = require('request');
var rp = require('request-promise-native');
var cheerio = require('cheerio');


exports.getDetails = function() {

    var options = {
        uri: 'https://www.crowdcube.com/companies/pixie/pitches/ZNAjPl',
        transform: function (body) {
            return cheerio.load(body);
        }
      };
     
    return rp(options)
        .then(function ($) {

            lastRefreshTime = new Date();
            const newAmount = parseFloat($('.cc-pitchHead__statsMain > dl:nth-child(2) > dd:nth-child(2)')
                            .text()
                            .replace(/[£,]/g,'')
                            .trim());

            return {
                amountRaised: newAmount,
                lastRefreshTime: lastRefreshTime
            };
        })
}
