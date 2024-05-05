const express = require('express');
const router = express.Router();
const taskTemplate = new (require('../controllers/guild/taskTemplateControllers'))();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const awaitHandlerFactory = require('../utils/awaitHandlerFactory');
const { GuildAuth, GuildController, UserGuildRelationController} = require('../controllers/guild/guildControllers');
const guild = new GuildController();
const guildAuth = new GuildAuth();
const member = new UserGuildRelationController();
const notification = new (require('../controllers/notification/notificationControllers'))();
const task = new (require('../controllers/guild/taskControllers'))();

// Guild
router.get('/', auth, awaitHandlerFactory(guild.getGuilds));
router.get('/:gid', auth, guildAuth.isMember, awaitHandlerFactory(guild.getGuildDetail));
router.post('/', auth, awaitHandlerFactory(guild.addGuild));
router.post('/cabin', auth, awaitHandlerFactory(guild.addCabin));
router.put('/:gid', auth, guildAuth.isMaster, awaitHandlerFactory(guild.updateGuild));
router.delete('/:gid', auth, guildAuth.isMaster, awaitHandlerFactory(guild.deleteGuild));

// Member
router.get('/:gid/invitation', auth, guildAuth.isMember, awaitHandlerFactory(member.replyInvitation));
router.get('/:gid/members', auth, guildAuth.isMember, awaitHandlerFactory(member.getMembers));
router.post('/:gid/invitation', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(member.sendInvitation), notification.createNotification);
router.patch('/:gid/members/:uid', auth, guildAuth.isMaster, awaitHandlerFactory(member.updateMember));
router.delete('/:gid/members/:uid', auth, guildAuth.isMember, awaitHandlerFactory(member.deleteMember));

// TaskTemplate
router.get('/:gid/task_templates', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(taskTemplate.getTaskTemplates));
router.get('/:gid/task_templates/:ttid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(taskTemplate.getTaskTemplateDetail));
router.post('/:gid/task_templates', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(taskTemplate.addTaskTemplate)
);
router.put('/:gid/task_templates/:ttid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(taskTemplate.updateTaskTemplate));
router.delete('/:gid/task_templates/:ttid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(taskTemplate.deleteTaskTemplate));

// Task
router.get('/all/tasks', auth, awaitHandlerFactory(task.getAllTasks));
router.get('/:gid/tasks', auth, awaitHandlerFactory(task.getTasks));
router.get('/:gid/tasks/:tid', auth, guildAuth.isMember, awaitHandlerFactory(task.getTaskDetail));
router.post('/:gid/tasks/', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(task.addTask));
router.put('/:gid/tasks/:tid', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(task.updateTask));
router.delete('/:gid/tasks/:tid', auth, guildAuth.isMember, awaitHandlerFactory(task.deleteTask));

// Task action
router.get('/:gid/tasks/:tid/accepted', auth, guildAuth.isMember, awaitHandlerFactory(task.acceptTask));
router.get('/:gid/tasks/:tid/abandon', auth, guildAuth.isMember, awaitHandlerFactory(task.abandonTask));
router.patch('/:gid/tasks/:tid/complete', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(task.completeTask));
router.patch('/:gid/tasks/:tid/fail', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(task.failTask));
router.patch('/:gid/tasks/:tid/cancel', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(task.cancelTask));
router.patch( '/:gid/tasks/:tid/restore', auth, guildAuth.isMasterOrVice, awaitHandlerFactory(task.restoreTask));
router.patch('/:gid/tasks/:tid/submit', auth, guildAuth.isMember, awaitHandlerFactory(task.submitTask));
router.patch('/:gid/tasks/checkbox', auth, guildAuth.isMember, awaitHandlerFactory(task.checkbox));

module.exports = router;
