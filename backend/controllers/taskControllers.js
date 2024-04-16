const Task = require('../models/taskModel');
const RepetitiveTask = require('../models/repetitiveTaskModel');
const Item = require('../models/itemModel');
const Adventurer = require('../models/adventurerModel');
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
      
      const newTask = await Task.addTask(req.session.passport.user, req.body.guildId, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer );
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
          const generrationTime = await RepetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const newRepetitiveTask = await Task.addRepetitiveTask(newTask['insertId'] , Object.values(generrationTime[0])[0], req.body.repetitiveType);
          if (!newRepetitiveTask['insertId']) return res.status(400).json({
            success: false,
            message: "Error in Task.addRepetitiveTask()",
            data: "Bad Request"
          });
        }

        if (req.body.items) {
          await Promise.all(req.body.items.map( async(i) => {
            const query = await Item.addItem(newTask['insertId'] , i.content);
            if (!query['insertId']) return res.status(400).json({
              success: false,
              message: "Error in parameter or missing parameter 'CONTENT'.",
              data: "Bad Request"
            });
          }));
        }

        return res.status(200).json(
            {
            success: true,
            message: "Data uploaded successfully.",
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

  async updateTask(req, res) {
    try {
      const member = await UserGuildRelation.getMembership(req.session.passport.user, req.body.guildId);
      if (member[0].MEMBERSHIP !== "Master" || member[0].MEMBERSHIP !== "Admin"){
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }

      const task = await Task.updateTask(req.body.taskId, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdvrnture);
      if (task.affectedRows){
        if (req.body.type === 'Repetitive'){
          let unit;
          if (req.body.repetitiveType === 'Daily') { unit = 'DAY';}
          else if (req.body.repetitiveType === 'Weekly') { unit = 'WEEK';}
          else if (req.body.repetitiveType === 'Monthly') { unit = 'MONTH';}
          else return res.status(400).json({
            success: false,
            message: "Error in parameter or missing parameter 'repetitiveType'.",
            data: "Bad Request"
          });
          const generrationTime = await RepetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const getRepetitiveTask= await Task.getRepetitiveTask(req.body.taskId);
          if (!getRepetitiveTask?.length){
            const newRepetitiveTask = await Task.addRepetitiveTask(req.body.taskId , Object.values(generrationTime[0])[0], req.body.repetitiveType);
            if (!newRepetitiveTask['insertId']) return res.status(400).json({
              success: false,
              message: "Error in Task.addRepetitiveTask()",
              data: "Bad Request"
            });
          } else{
            const repetitiveTask = await Task.updateRepetitiveTask(req.body.taskId , Object.values(generrationTime[0])[0], req.body.repetitiveType);
            if (!repetitiveTask.affectedRows) return res.status(400).json({
              success: false,
              message: "Error in Task.addRepetitiveTask().",
              data: "Bad Request"
            });
          }
        }

        if (req.body.items) {
          await Promise.all(req.body.items.map( async(i) => {
            if (i.id){
              const query = await Item.updateItem(i.id , i.content);
              if (!query.affectedRows) return res.status(400).json({
                success: false,
                message: "Error in Item.updateItem().",
                data: "Bad Request"
              });
            } else {
              const query = await Item.addItem(req.body.taskId , i.content);
              if (!query['insertId']) return res.status(400).json({
                success: false,
                message: "Error in parameter or missing parameter 'CONTENT'.",
                data: "Bad Request"
              });
            }
          }));
        } else {
          const query = await Item.getItem(req.body.taskId);
          if(query?.length){
            await Promise.all(query.map( async(i) => {
              await Item.deleteItem(i.ID);              
            }))
          }
        }
        return res.status(200).json(
            {
            success: true,
            message: "Data uploaded successfully.",
            data: "OK"
        });
      }
      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });

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

module.exports = TaskController;