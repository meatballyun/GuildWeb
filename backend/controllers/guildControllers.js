const Guild = require('../models/guildModel');
const UserGuildRelation = require('../models/userGuildRelationModel');
const User = require('../models/userModel');

const checkAuth = async (user, gid, level) => {
  let message = "OK";   
  const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(user, gid); 
  if (!member?.length && level >= 0){
    message = "You are not a member of this guild.";
  } else if ((member[0].MEMBERSHIP !== "Admin" && member[0].MEMBERSHIP !== "Master") && level >= 1){
    message = "Only guild Master and Admin have permission to access this resource.";
  } else if ((member[0].MEMBERSHIP !== "Master") && level >= 2){
    message = "Only guild Master have permission to access this resource.";
  }
  
  return { message, member };
}
class GuildAuth {
  async isMember(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 0);
    console.log(message);
    if (message === "OK"){
      req.member = member;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: message,
        data: "Forbidden"
      });
    }
  } 
  async isMasterOrAdmin(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 1);
    if (message === "OK"){
      req.member = member;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: message,
        data: "Forbidden"
      });
    }
  }
  async isMaster(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 2);
    if (message === "OK"){
      req.member = member;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: message,
        data: "Forbidden"
      });
    }
  }
}

class GuildController {
  async addGuild(req, res) {
    try {     
      const newGuild = await Guild.addGuild(req.session.passport.user, req.body.name, req.body.description, req.body.imageUrl, false);
      if (newGuild['insertId']){
        const newUserGuildRelation = await UserGuildRelation.addUserGuildRelation(req.session.passport.user, newGuild['insertId'], 'Master');
        if (newUserGuildRelation['affectedRows']){
          return res.status(200).json(
              {
              "success": true,
              "message": "Data uploaded successfully.",
              "data": "OK"
          });
        }
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

  async updateGuild(req, res) {
    try {     
      const guild = await Guild.updateGuild(req.params.gid, req.body.name, req.body.description, req.body.imageUrl);
      if (guild.affectedRows){
        return res.status(200).json({
            success: true,
            message: "Data update successfully.",
            data: {
                id: req.params.gid
            }
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

  async getGuilds(req, res) {
    try {    
      const query = await UserGuildRelation.getUserGuildRelationByUser(req.session.passport.user);
      if (query?.length){
        let guild;
        const guilds = await Promise.all(query.map(async(row)=>{
          guild = await Guild.getGuild(row.GUILD_ID);
          return {
            id: guild[0].ID,
            name: guild[0].NAME,
            imageUrl: guild[0].IMAGE_URL
          }
        }))

        return res.status(200).json({
            success: true,
            message: "Data retrieval successfully.",
            data: guilds
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

  async getGuildDetail(req, res) {
    try {   
      const [ guild ] = await Guild.getGuild(req.params.gid);

      return res.status(200).json({
          success: true,
          message: "Data retrieval successfully.",
          data: {
            id: guild.ID,
            name: guild.NAME,
            description: guild.DESCRIPTION,
            imageUrl: guild.IMAGE_URL,
          }
      })
      
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

  async daleteGuild(req, res) {
    try {      
      const query = await Guild.daleteGuild(req.params.gid);
      if (query.affectedRows){
        return res.status(200).json({
            success: true,
            message: "Data update successfully.",
            data: {
                id: req.params.gid
            }
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

class UserGuildRelationController {
  async sendInvitation(req, res) {
    try {      
      if (req.member?.length)
      return res.status(409).json({
        success: false,
        message: "The player has already been invited to join this guild. Please do not resend the invitation.",
        data: "Conflict"
      });
      const newmember = await UserGuildRelation.addUserGuildRelation(req.body.userId, req.params.gid, 'Pending');
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
      if (!req.member?.length) {
        return res.status(409).json({
          success: false,
          message: "An error occurred while processing your invitation.",
          data: "Conflict"
        });
      }
      if (req.member[0].MEMBERSHIP !== "Pending"){
        return res.status(410).json({
          success: false,
          message: "You are already a member of this guild. The invitation cannot be accepted.",
          data: "Gone"
        });
      }
      const query = await UserGuildRelation.updateUserGuildRelations(req.session.passport.user, req.params.gid, 'Regular');
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

  async getMember(req, res) {
    try {
      let guildMembers;
      const getGuildMembers = await UserGuildRelation.getUserGuildRelationByGuild(req.params.gid);
      if (getGuildMembers?.length){
        guildMembers = await Promise.all( getGuildMembers.map( async (row) => {
          const [ user ] = await User.getUserById(row.USER_ID);
          const membership = await UserGuildRelation.getUserGuildRelationByGuildAndUser(user.ID, req.params.gid);
          return {
            id: user.ID,
            name: user.NAME,
            imageUrl: user.IMAGE_URL,
            rank: user.RANK,
            membership: membership[0].MEMBERSHIP
          }
        }));
      }
      
      return res.status(200).json(
          {
          success: true,
          message: "You have successfully accepted the invitation and joined the guild.",
          data: guildMembers
      });
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

  async updateMember(req, res) {
    try {
      const query = await UserGuildRelation.updateUserGuildRelations(req.body.userId, req.params.gid, req.body.membership);
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

  async deleteMember(req, res) {
    try {
      const isMaster = (req.member[0].MEMBERSHIP === "Master");
      const isCurrentUser = (req.session.passport.user === req.params.uid);

      if ((!isMaster && isCurrentUser) || (isMaster && !isCurrentUser)){
        const query = await UserGuildRelation.deleteUserGuildRelations(req.params.uid, req.params.gid);
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

module.exports = { GuildAuth, GuildController, UserGuildRelationController };