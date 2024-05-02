const ApplicationError = require('../../utils/error/applicationError.js');
const Guild = require('../../models/guildModel');
const User = require('../../models/userModel');
const Adventurer = require('../../models/adventurerModel');
const Task = require('../../models/taskModel');
const RepetitiveTask = require('../../models/repetitiveTaskModel');
const Item = require('../../models/itemModel');
const ItemRecord = require('../../models/itemRecordModel');
const UserGuildRelation = require('../../models/userGuildRelationModel');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;

const checkAuth = async (user, gid, level) => {
  let message = "OK";   
  const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(user, gid); 
  if ((!member?.length) && (level >= 0)){
    message = "You are not a member of this guild, or you have not been invited.";
  } else if ((member[0].MEMBERSHIP !== "Vice" && member[0].MEMBERSHIP !== "Master") && level >= 1){
    message = "Only guild Master and Vice have permission to access this resource.";
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
  async isMasterOrVice(req, res, next) {
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
  async getGuilds(req, res, next) {
    try {
      const query = req.query.q ? await UserGuildRelation.getUserGuildRelationByUserAndName(req.session.passport.user, req.query.q) : await UserGuildRelation.getUserGuildRelationByUser(req.session.passport.user);
      let guilds = [];
      if (query?.length){
        guilds = await Promise.all(query.map(async(row)=>{
            const [guild] = await Guild.getGuild(row.GUILD_ID);
            const [userGuildRelation] = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, row.GUILD_ID);
            return {
              id: guild.ID,
              membership: userGuildRelation.MEMBERSHIP,
              name: guild.NAME,
              imageUrl: guild.IMAGE_URL
            }
          }))
      }
      return res.status(200).json({
          success: true,
          message: "Data retrieval successfully.",
          data: guilds.filter((row)=>{ return row.membership !== "Pending" })
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
            cabin: guild.CABIN
          }
      })      
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async addGuild(req, res, next) {
    try {     
      const newGuild = await Guild.addGuild(req.session.passport.user, req.body.name, req.body.description, req.body.imageUrl, false);
      if (newGuild['insertId']){
        const newUserGuildRelation = await UserGuildRelation.addUserGuildRelation(req.session.passport.user, newGuild['insertId'], 'Master');
        if (newUserGuildRelation['affectedRows']){
          await updateUserExp(1, req.session.passport.user);
          return res.status(200).json(
              {
              "success": true,  
              "message": "Data build successfully.",
              "data": {
                id: newGuild['insertId']
              }
          });    
        }  
      }  
    } catch (err) {
      return next(new ApplicationError(400,err));
    }  
  }

  async addCabin(req, res, next) {
    try {
      const description = `In your Personal Cabin, you have the flexibility to select from various task types like 'Ordinary', 'Emergency', and 'Repetitive', tailoring them to your specific needs. Additionally, you can customize the recurrence frequency, whether it's daily, weekly, or monthly, to suit your schedule. Furthermore, tasks can be further broken down into multiple sub-goals, empowering you to gain a comprehensive overview of your pending tasks and strategize your approach for more efficient planning and completion.`;
      const imageUrl = `${process.env.UPLOAD_PATH}uploads/image/guild/Castle.svg`;
      const newGuild = await Guild.addGuild(req.session.passport.user, 'Personal Cabin', description, null, true);
      if (newGuild['insertId']){
        const newUserGuildRelation = await UserGuildRelation.addUserGuildRelation(req.session.passport.user, newGuild['insertId'], 'Master');
        if (newUserGuildRelation['affectedRows']){
          await updateUserExp(1, req.session.passport.user);
          return res.status(200).json(
              {
              "success": true,  
              "message": "Data build successfully.",
              "data": {
                id: newGuild['insertId']
              }
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

  async deleteGuild(req, res, next) {
    try {
      const tasks = await Task.getTaskByGuild(req.params.gid);
      if (tasks && tasks?.length){
        tasks.map(async(row) =>{
          const taskDetail = await Task.getTaskDetailById(row.ID);
          if(taskDetail[0].TYPE === 'Repetitive') await RepetitiveTask.deleteRepetitiveTask(row.ID);
          await Adventurer.deleteAdventurerByTask(row.ID);
          const items = await Item.getItem(row.ID);
          if (items && items?.length) {
            await Promise.all(items.map( async(i) => {
              const itemRecord = await ItemRecord.getItemRecordByItemAndUser(i.id, req.session.passport.user);
              if (itemRecord && itemRecord?.length){
                await ItemRecord.deleteItemRecordByItem(itemRecord[0].ID);
              } 
            }))
          }
          await Item.deleteItems(row.ID);
          await Task.deleteTask(row.ID);
        })
      }
      const query = await Guild.deleteGuild(req.params.gid);
      if (query.affectedRows){
        return res.status(200).json({
            success: true,
            message: "Data delete successfully.",
            data: "OK"
        });
      }      
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }
}

class UserGuildRelationController {
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
        return res.status(200).json({
            success: true,
            message: "You have successfully accepted the invitation and joined the guild.",
            data: "OK"
        });
      }
    } catch (err) {
      return next(new ApplicationError(400));
    }
  }

  async getMembers(req, res, next) {
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

  async sendInvitation(req, res, next) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.body.uid, req.params.gid);
      console.log(req.body.uid, req.params.gid);
      if (member?.length) {
        return next(new ApplicationError(409, "The player has already been invited to join this guild. Please do not resend the invitation."));
      }
      const newmember = await UserGuildRelation.addUserGuildRelation(req.body.uid, req.params.gid, 'Pending');
      if (newmember['affectedRows']){
        req.body.senderId = req.params.gid;
        req.body.recipientId = req.body.uid;
        req.body.type = "Guild";
        next();
      } else return next(new ApplicationError(404));
    } catch (err) {
      return next(new ApplicationError(400));
    }
  }

  async updateMember(req, res, next) {
    try {
      const query = await UserGuildRelation.updateUserGuildRelations(req.params.uid, req.params.gid, req.body.membership);
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