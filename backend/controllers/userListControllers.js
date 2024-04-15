const User = require('../models/userModel');
const UserFriend = require('../models/userFriendModel');

class UserListController {
  async getUsers(req, res) {     
    try {  
        const query = await User.getUserByName('rex');
        if (query?.length){
          const users = query.map(row =>({
            id: row.ID,
            name: row.NAME,
            imageUrl: row.IMAGE_URL,
            rank: row.RANK
          }))
          return res.status(200).json({
            success: true,
            message: "User data retrieval successful",
            data: users
          });
        } else {
          const users = [];
          return res.status(200).json({
            success: true,
            message: "User data retrieval successful",
            data: users
          });
        }
        
    } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Bad Request: The request cannot be processed due to invalid information.",
          data: "Bad Request"
        });
    }
  }

  async sendInvitation(req, res) {     
    try {  
        const USER_ID = req.session.passport.user;
        const FRIEND_ID = req.body.userId 
        const query = await UserFriend.addFriend(USER_ID, FRIEND_ID);
        if (query['insertId']){
          return res.status(200).json({
            success: true,
            message: "User data retrieval successful",
            data: "OK"
          });
        } else {
          return res.status(404).json({
            success: false,
            message: "The requested resource was not found.",
            data: "Not Found"
          });
        }
        
    } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Bad Request: The request cannot be processed due to invalid information.",
          data: "Bad Request"
        });
    }
  }
}

module.exports = UserListController;