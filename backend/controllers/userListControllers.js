const User = require('../models/userModel');
const UserFriend = require('../models/userFriendModel');

class UserListController {
  async getUsers(req, res) {     
    try {  
        const query = await User.getUserByName(req.query.q);
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
        const query = await UserFriend.addFriend(req.session.passport.user, req.body.userId);
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

  async updateFriends(req, res) {     
    try {
      const query = await UserFriend.updateFriend(req.body.userId, req.session.passport.user, req.body.status);
      if (query.affectedRows){
        return res.status(200).json({
          success: true,
          message: "Data updated successfully.",
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

  async getFriends(req, res) {     
    try {  
        const query = req.query.q ? await User.getFriend(req.query.q) : await User.getFriend(req.session.passport.user);
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

  async deleteFriend(req, res) {     
    try {  
        const query = await UserFriend.deleteFriend(req.session.passport.user, req.query.id);
        console.log(query);
        if (query.affectedRows){
          return res.status(200).json({
            success: true,
            message: "UserFriend record successfully deleted.",
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