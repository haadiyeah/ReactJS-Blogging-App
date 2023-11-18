const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: { 
        type: String, //valid types : 'follower', 'comment', 'rate'
        required: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed, //store additional details based on notification type
    },
    read: { ///to handle read/unread notifications
        type: Boolean,
        default: false,
    },
    notifText: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
