const { buildSchema } = require('graphql');

// GraphQL schema
exports.schema = buildSchema(`
    type Query {
        currentCrowdfundDetails: CrowdfundDetails
        previousCrowdfundDetails: CrowdfundDetails
    },
    type CrowdfundDetails {
        amountRaised: Float,
        lastRefreshTime: String,
        targetAmount: Float,
        percentageRaised: Float
    }
`);


exports.previousRaiseDetails = null;
exports.currentRaiseDetails = null;


const getCurrentCrowdfundDetails = function(args) { 
    return exports.currentRaiseDetails;
}

const getPreviousCrowdfundDetails = function(args) {
    return exports.previousRaiseDetails;
}


// Root resolver
exports.root = {
    currentCrowdfundDetails: getCurrentCrowdfundDetails,
    previousCrowdfundDetails: getPreviousCrowdfundDetails
};
