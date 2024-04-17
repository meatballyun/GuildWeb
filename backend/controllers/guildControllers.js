const Guild = require('../models/guildModel');
const UserGuildRelation = require('../models/userGuildRelationModel');
const User = require('../models/userModel');
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
            "success": false,
            "message": "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
            "data": "Bad Request"
          }
        );
    }
  }

  async updateGuild(req, res) {
    try {     
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.params.id);
      if (!member?.length){
        return res.status(403).json({
          success: false,
          message: "You are not a member of this guild.",
          data: "Forbidden"
        });
      } else if ((member[0].MEMBERSHIP !== "Master")){
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
          data: "Forbidden"
        });
      }

      const guild = await Guild.updateGuild(req.params.id, req.body.name, req.body.description, req.body.imageUrl);
      if (guild.affectedRows){
        return res.status(200).json({
            success: true,
            message: "Data update successfully.",
            data: {
                id: req.params.id
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
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.params.id);
      if (!member?.length){
        return res.status(403).json({
          success: false,
          message: "You are not a member of this guild.",
          data: "Forbidden"
        });
      }      
      const [ guild ] = await Guild.getGuild(req.params.id);

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
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.params.id);
      if (!member?.length){
        return res.status(403).json({
          success: false,
          message: "You are not a member of this guild.",
          data: "Forbidden"
        });
      } else if ((member[0].MEMBERSHIP !== "Master")){
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
          data: "Forbidden"
        });
      }      
      const query = await Guild.daleteGuild(req.params.id);
      if (query.affectedRows){
        return res.status(200).json({
            success: true,
            message: "Data update successfully.",
            data: {
                id: req.params.id
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

module.exports = GuildController;