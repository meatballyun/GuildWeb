const UserGuildRelation = require('../models/userGuildRelationModel');

class UserGuildRelationController {
  async sendInvitation(req, res) {
    try {      
      let member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.body.guildId);
      if (!member?.length){
        return res.status(403).json({
            success: false,
            message: "You are not a member of this guild.",
            data: "Forbidden"
        });                
      }else if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
          data: "Forbidden"
        });
      }
      member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.body.userId, req.body.guildId);
      if (member?.length)
      return res.status(409).json({
        success: false,
        message: "The player has already been invited to join this guild. Please do not resend the invitation.",
        data: "Conflict"
      });
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
      return res.status(400).json({
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
        }
      );
    }
  }

  async replyInvitation(req, res) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.query.guildId);
      if (!member?.length) {
        return res.status(409).json({
          success: false,
          message: "An error occurred while processing your invitation.",
          data: "Conflict"
        });
      }
      if (member[0].MEMBERSHIP !== "Pending"){
        return res.status(410).json({
          success: false,
          message: "You are already a member of this guild. The invitation cannot be accepted.",
          data: "Gone"
        });
      }
      const query = await UserGuildRelation.updateUserGuildRelations(req.session.passport.user, req.query.guildId, 'Regular');
      if (query['affectedRows']){
        return res.status(200).json(
            {
            success: true,
            message: "You have successfully accepted the invitation and joined the guild.",
            data: "OK"
        });
      }
    } catch (err) {
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
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.body.guildId);
      if (!member?.length){
        return res.status(403).json({
            success: false,
            message: "You are not a member of this guild.",
            data: "Forbidden"
        });                
      }else if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
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
      } else if (!query?.length){
        return res.status(404).json({
            success: false,
            message: "The member you are trying to edit does not exist in the guild. Please check the member's information and try again.",
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
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.params.guildId);
      const isMaster = member[0].MEMBERSHIP === "Master";
      const isCurrentUser = req.session.passport.user === req.params.userId;

      if (!member?.length){
        return res.status(403).json({
            success: false,
            message: "You are not a member of this guild.",
            data: "Forbidden"
        });                
      } else if (((!isMaster && isCurrentUser) || (isMaster && !isCurrentUser))){
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
              message: "The member you are trying to edit does not exist in the guild. Please check the member's information and try again.",
              data: "Not Found"
          });                
        }
      } else {
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
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