const UserGuildRelation = require('../models/userGuildRelationModel');
const UserFriend = require('../models/userFriendModel');

class UserGuildRelationController {
  async sendInvitation(req, res) {
    try {      
      const member = await UserGuildRelation.getUserGuildRelation(req.session.passport.user, req.body.guildId);
      console.log(member);
      if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }
      const newmember = await UserGuildRelation.addUserGuildRelation(req.body.userId, req.body.guildId, 'Pending');
      if (newmember['affectedRows']){
        return res.status(200).json(
            {
            success: true,
            message: "Invitation sent successfully.",
            data: "OK"
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json(
          {
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
        }
      );
    }
  }

  async replyInvitation(req, res) {
    try {
      const member = await UserGuildRelation.getUserGuildRelation(req.query.userId, req.query.guildId);
      if (member[0].MEMBERSHIP !== "Pending" || req.query.userId === req.session.passport.user){
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }
      const query = await UserGuildRelation.updateUserGuildRelations(req.query.userId, req.query.guildId, 'Regular');
      if (query['affectedRows']){
        return res.status(200).json(
            {
            success: true,
            message: "Data update successfully.",
            data: "OK"
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json(
          {
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
        }
      );
    }
  }

  async updateUserGuildRelations(req, res) {
    try {
      const member = await UserGuildRelation.getUserGuildRelation(req.session.passport.user, req.body.guildId);
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
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
        }
      );
    }
  }

  async deleteUserGuildRelations(req, res) {
    try {
      const member = await UserGuildRelation.getUserGuildRelation(req.session.passport.user, req.params.guildId);      
      const isMaster = member[0].MEMBERSHIP === "Master";
      const isCurrentUser = req.session.passport.user === req.params.userId;
      if (((!isMaster && isCurrentUser) || (isMaster && !isCurrentUser)) && member?.length){
        const query = await UserGuildRelation.deleteUserGuildRelations(req.params.userId, req.params.guildId);
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
      } else {
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }

    } catch (err) {
      console.log(err);
      return res.status(400).json(
          {
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
        }
      );
    }
  }

}

module.exports = UserGuildRelationController;