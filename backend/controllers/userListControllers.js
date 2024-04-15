const User = require('../models/userModel');

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

}

module.exports = UserListController;