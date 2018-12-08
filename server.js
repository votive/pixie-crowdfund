const express = require('express');
const express_graphql = require('express-graphql');
const app = express();
const chalk = require('chalk');
const crowdfunding = require('./modules/crowdfunding');
const notify = require('./modules/notify');
const graphQl = require('./modules/graphql');




app.get('/crowdfunding', function(req, res) {
  res.send(graphQl.currentRaiseDetails);
})

app.use('/graphql', express_graphql({
  schema: graphQl.schema,
  rootValue: graphQl.root,
  graphiql: true
}));



function notifyCrowdfundChange(previousDetails, newDetails)
{
  console.log(`${new Date()}--Details have changed!`);
  console.log(chalk.yellow("  Previous details:"), previousDetails);
  console.log(chalk.yellow("  New details:"), newDetails);  

  var changeAmount = 0;
  if (previousDetails && newDetails)
  {
    changeAmount = newDetails.amountRaised - previousDetails.amountRaised;
  }

  notify.sendMessage({
    message: "Crowdfunding details have changed",
    previousDetails: previousDetails,
    newDetails: newDetails,
    changeAmount: changeAmount
  })
  .then(() => {
    console.log("Sent notification successfully");
  })
  .catch((err) => {
    console.log("Could not send notification");
  })
}


function updateCrowdfundDetails() {

  crowdfunding.getDetails().then((crowdfundDetails) => {

    console.log(`${new Date()}--Fetched amount raised`);
    
    graphQl.previousRaiseDetails = graphQl.currentRaiseDetails;
    graphQl.currentRaiseDetails = crowdfundDetails;

    if (graphQl.previousRaiseDetails == null ||
        graphQl.previousRaiseDetails.amountRaised != graphQl.currentRaiseDetails.amountRaised)
    {
      notifyCrowdfundChange(graphQl.previousRaiseDetails, graphQl.currentRaiseDetails);
    }
  })
  .catch((err) => {
    console.log("Unable to fetch amount raised.");
  }); 
}


setInterval(updateCrowdfundDetails, 300000);
updateCrowdfundDetails();

app.listen('8081')
