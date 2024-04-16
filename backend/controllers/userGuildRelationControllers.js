const UserGuildRelation = require('../models/userGuildRelationModel');

class UserGuildRelationController {
  async addUserGuildRelations(req, res) {
    try {     
      const newUserGuildRelation = await UserGuildRelation.addUserGuildRelation(req.body.userId, req.body.guildId, 'Regular');
      console.log(newUserGuildRelation)
      if (newUserGuildRelation['affectedRows']){
        return res.status(200).json(
            {
            "success": true,
            "message": "Data uploaded successfully.",
            "data": "OK"
        });
      }
    } catch (err) {
        return res.status(400).json(
            {
            "success": false,
            "message": "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
            "data": "Bad Request"
          }
        );
    }
  }

  async updateUserGuildRelations(req, res) {
    try {
      const member = await UserGuildRelation.getMembership(req.session.passport.user, req.body.guildId);
      if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }
      const query = await UserGuildRelation.updateUserGuildRelations(req.body.userId, req.body.guildId, req.body.membership);
      if (query['affectedRows']){
        return res.status(200).json(
            {
            success: true,
            message: "Data update successfully.",
            data: "OK"
        });
      } else{
        return res.status(404).json({
            success: false,
            message: "The requested resource was not found.",
            data: "Not Found"
        });                
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json(
          {
          "success": false,
          "message": "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          "data": "Bad Request"
        }
      );
    }
  }

}

module.exports = UserGuildRelationController;