const express = require('express');
const app = express();
const chalk = require('chalk');
const crowdfunding = require('./modules/crowdfunding');
const notify = require('./modules/notify');


var previousRaiseDetails = null;
var currentRaiseDetails = null;


app.get('/crowdfunding', function(req, res) {

  res.send(currentRaiseDetails);
})


function notifyCrowdfundChange(previousDetails, newDetails)
{
  console.log(`${new Date()}--Details have changed!`);
  console.log(chalk.yellow("  Previous details:"), previousDetails);
  console.log(chalk.yellow("  New details:"), newDetails);  

  notify.sendMessage({
    message: "Crowdfunding details have changed",
    previousDetails: previousDetails,
    newDetails: newDetails
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
    
    previousRaiseDetails = currentRaiseDetails;
    currentRaiseDetails = crowdfundDetails;

    if (previousRaiseDetails == null ||
        previousRaiseDetails.amountRaised != currentRaiseDetails.amountRaised)
    {
      notifyCrowdfundChange(previousRaiseDetails, currentRaiseDetails);
    }
  })
  .catch((err) => {
    console.log("Unable to fetch amount raised.");
  }); 
}


setInterval(updateCrowdfundDetails, 300000);
updateCrowdfundDetails();

app.listen('8081')
