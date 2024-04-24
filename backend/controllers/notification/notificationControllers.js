const ApplicationError = require('../../utils/error/applicationError.js');
const Guild = require("../../models/guildModel.js");
const Notification = require("../../models/notificationModel.js");
const DEFAULT_CONTENT  = new(require("./default_notification_template"))();
const User = require("../../models/userModel.js");

class NotificationController {
    async getNotifications(req, res, next){
        try{
            const notifications = await Notification.getNotifications(req.session.passport.user);
            let data;
            if (query && query?.length){
                data = Promise.all(notifications.map(async (row)=>{               
                    return {
                        id: row.ID,
                        title: row.TITLE,
                        read: row.READ,
                        type: row.TYPE
                    }
                }));
            }
            return res.status(200).json({
                success: true,
                message: "Data retrieval successful.",
                data: data
            });

        } catch(err) {
            return next(new ApplicationError(400, err));
        }
    }

    async getNotificationDetail(req, res, next){
        try{
            const [notification] = await Notification.getNotification(req.params.nid);
            if (notification && notification?.length){
                let sender;
                if(row.TYPE === 'Guild') sender = await Guild.getGuild(row.SENDER_ID);
                else if(row.TYPE === 'User') sender = await User.getUserById(row.SENDER_ID);
                else {
                    sender = {
                        id: 1,
                        name: "System",
                        imageUrl: "System_Image"
                    }
                }

                if (!sender?.length) return next(new ApplicationError(409));
                await Notification.readNotifications(req.params.nid);
                
                return res.status(200).json({
                    success: true,
                    message: "Data retrieval successful.",
                    data: {
                        id: notification.ID,
                        sender: sender,
                        title: notification.TITLE,
                        description: notification.DESCRIPTION,
                        type: notification.TYPE
                    }
                });
            }

        } catch(err) {
            return next(new ApplicationError(400, err));
        }
    }

    async addNotification(req, res, next){
        try{
            let sender, recipient, title, description;
            if (req.body.type === "Guild") {
                [sender] =  await Guild.getGuild(req.body.senderId);
                [recipient] = await User.getUserById(req.body.recipientId);
                const content = DEFAULT_CONTENT.GUILD(sender.NAME, recipient.NAME);
                title = content.TITLE;
                description = content.DESCRIPTION;
            } else if (req.body.type === "User") {
                [sender] =  await User.getUserById(req.body.senderId);
                [recipient] = await User.getUserById(req.body.recipientId);
                const content = DEFAULT_CONTENT.USER(sender.NAME, recipient.NAME);
                title = content.TITLE;
                description = content.DESCRIPTION;
            } else {
                return next(new ApplicationError(400, "Invalid notification type."));
            }
            const newNotification = await Notification.addNotification(req.body.senderId, req.body.recipientId, title, description, req.body.type);            
            if (newNotification && newNotification.insertId) {
                return res.status(200).json({
                    success: true,
                    message: "Notification created successfully.",
                    data: "OK"
                });
            } else {
                return next(new ApplicationError(500, "Unable to create notification. Please check your database configuration."));
            }
        } catch(err){
            return next(new ApplicationError(400, err));
        }        
    }

    async deleteNotification(req, res, next){
        try{
            const notification = await Notification.deleteNotification(req.params.nid);
            if (notification['affectedRows']){
                return res.status(200).json({
                    success: true,
                    message: "Notification delete successful.",
                    data: "OK"
                });
            } else return next(new ApplicationError(404, "The notification is not found."));
        } catch(err){
            return next(new ApplicationError(400, err));
        }   

    }
}

module.exports = NotificationController;