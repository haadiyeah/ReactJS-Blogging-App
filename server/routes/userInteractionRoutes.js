const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
//getting other modeels
const User = require('../models/User');
const Blog = require('../models/Blog');
const Notification = require('../models/Notification');

//endpoint to follow a blogger
router.post('/follow/:userId', authenticateToken, async (req, res) => {
    try {
        //getting the blogger
        const bloggerToFollow = await User.findById(req.params.userId);

        if (!bloggerToFollow) {
            return res.status(404).send('Blogger not found');
        }

        //if trying to follow urself (...seriously??)
        if (req.params.userId == req.user.id) {
            return res.status(422).send('Cannot follow yourself');
        }

        //if already following the blogger
        if (bloggerToFollow.followers.includes(req.user.id)) { //_id gives objectid type, .id gives string
            return res.status(422).send('You are already following this blogger');
        }

        //update the followers list
        bloggerToFollow.followers.push(req.user.id);

        //constructing notification
        let notifString = req.user.username + " just followed you!";

        //new notif object
        const notification = new Notification({
            user: bloggerToFollow.id,
            type: 'follower',
            details: {
                follower: req.user.id,
            },
            notifText: notifString,
        });
        await notification.save(); //saving in db

        bloggerToFollow.notifications.push(notification);

        await bloggerToFollow.save();//updating in db

        //success
        res.status(200).send('Successfully followed the blogger');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred in following the blogger');
    }
});

//unfollow a blogger
router.post('/unfollow/:userId', authenticateToken, async (req, res) => {
    try {
        //Getting the blogger to unfollow
        const bloggerToUnfollow = await User.findById(req.params.userId);

        if (!bloggerToUnfollow) {
            return res.status(404).send('Blogger not found');
        }

        //if trying to unfollow yourself (...seriously??)
        if (req.params.userId == req.user.id) {
            return res.status(422).send('Cannot unfollow yourself');
        }

        //if not following the blogger
        console.log(req.user.id);
        if (!bloggerToUnfollow.followers.includes(req.user.id)) {
            return res.status(422).send('You are not following this blogger');
        }

        //re-assigning  the follower list of blogger to unfollow
        bloggerToUnfollow.followers = bloggerToUnfollow.followers.filter(followerId => followerId != req.user.id);

        //constructing notification
        let notifString = req.user.username + " just unfollowed you!";

        //new notif object
        const notification = new Notification({
            user: bloggerToUnfollow.id,
            type: 'follower',
            details: {
                follower: req.user.id,
            },
            notifText: notifString,
        });
        await notification.save(); //saving in db

        bloggerToUnfollow.notifications.push(notification);

        await bloggerToUnfollow.save();//update in db

        //success
        res.status(200).send('Successfully unfollowed the blogger');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred in unfollowing the blogger');
    }
});


//get all notifications of a user (read/unread)
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        //console.log(req.user.id);
        const notifications = await Notification.find({ user: req.user.id }, 'type notifText details createdAt')
            .sort({ createdAt: -1 }) //sort by creation date in descending order

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications');
    }
});

//get unread notifications
router.get('/notifications/unread', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id, read: false }, 'type notifText details createdAt')
            .sort({ createdAt: -1 }) //sort by creation date in descending order

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications');
    }
});

//mark notification as read
router.put('/notifications/read/:notificationId', authenticateToken, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.notificationId);
        if (!notification || notification.user.toString() !== req.user._id.toString()) {
            return res.status(404).send('Notification not found');
        }

        //updating status of notif and saving it
        notification.read = true;
        await notification.save();

        res.status(200).send('Notification marked as read');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error marking notification as read');
    }
});


//get user's feed with posts from followed bloggers
router.get('/feed', authenticateToken, async (req, res) => {
    try {
        let userId = req.user._id;

        //Find bloggers whose followers array contains the user ID,i.e, the user follows them
        let bloggers = await User.find({ followers: { $in: userId } });
        let bloggersIds = bloggers.map(blogger => blogger._id);//get their ids

        //Get blog posts from the followed bloggers
        const feed = await Blog.find({ owner: { $in: bloggersIds } })
            .sort({ createdAt: -1 }); // Sort by creation date in descending order

        res.status(200).json(feed); //return feed in json form
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving feed');
    }
});

module.exports = router;
