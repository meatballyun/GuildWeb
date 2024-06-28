// @ts-nocheck
import express from 'express';
import passport from '../utils/verification/passport';
import awaitHandlerFactory from '../utils/awaitHandlerFactory';
import guildAuth from '../middleware/guildAuth';
import { GuildController } from '../controllers/guild/guildControllers';
import { memberController } from '../controllers/guild/memberControllers';
import { TaskController } from '../controllers/guild/taskControllers';
import { TaskTemplateController } from '../controllers/guild/taskTemplateControllers';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: true });

// Guild
router.get('/', auth, awaitHandlerFactory(GuildController.getGuilds));
router.get('/:gid', auth, guildAuth.isMember, awaitHandlerFactory(GuildController.getGuildDetail));
router.post('/', auth, awaitHandlerFactory(GuildController.addGuild));
router.post('/cabin', auth, awaitHandlerFactory(GuildController.addCabin));
router.put('/:gid', auth, guildAuth.isMaster, awaitHandlerFactory(GuildController.updateGuild));
router.delete('/:gid', auth, guildAuth.isMaster, awaitHandlerFactory(GuildController.deleteGuild));

// Member
router.get('/:gid/invitation', auth, guildAuth.isMember, awaitHandlerFactory(memberController.replyInvitation));
router.get('/:gid/members', auth, guildAuth.isMember, awaitHandlerFactory(memberController.getMembers));
router.post('/:gid/invitation', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(memberController.sendInvitation));
router.patch('/:gid/members/:uid', auth, guildAuth.isMaster, awaitHandlerFactory(memberController.updateMember));
router.delete('/:gid/members/:uid', auth, guildAuth.isMember, awaitHandlerFactory(memberController.deleteMember));

// TaskTemplate
router.get('/:gid/task_templates', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskTemplateController.getTaskTemplates));
router.get('/:gid/task_templates/:ttid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskTemplateController.getTaskTemplateDetail));
router.post('/:gid/task_templates', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskTemplateController.addTaskTemplate));
router.put('/:gid/task_templates/:ttid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskTemplateController.updateTaskTemplate));
router.delete('/:gid/task_templates/:ttid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskTemplateController.deleteTaskTemplate));

// Task
router.get('/all/tasks', auth, awaitHandlerFactory(TaskController.getUserTasks));
router.get('/:gid/tasks', auth, awaitHandlerFactory(TaskController.getTasks));
router.get('/:gid/tasks/:tid', auth, guildAuth.isMember, awaitHandlerFactory(TaskController.getTaskDetail));
router.post('/:gid/tasks/', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskController.addTask));
router.put('/:gid/tasks/:tid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskController.updateTask));
router.delete('/:gid/tasks/:tid', auth, guildAuth.isMember, awaitHandlerFactory(TaskController.deleteTask));

// Task action
router.get('/:gid/tasks/:tid/accepted', auth, guildAuth.isMember, awaitHandlerFactory(TaskController.acceptTask));
router.get('/:gid/tasks/:tid/abandon', auth, guildAuth.isMember, awaitHandlerFactory(TaskController.abandonTask));
router.patch('/:gid/tasks/:tid/complete', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskController.completeTask));
router.patch('/:gid/tasks/:tid/fail', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskController.failTask));
router.patch('/:gid/tasks/:tid/cancel', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskController.cancelTask));
router.patch('/:gid/tasks/:tid/restore', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(TaskController.restoreTask));
router.patch('/:gid/tasks/:tid/submit', auth, guildAuth.isMember, awaitHandlerFactory(TaskController.submitTask));
router.patch('/:gid/tasks/checkbox', auth, guildAuth.isMember, awaitHandlerFactory(TaskController.checkbox));

export default router;
