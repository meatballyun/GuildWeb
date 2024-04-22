const Guild = require('../../models/guildModel');
const UserGuildRelation = require('../../models/userGuildRelationModel');
const User = require('../../models/userModel');
const ApplicationError = require('../../utils/error/applicationError.js');

const checkAuth = async (user, gid, level) => {
  let message = "OK";   
  const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(user, gid); 
  if ((!member?.length) && (level >= 0)){
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
    if (message === "OK"){
      req.member = member;
      next();
    } else {
      return next(new ApplicationError(403, message));
    }
  } 
  async isMasterOrAdmin(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 1);
    if (message === "OK"){
      req.member = member;
      next();
    } else {
      return next(new ApplicationError(403, message));
    }
  }
  async isMaster(req, res, next) {
    const { message, member } = await checkAuth(req.session.passport.user, req.params.gid, 2);
    if (message === "OK"){
      req.member = member;
      next();
    } else {
      return next(new ApplicationError(403, message));
    }
  }
}

class GuildController {
  async addGuild(req, res, next) {
    try {     
      const newGuild = await Guild.addGuild(req.session.passport.user, req.body.name, req.body.description, req.body.imageUrl, false);
      if (newGuild['insertId']){
        const newUserGuildRelation = await UserGuildRelation.addUserGuildRelation(req.session.passport.user, newGuild['insertId'], 'Master');
        if (newUserGuildRelation['affectedRows']){
          return res.status(200).json(
              {
              "success": true,
              "message": "Data build successfully.",
              "data": "OK"
          });
        }
      }
    } catch (err) {
      return next(new ApplicationError(400,err));
    }
  }

  async updateGuild(req, res, next) {
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
      return next(new ApplicationError(400, err));
    }
  }

  async getGuilds(req, res, next) {
    try {
      const query = req.query.q ? await UserGuildRelation.getUserGuildRelationByUserAndName(req.session.passport.user, req.query.q) : await UserGuildRelation.getUserGuildRelationByUser(req.session.passport.user);
      let guild, guilds;
      if (query?.length){
          guilds = await Promise.all(query.map(async(row)=>{
            guild = await Guild.getGuild(row.GUILD_ID);
            return {
              id: guild[0].ID,
              name: guild[0].NAME,
              imageUrl: guild[0].IMAGE_URL
            }
          }))
      }
      return res.status(200).json({
          success: true,
          message: "Data retrieval successfully.",
          data: guilds
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async getGuildDetail(req, res, next) {
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
      return next(new ApplicationError(400, err));
    }
  }

  async deleteGuild(req, res, next) {
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
      return next(new ApplicationError(400, err));
    }
  }
}

class UserGuildRelationController {
  async sendInvitation(req, res, next) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.body.userId, req.params.gid);
      if (member?.length) {
        return next(new ApplicationError(409, "The player has already been invited to join this guild. Please do not resend the invitation."));
      }
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
      return next(new ApplicationError(400));
    }
  }

  async replyInvitation(req, res, next) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.params.gid);
      if (!member?.length) {
        return next(new ApplicationError(409, "An error occurred while processing your invitation."));
      }
      if (member[0].MEMBERSHIP !== "Pending"){
        return next(new ApplicationError(410, "You are already a member of this guild. The invitation cannot be accepted."));
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
      return next(new ApplicationError(400));
    }
  }

  async getMember(req, res, next) {
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
      
      return res.status(200).json({
          success: true,
          message: "You have successfully accepted the invitation and joined the guild.",
          data: guildMembers
      });
    } catch (err) {      
      return next(new ApplicationError(400));
    }
  }

  async updateMember(req, res, next) {
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
        return next(new ApplicationError(404, "The member you are trying to edit does not exist in the guild. Please check the member's information and try again."));               
      }
    } catch (err) {
      return next(new ApplicationError(400));
    }
  }

  async deleteMember(req, res, next) {
    try {
      const isMaster = (req.member[0].MEMBERSHIP === "Master");
      const isCurrentUser = (req.session.passport.user == req.params.uid);
      if (isMaster && isCurrentUser){
        return next(new ApplicationError(403, "Guild leader cannot delete themselves out of the guild."));          
      } else if (isMaster || isCurrentUser){
        const query = await UserGuildRelation.deleteUserGuildRelations(req.params.uid, req.params.gid);
        if (query['affectedRows']){
          return res.status(200).json({
              success: true,
              message: "Data update successfully.",
              data: "OK"
          });
        } else{
            return next(new ApplicationError(404, "The member you are trying to edit does not exist in the guild. Please check the member's information and try again."));          
        }
      } else {
        return next(new ApplicationError(403), "Only guild Master have permission to access this resource.");
      }

    } catch (err) {
      return next(new ApplicationError(400));
    }
  }
}

module.exports = { GuildAuth, GuildController, UserGuildRelationController };