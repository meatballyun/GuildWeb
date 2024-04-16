const task = require('../models/taskModel');
const repetitiveTask = require('../models/repetitiveTaskModel');
const item = require('../models/itemModel');
const adventurer = require('../models/adventurerModel');
const UserGuildRelation = require('../models/userGuildRelationModel');

class TaskController {
  async addTask(req, res) {
    try {
      const member = await UserGuildRelation.getMembership(req.session.passport.user, req.body.guildId);
      if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }
      
      const newTask = await task.addTask(req.session.passport.user, req.body.guildId, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer );
      if (newTask['insertId']){
        let unit;
        if (req.body.type === 'Repetitive'){
          if (req.body.repetitiveType === 'Daily') { unit = 'DAY';}
          else if (req.body.repetitiveType === 'Weekly') { unit = 'WEEK';}
          else if (req.body.repetitiveType === 'Monthly') { unit = 'MONTH';}
          else return res.status(400).json({
            success: false,
            message: "Error in parameter or missing parameter 'repetitiveType'.",
            data: "Bad Request"
          });
          const generrationTime = await repetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const newRepetitiveTask = await task.addRepetitiveTask(newTask['insertId'] , Object.values(generrationTime[0])[0], req.body.repetitiveType);
          if (!newRepetitiveTask['insertId']) return res.status(400).json({
            success: false,
            message: "Error in task.addRepetitiveTask()",
            data: "Bad Request"
          });
        }

        if (req.body.items) {
          await Promise.all(req.body.items.map( async(i) => {
            const query = await item.addItem(newTask['insertId'] , i.content);
            if (!query['insertId']) return res.status(400).json({
              success: false,
              message: "Error in parameter or missing parameter 'CONTENT'.",
              data: "Bad Request"
            });
          }));
        }

        return res.status(200).json(
            {
            "success": true,
            "message": "Data uploaded successfully.",
            "data": "OK"
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

module.exports = TaskController;