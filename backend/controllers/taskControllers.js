const Task = require('../models/taskModel');
const RepetitiveTask = require('../models/repetitiveTaskModel');
const Item = require('../models/itemModel');
const ItemRecord = require('../models/itemRecordModel');
const Adventurer = require('../models/adventurerModel');
const UserGuildRelation = require('../models/userGuildRelationModel');
const User = require('../models/userModel');

class TaskController {
  async addTask(req, res) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.body.guildId);
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
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.body.guildId);
      const taskDetail = await Task.getTaskDetail(req.body.taskId);
      if (member[0].MEMBERSHIP !== "Master" || member[0].MEMBERSHIP !== "Admin" || (member[0].MEMBERSHIP === "Admin" && req.session.passport.user !== taskDetail[0].CREATOR_ID)){
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

  async acceptTack(req, res){
    try {
      const task = await Task.getTaskDetail(req.params.id);
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, task[0].GUILD_ID);
      if (!task || !task.length){
        return res.status(404).json({
          success: false,
          message: "The requested resource was not found.",
          data: "Not Found"
        });
      } else if (!member || !member.length) {
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      } else if (task[0].ADVENTURER >= task[0].MAX_ADVENTURER) {
        return res.status(200).json({
          success: false,
          message: "The maximum number of adventurers for this task has been reached.",
          data: "OK"
        });
      }
      
      const acceptTack = await task.acceptTack(req.params.id, task[0].ADVENTURER + 1);
      if (!acceptTack || !acceptTack.length){
        return res.status(400).json({
          success: false,
          message: "When attempting to change the number of adventurers for the task, an error occurred.",
          data: "Bad Request"
        });
      }

      const adventurer = await Adventurer.addAdventurer(req.params.id , req.session.passport.user);
      if (!adventurer || !adventurer.length){
        return res.status(400).json({
          success: false,
          message: "When attempting to add the table for adventurers, an error occurred.",
          data: "Bad Request"
        });
      }

      const items = await Item.getItem(req.params.id);
      if (items?.length){
        const itemRecords = await Promise.all( items.map( async (row) => {
          const itemRecord = await ItemRecord.addItemRecord(row.ID, row.CONTENT, row.USER_ID)
        }))
      }
      
      return res.status(200).json({
        success: false,
        message: "User has successfully accepted the task.",
        data: "OK"
      });

    } catch (err){
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

  async getTask(req, res) {
    try {
      const tasks = (req.query.q) ? await Task.getTaskByGuildAndName(req.query.guildId, req.query.q) : await Task.getTaskByGuild(req.query.guildId);
      let data;
      if (tasks?.length){
        data = await Promise.all( tasks.map( async (row) => {
          const repetitiveTasksType ='None';
          if (row.TYPE === 'Repetitive'){
            const repetitiveTasks = await RepetitiveTask.getRepetitiveTask(row.TASK_ID);
            repetitiveTasksType = repetitiveTasks[0].TYPE;
          }  
          return {
            id: row.ID,
            name: row.NAME,
            type: row.TYPE,
            status: row.STATUS,
            accepted: row.ACCEPTED,
            repetitiveTasksType: repetitiveTasksType,
          }
        }));
      }
      if (data) {
        return res.status(200).json({
          success: true,
          message: "Data retrieval successful.",
          data : data 
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "The requested resource was not found.",
          data: "Not Found"
      })} 

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

  async getTaskDetail(req, res) {
    try {
      const [ task ] = await Task.getTaskDetail(req.params.id);
      let data;
      if (task?.length) {
        let repetitiveTasksType, adventurers, itemRecords;
        if (task.TYPE === 'Repetitive'){
          const repetitiveTasks = await RepetitiveTask.getRepetitiveTask(row.TASK_ID);
          repetitiveTasksType = repetitiveTasks[0].TYPE;
        }

        adventurers = (await Promise.all(await Adventurer.getAdventurerByTask(req.params.id))).map(async(row) => {
          const [ user ] = await User.getUserById(row.USER_ID);
          return {
            id: row.USER_ID,
            name: user.NAME,
            imageUrl: user.IMAGE_URL,
            status: row.STATUS
          }
        });

        adventurers = (await Promise.all(await Adventurer.getAdventurerByTask(req.params.id))).map(async(row) => {
          const [ user ] = await User.getUserById(row.USER_ID);
          return {
            id: row.USER_ID,
            name: user.NAME,
            imageUrl: user.IMAGE_URL,
            status: row.STATUS
          }
        });

        itemRecords = (await Promise.all(await ItemRecord.getItemRecord(req.params.id))).map(async(row) => {
          return {
            id: row.ID ,
            status: row.STATUS,
            content: row.CONTENT
          }
        });

        data =  {
          id: task.ID,
          name: task.NAME,
          initiationTime: task.INITIATION_TIME,
          deadline: task.DEADLINE,
          description: task.DESCRIPTION,
          type: task.TYPE,
          repetitiveTasksType: repetitiveTasksType,
          maxAdventurer: task.MAX_ADVENTURER ,
          adventurers: adventurers ,
          imageUrl: task.ACCEPTED,
          itemRecords: itemRecords,
        }  
      }
      
      return res.status(200).json({
        success: true,
        message: "Data retrieval successful.",
        data : data 
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

  async deleteTask(req, res) {
    try {
      const deleteTask = await Task.deleteTask(req.params.id);
      if (deleteTask.affectedRows){
        return res.status(200).json({
          success: true,
          message: "Data delete successful.",
          data : "OK" 
        });
      } else {
        return res.status(404).json({
          success: true,
          message: "Can not find the 'taskId'.",
          data : "Not Found" 
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

module.exports = TaskController;