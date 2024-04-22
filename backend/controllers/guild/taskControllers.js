const Task = require('../../models/taskModel');
const RepetitiveTask = require('../../models/repetitiveTaskModel');
const Item = require('../../models/itemModel');
const ItemRecord = require('../../models/itemRecordModel');
const Adventurer = require('../../models/adventurerModel');
const UserGuildRelation = require('../../models/userGuildRelationModel');
const User = require('../../models/userModel');
const ApplicationError = require('../../utils/error/applicationError.js');

class TaskController {
  async getTasks(req, res, next) {
    try {
      const tasks = (req.query.q) ? await Task.getTaskByGuildAndName(req.params.gid, req.query.q) : await Task.getTaskByGuild(req.params.gid);
      let data;
      console.log(tasks);

      if (tasks?.length){
        data = await Promise.all( tasks.map( async (row) => {
          let repetitiveTasksType ='None';
          if (row.TYPE === 'Repetitive'){
            const repetitiveTasks = await RepetitiveTask.getRepetitiveTask(row.ID);
            repetitiveTasksType = repetitiveTasks[0].TYPE;
          }
          const query = await Adventurer.getAdventurerByTaskAndUser(row.ID, req.session.passport.user);
          let isAccepted = false;
          if (query?.length) isAccepted = true;
          return {
            id: row.ID,
            name: row.NAME,
            type: row.TYPE,
            status: row.STATUS,
            accepted: row.ACCEPTED,
            repetitiveTasksType: repetitiveTasksType,
            isAccepted: isAccepted,
          }
        }));
      }
      
      return res.status(200).json({
        success: true,
        message: "Data retrieval successful.",
        data : data 
      });
    } catch (err) {
      return next(new ApplicationError(400));
    }
  }

  async getTaskDetail(req, res, next) {
    try {
      const [task] = await Task.getTaskDetail(req.params.tid);
      let data;
      if ( task && task.ID) {
        const [user] = await User.getUserById(task.CREATOR_ID);
        const creator = {id: user.ID, name: user.NAME, imageUrl: user.IMAGE_URL};

        let repetitiveTasksType, adventurers, items, isAccepted = false; 
        if (task.TYPE === 'Repetitive'){
          const [ repetitiveTasks ] = await RepetitiveTask.getRepetitiveTask(task.ID);
          repetitiveTasksType = repetitiveTasks.TYPE;
        }

        const query = await Adventurer.getAdventurerByTask(req.params.tid);
        adventurers = await Promise.all(query.map(async (row) => {
            const [user] = await User.getUserById(row.USER_ID);
            if (row.USER_ID === req.session.passport.user) isAccepted = true;
            return {
                id: row.USER_ID,
                name: user.NAME,
                imageUrl: user.IMAGE_URL,
                status: row.STATUS
            };
        }));

        if (isAccepted) {
          items = (await Promise.all(await ItemRecord.getItemRecord(req.params.tid))).map((row) => {
            return {
              id: row.ID ,
              status: row.STATUS,
              content: row.CONTENT
            }
          });
        } else {
          items = (await Promise.all(await Item.getItem(req.params.tid))).map((row) => {
            return {
              id: row.ID ,
              content: row.CONTENT
            }
          });
        }
        
        data =  {
          creator: creator,
          id: task.ID,
          name: task.NAME,
          initiationTime: task.INITIATION_TIME,
          deadline: task.DEADLINE,
          description: task.DESCRIPTION,
          type: task.TYPE,
          repetitiveTasksType: repetitiveTasksType,
          maxAdventurer: task.MAX_ADVENTURER ,
          adventurers: adventurers ,
          status: task.STATUS,
          accepted: task.ACCEPTED,
          items: items,          
          isAccepted: isAccepted,
        } 
        
        return res.status(200).json({
          success: true,
          message: "Data retrieval successful.",
          data : data 
        });
      } 
      return next(new ApplicationError(409));

    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async acceptTack(req, res, next){
    try {
      const [ task ] = await Task.getTaskDetail(req.params.tid);
      const [ isAdventurer ] = await Adventurer.getAdventurerByTaskAndUser(req.params.tid, req.session.passport.user);
      if (!task || !task.ID) {
        return next(new ApplicationError(404, "When attempting to add the table for adventurers, an error occurred."));
      } else if (isAdventurer) {
        return next(new ApplicationError(409, "You have already accepted this task."));
      } else if (task.STATUS !== 'Established' && task.STATUS !== 'Pending Activation' && task.STATUS !== "In Progress") {
        return res.status(200).json({
          success: true,
          message: "The current task status is not available for acceptance.",
          data: "OK"
        });
      } else if (task.ACCEPTED ===  'Max Accepted') {
        return next(new ApplicationError(409, "The maximum number of adventurers for this task has been reached."));
      }
      
      const adventurer = await Adventurer.addAdventurer(req.params.tid , req.session.passport.user);
      if (!adventurer || !adventurer.affectedRows){
      return next(new ApplicationError(400, "When attempting to add the table for adventurers, an error occurred."));
      }

      return res.status(200).json({
        success: true,
        message: "User successfully accepted the task.",
        data: "OK"
      });

    } catch (err){      
      return next(new ApplicationError(400, err));
    }
  }

  async addTask(req, res, next) {
    try {
      const member = await UserGuildRelation.getUserGuildRelationByGuildAndUser(req.session.passport.user, req.params.gid);
      if (!member?.length){
        return next(new ApplicationError(403, "You are not a member of this guild."));
      } else if (member[0].MEMBERSHIP !== "Master"){
        return res.status(403).json({
          success: false,
          message: "Only guild Master have permission to access this resource.",
          data: "Forbidden"
        });
      }
      
      const newTask = await Task.addTask(req.session.passport.user, req.params.gid, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer );
      if (newTask['insertId']){
        let unit;
        if (req.body.type === 'Repetitive'){
          if (req.body.repetitiveType === 'Daily') { unit = 'DAY';}
          else if (req.body.repetitiveType === 'Weekly') { unit = 'WEEK';}
          else if (req.body.repetitiveType === 'Monthly') { unit = 'MONTH';}
          else return next(new ApplicationError(400, "Error in parameter or missing parameter 'repetitiveType'."));
          const generrationTime = await RepetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const newRepetitiveTask = await RepetitiveTask.addRepetitiveTask(newTask['insertId'] , Object.values(generrationTime[0])[0], req.body.repetitiveType);
          if (!newRepetitiveTask['insertId']) return next(new ApplicationError(400, "Error in RepetitiveTask.addRepetitiveTask()"));
        }

        if (req.body.items) {
          await Promise.all(req.body.items.map( async(i) => {
            const query = await Item.addItem(newTask['insertId'] , i.content);
            if (!query['insertId']) return next(new ApplicationError(400, "Error in parameter or missing parameter 'CONTENT'."));
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
      return next(new ApplicationError(400, err));
    }
  }

  async updateTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetail(req.body.taskId);
      if (!taskDetail?.length){
        return res.status(404).json({
          success: false,
          message: "The task cannot be found in this guild.",
          data: "Not found"
        });
      } else if (req.member[0].MEMBERSHIP === "Admin" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403));
      }
      
      const task = await Task.updateTask(req.body.taskId, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer);
      if (task.affectedRows){
        if (req.body.type === 'Repetitive'){
          let unit;
          if (req.body.repetitiveType === 'Daily') { unit = 'DAY';}
          else if (req.body.repetitiveType === 'Weekly') { unit = 'WEEK';}
          else if (req.body.repetitiveType === 'Monthly') { unit = 'MONTH';}
          else return next(new ApplicationError(400, "Error in parameter or missing parameter 'repetitiveType'."));

          const generrationTime = await RepetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const getRepetitiveTask= await RepetitiveTask.getRepetitiveTask(req.body.taskId);
          if (!getRepetitiveTask?.length){
            const newRepetitiveTask = await RepetitiveTask.addRepetitiveTask(req.body.taskId , Object.values(generrationTime[0])[0], req.body.repetitiveType);
            if (!newRepetitiveTask['insertId']) return next(new ApplicationError(400, "Error in Task.addRepetitiveTask()"));
          } else{
            const repetitiveTask = await RepetitiveTask.updateRepetitiveTask(req.body.taskId , Object.values(generrationTime[0])[0], req.body.repetitiveType);
            if (!repetitiveTask.affectedRows) 
            return next(new ApplicationError(400, "Error in Task.updateRepetitiveTask()."));
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
      return next(new ApplicationError(400, err));
    }
  }

  async cancelTask(req, res, next) {
    try {
      const cancelTask = await Task.cancelTask(req.body.taskId);
      if (!cancelTask.affectedRows) return next(new ApplicationError(400, "Error in Task.cancelTask()."));
      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async deleteTask(req, res, next) {
    try {
      const deleteTask = await Task.deleteTask(req.params.tid);
      if (deleteTask.affectedRows){
        return res.status(200).json({
          success: true,
          message: "Data delete successful.",
          data : "OK" 
        });
      } else {
        return next(new ApplicationError(404, "Can not find the 'taskId'."));
      }
      
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

}

module.exports = TaskController;