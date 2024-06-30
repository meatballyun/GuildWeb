import express from 'express';
import passport from '../utils/verification/passport';
import { awaitHandlerFactory } from '../utils/awaitHandlerFactory';
import { GuildAuth } from '../middleware/guildAuth';
import { GuildController } from '../controllers/guild/guildControllers';
import { memberController } from '../controllers/guild/memberControllers';
import { TaskController } from '../controllers/guild/taskControllers';
import { TaskTemplateController } from '../controllers/guild/taskTemplateControllers';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: true });

// Guild
router.get('/', auth, awaitHandlerFactory(GuildController.getGuilds));
router.get('/:gid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(GuildController.getGuildDetail));
router.post('/', auth, awaitHandlerFactory(GuildController.addGuild));
router.post('/cabin', auth, awaitHandlerFactory(GuildController.addCabin));
router.put('/:gid', auth, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(GuildController.updateGuild));
router.delete('/:gid', auth, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(GuildController.deleteGuild));

// Member
router.get('/:gid/invitation', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.replyInvitation));
router.get('/:gid/members', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.getMembers));
router.post('/:gid/invitation', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(memberController.sendInvitation));
router.patch('/:gid/members/:uid', auth, awaitHandlerFactory(GuildAuth.isMaster), awaitHandlerFactory(memberController.updateMember));
router.delete('/:gid/members/:uid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(memberController.deleteMember));

// TaskTemplate
router.get('/:gid/task_templates', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskTemplateController.getTaskTemplates));
router.get('/:gid/task_templates/:ttid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskTemplateController.getTaskTemplateDetail));
router.post('/:gid/task_templates', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskTemplateController.addTaskTemplate));
router.put('/:gid/task_templates/:ttid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskTemplateController.updateTaskTemplate));
router.delete('/:gid/task_templates/:ttid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskTemplateController.deleteTaskTemplate));

// Task
router.get('/all/tasks', auth, awaitHandlerFactory(TaskController.getUserTasks));
router.get('/:gid/tasks', auth, awaitHandlerFactory(TaskController.getTasks));
router.get('/:gid/tasks/:tid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(TaskController.getTaskDetail));
router.post('/:gid/tasks/', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskController.addTask));
router.put('/:gid/tasks/:tid', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskController.updateTask));
router.delete('/:gid/tasks/:tid', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(TaskController.deleteTask));

// Task action
router.get('/:gid/tasks/:tid/accepted', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(TaskController.acceptTask));
router.get('/:gid/tasks/:tid/abandon', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(TaskController.abandonTask));
router.patch('/:gid/tasks/:tid/complete', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskController.completeTask));
router.patch('/:gid/tasks/:tid/fail', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskController.failTask));
router.patch('/:gid/tasks/:tid/cancel', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskController.cancelTask));
router.patch('/:gid/tasks/:tid/restore', auth, awaitHandlerFactory(GuildAuth.isMasterOrVice), awaitHandlerFactory(TaskController.restoreTask));
router.patch('/:gid/tasks/:tid/submit', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(TaskController.submitTask));
router.patch('/:gid/tasks/checkbox', auth, awaitHandlerFactory(GuildAuth.isMember), awaitHandlerFactory(TaskController.clickCheckboxForItemRecord));

export default router;
