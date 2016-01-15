var User = require('../../models').User;

exports.climbFlag = function(req, res) {
  var authUser = req.decoded.user;
  var updateSender = false;
  var sender;

  if (req.body.from) {
    updateSender = true;
    sender = req.body.from.sender.username;
  }
  //find User
  User.findOne({ username: authUser }, function(err, user) {
    if (err) console.error(err);
    if (!user) {
      res.json({ success: false, reason: 'User not found' });
    } else {
      switch (req.method) {
        case 'PUT' :
          if (updateSender) {
            User.findOne({ username: sender }, function(err, sender) {
              if (err) console.error(err);
              if (!sender) {
                res.json({ success: false, reason: 'Sender not found' });
              } else {
                sender.climb = false;
                sender.save(function(err, user) {
                  if (err) console.error(err);
                });
              }
            });
            user.climb = false;
          } else {
            user.climb = !user.climb;
          }
          user.save(function(err, user) {
            if (err) console.error(err);
            res.json({ success: true, status: user.climb });
          });
          break;

        case 'GET':
          res.json({ success: true, status: user.climb });
          break;
      }
    }
  });
};
