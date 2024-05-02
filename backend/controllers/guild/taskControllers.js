const Task = require('../../models/taskModel');
const RepetitiveTask = require('../../models/repetitiveTaskModel');
const Item = require('../../models/itemModel');
const ItemRecord = require('../../models/itemRecordModel');
const Adventurer = require('../../models/adventurerModel');
const UserGuildRelation = require('../../models/userGuildRelationModel');
const User = require('../../models/userModel');
const ApplicationError = require('../../utils/error/applicationError.js');
const userInfoController = new (require('../user/userinfoControllers.js'))();
const updateUserExp = userInfoController.updateUserExp;
class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const query = await Adventurer.getAdventurerByUser(req.session.passport.user);
      let data = [];
      if (query?.length){
        await Promise.all( query.map( async (i) => {   
          const tasks = await Task.getTaskDetailById(i.TASK_ID);
          if (tasks?.length){
            const task = await Promise.all( tasks.filter((row)=>{ return (row.STATUS === 'Established' || row.STATUS === 'In Progress') })
            .map( async (row) => {
              let repetitiveTaskType ='None';
              if (row.TYPE === 'Repetitive'){
                const repetitiveTasks = await RepetitiveTask.getRepetitiveTask(row.ID);
                if (repetitiveTasks?.length){
                  repetitiveTaskType = repetitiveTasks[0].TYPE;
                }
              }
              
              return {
                id: row.ID,
                creator: row.CREATOR_ID,
                name: row.NAME,
                type: row.TYPE,
                status: row.STATUS,
                accepted: row.ACCEPTED,
                repetitiveTaskType: repetitiveTaskType,
              }
            }));
            data.push(...task);
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

  async getTasks(req, res, next) {
    try {
      const tasks = (req.query.q) ? await Task.getTaskByGuildAndName(req.params.gid, req.query.q) : await Task.getTaskByGuild(req.params.gid);
      let data;
      if (tasks?.length){
        data = await Promise.all( tasks.map( async (row) => {
          let repetitiveTaskType ='None';
          let repetitiveTasks, isTemplate = false;
          if (row.TYPE === 'Repetitive'){
            repetitiveTasks = await RepetitiveTask.getRepetitiveTask(row.ID);
            if (repetitiveTasks?.length){
              repetitiveTaskType = repetitiveTasks[0].TYPE;
              isTemplate = true;
            }
          }
          const query = await Adventurer.getAdventurerByTaskAndUser(row.ID, req.session.passport.user);
          let isAccepted = false;
          if (query?.length) isAccepted = true;
          return {
            id: row.ID,
            creator: row.CREATOR_ID,
            name: row.NAME,
            type: row.TYPE,
            status: row.STATUS,
            accepted: row.ACCEPTED,
            repetitiveTaskType: repetitiveTaskType,
            isTemplate: isTemplate,
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
      const [task] = await Task.getTaskDetailById(req.params.tid);
      let data;
      if ( task && task.ID) {
        const [user] = await User.getUserById(task.CREATOR_ID);
        const creator = {id: user.ID, name: user.NAME, imageUrl: user.IMAGE_URL};        
        let repetitiveTaskType, adventurers, items, isAccepted = false;

        if (task.TYPE === 'Repetitive'){
          const [ repetitiveTasks ] = await RepetitiveTask.getRepetitiveTask(task.ID);
          repetitiveTaskType = repetitiveTasks.TYPE;
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

        const q_item = await Item.getItem(req.params.tid);
        if (isAccepted) {
          items = await Promise.all(q_item.map(async (row) => {
            const itemRecord = await ItemRecord.getItemRecordByItemAndUser(row.ID, req.session.passport.user);
            return {
              id: itemRecord[0].ID ,
              status: itemRecord[0].STATUS,
              content: itemRecord[0].CONTENT
            };
          }));
        } else {
          items = q_item.map((row) => {
            return {
              id: row.ID ,
              content: row.CONTENT
            };
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
          repetitiveTaskType: repetitiveTaskType,
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

  async acceptTask(req, res, next){
    try {
      const [ task ] = await Task.getTaskDetailById(req.params.tid);
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

  async abandonTask(req, res, next){
    try {
      const [ isAdventurer ] = await Adventurer.getAdventurerByTaskAndUser(req.params.tid, req.session.passport.user);
      if (!isAdventurer) {
        return next(new ApplicationError(409, "User has not accepted this task yet."));
      } 
      
      await Adventurer.deleteAdventurerByTaskAndUser(req.params.tid, req.session.passport.user);
      const items = await Item.getItem(req.params.tid);
      if (items && items?.length) {
        await Promise.all(items.map( async(i) => {
          const itemRecord = await ItemRecord.getItemRecordByItemAndUser(i.id, req.session.passport.user);
          if (itemRecord && itemRecord?.length){
            await ItemRecord.deleteItemRecordByItem(itemRecord[0].ID);
          } 
        }))
      }

      return res.status(200).json({
        success: true,
        message: "User successfully abandon the task.",
        data: "OK"
      });

    } catch (err){      
      return next(new ApplicationError(400, err));
    }
  }

  async addTask(req, res, next) {
    try {
      const initiationTime = new Date(req.body.initiationTime);
      const deadline = new Date(req.body.deadline);
      if (deadline.toLocaleDateString() < initiationTime.toLocaleDateString()){      
        return next(new ApplicationError(409, "Deadline cannot be earlier than initiationTime."));
      };
      
      const newTask = await Task.addTask(req.session.passport.user, req.params.gid, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer );
      if (newTask['insertId']){
        let unit;
        if (req.body.type === 'Repetitive'){
          if (req.body.repetitiveTaskType === 'Daily') { unit = 'DAY';}
          else if (req.body.repetitiveTaskType === 'Weekly') { unit = 'WEEK';}
          else if (req.body.repetitiveTaskType === 'Monthly') { unit = 'MONTH';}
          else return next(new ApplicationError(400, "Error in parameter or missing parameter 'repetitiveTaskType'."));
          const generrationTime = await RepetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const newRepetitiveTask = await RepetitiveTask.addRepetitiveTask(newTask['insertId'] , Object.values(generrationTime[0])[0], req.body.repetitiveTaskType);
          if (!newRepetitiveTask['affectedRows']) {
            await Task.deleteTask(newTask['insertId']);
            return next(new ApplicationError(400, "Error in RepetitiveTask.addRepetitiveTask()"));
          }
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
            data: {
              id: newTask['insertId']
            }
        });

      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async updateTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (req.member[0].MEMBERSHIP === "Vice" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403, "Only guild Master have permission to access this resource."));
      }
      
      const task = await Task.updateTask(req.params.tid, req.body.name, req.body.initiationTime, req.body.deadline, req.body.description, req.body.imageUrl, req.body.type, req.body.maxAdventurer);
      if (task.affectedRows){
        if (req.body.type === 'Repetitive'){
          let unit;
          if (req.body.repetitiveTaskType === 'Daily') { unit = 'DAY';}
          else if (req.body.repetitiveTaskType === 'Weekly') { unit = 'WEEK';}
          else if (req.body.repetitiveTaskType === 'Monthly') { unit = 'MONTH';}
          else return next(new ApplicationError(400, "Error in parameter or missing parameter 'repetitiveTaskType'."));

          const generrationTime = await RepetitiveTask.DATE_ADD(req.body.initiationTime, 1, unit);
          const getRepetitiveTask= await RepetitiveTask.getRepetitiveTask(req.params.tid);
          if (!getRepetitiveTask?.length){
            const newRepetitiveTask = await RepetitiveTask.addRepetitiveTask(req.params.tid, Object.values(generrationTime[0])[0], req.body.repetitiveTaskType);
            if (!newRepetitiveTask['insertId']) return next(new ApplicationError(400, "Error in Task.addRepetitiveTask()"));
          } else{
            const repetitiveTask = await RepetitiveTask.updateRepetitiveTask(req.params.tid , Object.values(generrationTime[0])[0], req.body.repetitiveTaskType);
            if (!repetitiveTask.affectedRows) 
            return next(new ApplicationError(400, "Error in Task.updateRepetitiveTask()."));
          }

        } else {
          const getRepetitiveTask= await RepetitiveTask.getRepetitiveTask(req.params.tid);
          if (getRepetitiveTask?.length) {
            await RepetitiveTask.deleteRepetitiveTask(req.params.tid)
          }
        }


        if (req.body.items) {
          await Promise.all((req.body.items).map( async(i) => {
            if (i.content){
              (i.id) ? await Item.updateItem(i.id , i.content) : await Item.addItem(req.params.tid , i.content);
            } else {
              await Item.deleteItem(i.id) ;
            }
          }))
        } else {
          const query = await Item.getItem(req.params.tid);
          if(query){
              await Item.deleteItems(req.params.tid);
          }
        }

        return res.status(200).json({
          success: true,
          message: "Data update successfully.",
          data: {
            id: req.params.tid
          }
        });
      }
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async completeTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (req.member[0].MEMBERSHIP === "Vice" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403, "Only guild Master have permission to access this resource."));
      }

      const adventurers = await Adventurer.getAdventurerByTask(req.params.tid);
      if (adventurers && adventurers?.length) {
        await Promise.all(adventurers.map( async(i) => {
          const adventurer = await Adventurer.getAdventurerByTaskAndUser(req.params.tid, i.USER_ID);
          if (adventurer[0].STATUS != 'Completed'){
            await Adventurer.updateAdventurerByTaskAndUser(req.params.tid, i.USER_ID, 'Failed');
          } else {
            await updateUserExp(1, i.USER_ID);
          }
        }))
      } else return next(new ApplicationError(409, "No one completed the task."))
      
      const completeTask = await Task.updateTaskStatus(req.params.tid, "Completed");
      if (!completeTask.affectedRows) return next(new ApplicationError(400, "Error in Task.completeTask()."));
      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async failTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (req.member[0].MEMBERSHIP === "Vice" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403, "Only guild Master have permission to access this resource."));
      }

      const adventurers = await Adventurer.getAdventurerByTask(req.params.tid);
      if (adventurers && adventurers?.length) {
        await Promise.all(adventurers.map( async(i) => {
          await Adventurer.updateAdventurerByTaskAndUser(req.params.tid, i.USER_ID, 'Failed');
        }))
      } else return next(new ApplicationError(409, "No one accepte the task."))
      
      const completeTask = await Task.updateTaskStatus(req.params.tid, "Expired");
      if (!completeTask.affectedRows) return next(new ApplicationError(400, "Error in Task.completeTask()."));
      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async cancelTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (req.member[0].MEMBERSHIP === "Vice" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403, "Only guild Master have permission to access this resource."));
      }

      await Adventurer.deleteAdventurerByTask(req.params.tid);
      const items = await Item.getItem(req.params.tid);
      if (items && items?.length) {
        await Promise.all(items.map( async(i) => {
          const itemRecord = await ItemRecord.getItemRecordByItem(i.id);
          if (itemRecord && itemRecord?.length){
            await ItemRecord.deleteItemRecordByItem(i.id);
          } 
        }))
      }
      
      const cancelTask = await Task.updateTaskStatus(req.params.tid, "Cancelled");
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

  async restoreTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (req.member[0].MEMBERSHIP === "Vice" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403, "Only guild Master have permission to access this resource."));
      }
      
      const restoreTask = await Task.updateTaskStatus(req.params.tid, "Established");
      if (!restoreTask.affectedRows) return next(new ApplicationError(400, "Error in Task.restoreTask()."));
      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async submitTask(req, res, next) {
    try {
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (new Date(taskDetail[0].DEADLINE) < new Date() ){
        return next(new ApplicationError(400, 'Task has expired.'));
      }
      
      const [adventurer] = await Adventurer.getAdventurerByTaskAndUser(req.params.tid, req.session.passport.user);
      if (!adventurer) return next(new ApplicationError(409, "The task has not been accepted yet."));
      const currentDate = new Date();
      const query = await Adventurer.updateAdventurerByTaskAndUser(req.params.tid, req.session.passport.user, "Completed", currentDate);
      if (!query['affectedRows']){
        return next(new ApplicationError(400, "Error in Adventurer.submitTask()."));
      }       

      return res.status(200).json({
        success: true,
        message: "Data update successfully.",
        data: "OK"
      });
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }

  async checkbox(req, res, next) {
    try {
      const itemRecord = await ItemRecord.getItemRecord(req.body.itemRecordId);
      if (itemRecord && itemRecord?.length) {
        if (!itemRecord[0].STATUS) {
          await ItemRecord.updateItemRecord(req.body.itemRecordId, true);
        }
        else {
          await ItemRecord.updateItemRecord(req.body.itemRecordId, false);
        }

      } else return next(new ApplicationError(404, "Error in checkbox()."));

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
      const taskDetail = await Task.getTaskDetailById(req.params.tid);
      if (!taskDetail?.length){
        return next(ApplicationError(404, "The task cannot be found in this guild."));
      } else if (req.member[0].MEMBERSHIP === "Vice" && req.session.passport.user !== taskDetail[0].CREATOR_ID){
        return next(new ApplicationError(403));
      }
      
      if(taskDetail[0].TYPE === 'Repetitive') await RepetitiveTask.deleteRepetitiveTask(req.params.tid);
      await Adventurer.deleteAdventurerByTask(req.params.tid);
      const items = await Item.getItem(req.params.tid);
      if (items && items?.length) {
        await Promise.all(items.map( async(i) => {
          const itemRecord = await ItemRecord.getItemRecordByItemAndUser(i.id, req.session.passport.user);
          if (itemRecord && itemRecord?.length){
            await ItemRecord.deleteItemRecordByItem(itemRecord[0].ID);
          } 
        }))
      }
      await Item.deleteItems(req.params.tid);
      
      const deleteTask = await Task.deleteTask(req.params.tid);
      if (deleteTask.affectedRows){
        return res.status(200).json({
          success: true,
          message: "Data delete successful.",
          data : "OK" 
        });
      } else {
        return next(new ApplicationError(404, "The task cannot be found in this guild."));
      }
      
    } catch (err) {
      return next(new ApplicationError(400, err));
    }
  }
}

module.exports = TaskController;