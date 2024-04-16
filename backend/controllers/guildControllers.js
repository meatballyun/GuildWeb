const Guild = require('../models/guildModel');
const UserGuildRelation = require('../models/userGuildRelationModel');

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
      const guild = await Guild.updateGuild(req.body.id, req.body.name, req.body.description, req.body.imageUrl);
      if (guild.affectedRows){
        return res.status(200).json({
            success: true,
            message: "Data update successfully.",
            data: {
                id: req.body.id
            }
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

  async getGuilds(req, res) {
    try {     
      const query = (req.query.q) ? await Guild.getGuildsByLeaderAndName(req.session.passport.user, req.query.q) : await Guild.getGuildsByLeader(req.session.passport.user);
      if (query?.length){
        const guilds = query.map( row => ({
          id: row.ID,
          name: row.NAME,
          imageUrl: row.IMAGE_URL
        }))
        console.log(guilds);
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
      req.params.id = 2;
      const [ guild ] = await Guild.getGuild(req.params.id);
      console.log(guild);

      return res.status(200).json({
          success: true,
          message: "Data retrieval successfully.",
          data: guild
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

}

module.exports = GuildController;