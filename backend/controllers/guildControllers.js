const Guild = require('../models/guildModel');


class GuildController {
  async addGuild(req, res) {
    try {     
      const newGuild = await Guild.addGuild(req.session.passport.user, req.body.name, req.body.description, req.body.imageUrl, false);
      if (newGuild['insertId']){
        return res.status(200).json(
            {
            "success": true,
            "message": "Data uploaded successfully.",
            "data": {
                id: newGuild['insertId']
            }
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

}

module.exports = GuildController;