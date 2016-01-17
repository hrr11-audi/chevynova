var User = require('../../models').User,
    Notification = require('../../models').Notification;

function sendNotification (req, res) {
  var authUser = req.decoded.user;
  var targetUser = req.body.targetUser;
  var newNotification;

  User.findOne({ username: authUser }, function(err, sender) {
    if (err) console.error(err);

    if (!sender) {
      res.json({ success: false, reason: 'User not found' });
    } else {
      User.findOne({ username: targetUser }, function(err, target) {

        newNotification = new Notification({
          sender: {
            id: sender.id._id,
            username: sender.username
          },
          recipient: target._id
        });

        newNotification.save(function(err, notification) {
          if (err) console.error(err);

          sender.notifications.outgoing.push(notification._id);
          target.notifications.incoming.push(notification._id);

          sender.save(function(err) {
            if (err) console.error(err);
          });
          target.save(function(err) {
            if (err) console.error(err);
          });
          res.json({ success: true });
        });
      });
    }
  });
}

function getNotifications(req, res) {
  var authUser = req.decoded.user;

  User.findOne({ username: authUser }, function(err, user) {

    if (err) console.error(err);

    if (!user) {
      res.json({ success: false, reason: 'User does not exist' });
    } else {

      Notification.find({ _id: { $in: user.notifications.incoming }}, function(err, notifications) {

        if (err) console.error(err);

        var respNotifications = notifications.map(function(notification) {

          if (!notification.isResolved) {
            return {
              id: notification._id,
              sender: {
                username: notification.sender.username
              },
              isRead: notification.isRead,
              createdAt: notification.createdAt
            };
          }
        }).filter(function(item) {
          return !!item;
        });
        res.json(respNotifications);
      });
    }
  });
}

function readNotifications(req, res) {
  var authUser = req.decoded.user;

  User.findOne({ username: authUser }, function(err, user) {
    if (err) console.error(err);

    if (!user) {
      res.json({ success: false, reason: 'User does not exist' });
    } else {

      Notification.find({ _id: { $in: user.notifications.incoming }}, function(err, notifications) {

        notifications.forEach(function(notification) {
          notification.markRead();
          notification.save();
        });

        res.json({ success: true });
      });
    }
  });
}

function replyNotification(req, res) {
  var notificationId = req.body.notificationId;
  var reply = req.body.reply;

  Notification.findById(notificationId, function(err, notification) {
    if (err) console.error(err);

    notification.markAccepted(reply);
    notification.markResolved();
    notification.save(function(err, notification) {
      res.json({ success: true });
    });
  });
}

//returns number of user's unread messages
function checkUnread(req, res) {
  var authUser = req.decoded.user;

  User.findOne({ username: authUser }, function(err, user) {
    if (err) console.error(err);

    if (!user) {
      res.sendStatus(401);
    } else {
      Notification.find({ _id: { $in: user.notifications.incoming }}, function(err, notifications) {
        if (err) console.error(err);

        var unread = notifications.filter(function(notification) {
          return notification.isRead === false;
        }).length;

        res.json(unread);
      });
    }
  });
}

module.exports = {
  sendNotification: sendNotification,
  getNotifications: getNotifications,
  readNotifications: readNotifications,
  replyNotification: replyNotification,
  checkUnread: checkUnread
};
