const Task = require('../models/taskModel');
const RepetitiveTask = require('../models/repetitiveTaskModel');
const Item = require('../models/itemModel');
const ItemRecord = require('../models/itemRecordModel');
const Adventurer = require('../models/adventurerModel');
const UserGuildRelation = require('../models/userGuildRelationModel');
const User = require('../models/userModel');

class TaskController {
  async getTasks(req, res) {
    try {
      const tasks = (req.query.q) ? await Task.getTaskByGuildAndName(req.params.gid, req.query.q) : await Task.getTaskByGuild(req.params.gid);
      let data;
      if (tasks?.length){
        data = await Promise.all( tasks.map( async (row) => {
          let repetitiveTasksType ='None';
          if (row.TYPE === 'Repetitive'){
            const repetitiveTasks = await RepetitiveTask.getRepetitiveTask(row.ID);
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
        return res.status(200).json({
          success: true,
          message: "The guild currently has no tasks.",
          data: "OK"
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
      const [task] = await Task.getTaskDetail(req.params.tid);
      let data;
      if ( task && task.ID) {
        let repetitiveTasksType, adventurers, itemRecords;
        if (task.TYPE === 'Repetitive'){
          const [ repetitiveTasks ] = await RepetitiveTask.getRepetitiveTask(task.ID);
          repetitiveTasksType = repetitiveTasks.TYPE;
        }

        adventurers = (await Promise.all(await Adventurer.getAdventurerByTask(req.params.tid))).map(async(row) => {
          const user = await User.getUserById(row.USER_ID);
          return {
            id: row.USER_ID,
            name: user.NAME,
            imageUrl: user.IMAGE_URL,
            status: row.STATUS
          }
        });

        itemRecords = (await Promise.all(await ItemRecord.getItemRecord(req.params.tid))).map(async(row) => {
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
        
        return res.status(200).json({
          success: true,
          message: "Data retrieval successful.",
          data : data 
        });
      } 

      return res.status(409).json({
        success: false,
        message: "Conflict detected",
        data : "Conflict" 
      });
      
      return res.status(200).json({
        success: true,
        message: "Data retrieval successful.",
        data : "OK" 
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
      const [ task ] = await Task.getTaskDetail(req.params.tid);
      const [ isAdventurer ] = await Adventurer.getAdventurerByTaskAndUser(req.params.tid, req.session.passport.user);
      if (!task || !task.ID) {
        return res.status(404).json({
          success: false,
          message: "The requested resource was not found.",
          data: "Not Found"
        });
      } else if (isAdventurer) {
        return res.status(200).json({
          success: true,
          message: "You have already accepted this task.",
          data: "OK"
        });
      } else if (task.STATUS !== 'Established' && task.STATUS !== 'Pending Activation' && task.STATUS !== "In Progress") {
        return res.status(200).json({
          success: true,
          message: "The current task status is not available for acceptance.",
          data: "OK"
        });
      } else if (task.ACCEPTED ===  'Max Accepted') {
        return res.status(200).json({
          success: true,
          message: "The maximum number of adventurers for this task has been reached.",
          data: "OK"
        });
      }
      
      // const acceptTack = await Task.acceptTask(req.params.tid, task.ADVENTURER + 1);
      // if (!acceptTack || !acceptTack.affectedRows){
      //   return res.status(400).json({
      //     success: false,
      //     message: "When attempting to change the number of adventurers for the task, an error occurred.",
      //     data: "Bad Request"
      //   });
      // } else {
      //   if ((task.ADVENTURER + 1) >= task.MAX_ADVENTURER){
      //     await Task.maxAccepted(req.params.tid);
      //   }
      // }
      
      const adventurer = await Adventurer.addAdventurer(req.params.tid , 9);
      if (!adventurer || !adventurer.affectedRows){
        return res.status(400).json({
          success: false,
          message: "When attempting to add the table for adventurers, an error occurred.",
          data: "Bad Request"
        });
      }
      
      // const items = await Item.getItem(req.params.tid);
      // if (items){
      //   await Promise.all( items.map( async (row) => {
      //     const itemRecord = await ItemRecord.addItemRecord(row.ID, row.CONTENT, req.session.passport.user);
      //   }))
      // } 
      
      return res.status(200).json({
        success: true,
        message: "User successfully accepted the task.",
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

  async addTask(req, res) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.body.guildId);
      if (!member?.length){
        return res.status(403).json({
          success: false,
          message: "You are not a member of this guild.",
          data: "Forbidden"
        });
      } else if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
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
          const newRepetitiveTask = await RepetitiveTask.addRepetitiveTask(newTask['insertId'] , Object.values(generrationTime[0])[0], req.body.repetitiveType);
          if (!newRepetitiveTask['insertId']) return res.status(400).json({
            success: false,
            message: "Error in RepetitiveTask.addRepetitiveTask()",
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
      const taskDetail = await Task.getTaskDetail(req.body.taskId);
      if (!taskDetail?.length){
        return res.status(404).json({
          success: false,
          message: "The task cannot be found in this guild.",
          data: "Not found"
        });
      } else if (req.member[0].MEMBERSHIP === "Admin" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return res.status(403).json({
          success: false,
          message: "You do not have sufficient permissions to access this resource.",
          data: "Forbidden"
        });
      }
      
      const task = await Task.updateTask(req.body.taskId, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer);
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
          const getRepetitiveTask= await RepetitiveTask.getRepetitiveTask(req.body.taskId);
          if (!getRepetitiveTask?.length){
            const newRepetitiveTask = await RepetitiveTask.addRepetitiveTask(req.body.taskId , Object.values(generrationTime[0])[0], req.body.repetitiveType);
            if (!newRepetitiveTask['insertId']) return res.status(400).json({
              success: false,
              message: "Error in Task.addRepetitiveTask()",
              data: "Bad Request"
            });
          } else{
            const repetitiveTask = await RepetitiveTask.updateRepetitiveTask(req.body.taskId , Object.values(generrationTime[0])[0], req.body.repetitiveType);
            if (!repetitiveTask.affectedRows) return res.status(400).json({
              success: false,
              message: "Error in Task.updateRepetitiveTask().",
              data: "Bad Request"
            });
          }

        } else {
          const getRepetitiveTask= await RepetitiveTask.getRepetitiveTask(req.body.taskId);
          if (getRepetitiveTask?.length) {
            await RepetitiveTask.deleteRepetitiveTask(req.body.taskId)
          }
        }


        if (req.body.items) {
          await Promise.all((req.body.items).map( async(i) => {
            if (i.content){
              (i.id) ? await Item.updateItem(i.id , i.content) : await Item.addItem(req.body.taskId , i.content);
            } else {
              console.log(i.id, i.content)
              await Item.deleteItem(i.id) ;
            }
          }))
        } else {
          const query = await Item.getItem(req.body.taskId);
          if(query){
              await Item.deleteItems(req.body.taskId);
          }
        }


        return res.status(200).json({
          success: true,
          message: "Data update successfully.",
          data: "OK"
        });
      }


    } catch (err) {
      console.log(err);
      return res.status(400).json({
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
      });
    }
  }

  async cancelTask(req, res) {
    try {
      const cancelTask = await Task.cancelTask(req.body.taskId);
      if (!cancelTask.affectedRows) 
      return res.status(400).json({
        success: false,
        message: "Error in Task.cancelTask().",
        data: "Bad Request"
      });
      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({
          success: false,
          message: "Bad Request: The server could not understand the request due to invalid syntax or missing parameters.",
          data: "Bad Request"
      });
    }
  }
  
  async acceptTack(req, res){
    try {
      const [ task ] = await Task.getTaskDetail(req.params.tid);
      const [ isAdventurer ] = await Adventurer.getAdventurerByTaskAndUser(req.params.tid, 9);
      if (!task || !task.ID) {
        return res.status(404).json({
          success: false,
          message: "The requested resource was not found.",
          data: "Not Found"
        });
      } else if (isAdventurer) {
        return res.status(200).json({
          success: true,
          message: "You have already accepted this task.",
          data: "OK"
        });
      } else if (task.STATUS !== 'Established' && task.STATUS !== 'Pending Activation' && task.STATUS !== "In Progress") {
        return res.status(200).json({
          success: true,
          message: "The current task status is not available for acceptance.",
          data: "OK"
        });
      } else if (task.ACCEPTED ===  'Max Accepted') {
        return res.status(200).json({
          success: true,
          message: "The maximum number of adventurers for this task has been reached.",
          data: "OK"
        });
      }
      
      const adventurer = await Adventurer.addAdventurer(req.params.tid , 9);
      if (!adventurer || !adventurer.affectedRows){
        return res.status(400).json({
          success: false,
          message: "When attempting to add the table for adventurers, an error occurred.",
          data: "Bad Request"
        });
      }

      return res.status(200).json({
        success: true,
        message: "User successfully accepted the task.",
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

  async deleteTask(req, res) {
    try {
      const deleteTask = await Task.deleteTask(req.params.tid);
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