var User = require('../../models').User
// var random = require('mongoose-random');


// Sort on serverisde only get nearest 20
// give me a zip code filter by that first
// then try last known location 
exports.returnUserLocations = function(req,res) {
  var userZipcode = req.body.userZipcode;
  var queryAmount = req.body.queryAmount || 5;
  
  console.log(userZipcode);
  console.log(queryAmount);
  var userArrayToReturn = [];

  User.find({ zipCode: userZipcode }).
    limit(queryAmount).
      exec(function(err,user){
        if (err) return handleError(err);
        userArrayToReturn.push(user);
        console.log(userArrayToReturn)
        res.send(userArrayToReturn);
      });



// In the future may want to make a random feature in order to keep on getting users randomly until we fill the query amount.
  
  // if (userArrayToReturn.length < queryAmount) {
  //   while(userArrayToReturn.length < queryAmount) {
  //     // keep on finding one until 
      
  //   }
  // }

  

  // go through all users filter out those whose zipcodes don't match
  // then we want to check lenght if length != query amount then get more users
  // Once we have these users return them to client in an array. 


  // return a list of users array with an object with a lat/lng and a 
}

