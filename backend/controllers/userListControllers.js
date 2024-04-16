const User = require('../models/userModel');
const UserFriend = require('../models/userFriendModel');

class UserListController {
  async getUsers(req, res) {     
    try {  
        const query = await User.getUserByName(req.query.q);
        if (query?.length){
          const users = await Promise.all( query.map( async (row) => {
            let status = "None";
            const query = await UserFriend.getFriendStatus(req.session.passport.user, row.ID);
            if (query[0]?.STATUS === "Confirmed") status = "Confirmed";
            else if (query[0]?.STATUS === "Pending") status = "Pending Response";
            else {
              const q = await UserFriend.getFriendStatus(row.ID, req.session.passport.user);
              if (q[0]?.STATUS === "Pending") status = "Pending Confirmation";
            }
            return {
              id: row.ID,
              name: row.NAME,
              imageUrl: row.IMAGE_URL,
              rank: row.RANK,
              status: status
            }
          }))
          return res.status(200).json({
            success: true,
            message: "User data retrieval successful",
            data: users.filter((row)=>{ return req.session.passport.user !== row.id })
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
      console.log(err);
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
      console.log(query);
      if (query['affectedRows']){
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
      console.log(err);
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
      const query = req.query.q ? await UserFriend.getFriends(req.query.q) : await UserFriend.getFriends(req.session.passport.user);
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