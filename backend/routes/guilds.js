const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const { GuildAuth, GuildController, UserGuildRelationController } = require('../controllers/guild/guildControllers');
const guild = new GuildController();
const guildAuth = new GuildAuth();
const member = new UserGuildRelationController();
const notification = new (require('../controllers/notification/notificationControllers'))();
const task = new (require('../controllers/guild/taskControllers'))();

// Guild
router.get('/', auth, guild.getGuilds);

router.get('/:gid', auth, guildAuth.isMember, guild.getGuildDetail);

router.post('/', auth, guild.addGuild);

router.put('/:gid', auth, guildAuth.isMaster, guild.updateGuild);

router.delete('/:gid', auth, guildAuth.isMaster, guild.deleteGuild);

// Member
router.get('/:gid/invitation', auth, guildAuth.isMember, member.replyInvitation);

router.get('/:gid/members', auth, guildAuth.isMember, member.getMembers);

router.post('/:gid/invitation', auth, guildAuth.isMasterOrAdmin, member.sendInvitation, notification.addNotification);

router.patch('/:gid/members/:uid', auth, guildAuth.isMember, guildAuth.isMaster, member.updateMember);

router.delete('/:gid/members/:uid', auth, guildAuth.isMember, member.deleteMember);

// Task
router.get('/:gid/tasks', auth, task.getTasks);

router.get('/:gid/tasks/:tid', auth, guildAuth.isMember, task.getTaskDetail);

router.get('/:gid/tasks/:tid/accepted', auth, guildAuth.isMember, task.acceptTask);

router.get('/:gid/tasks/:tid/abandon', auth, guildAuth.isMember, task.abandonTask);

router.post('/:gid/tasks/', auth, guildAuth.isMasterOrAdmin, task.addTask);

router.put('/:gid/tasks/:tid', auth, guildAuth.isMasterOrAdmin, task.updateTask);

router.patch('/:gid/tasks/:tid/complete', auth, guildAuth.isMasterOrAdmin, task.completeTask);

router.patch('/:gid/tasks/:tid/cancel', auth, guildAuth.isMasterOrAdmin, task.cancelTask);

router.patch('/:gid/tasks/:tid/restore', auth, guildAuth.isMasterOrAdmin, task.restoreTask);

router.patch('/:gid/tasks/:tid/submit', auth, guildAuth.isMember, task.submitTask);

router.patch('/:gid/tasks/checkbox', auth, guildAuth.isMember, task.checkbox);

router.delete('/:gid/tasks/:tid', auth, guildAuth.isMember, task.deleteTask);

module.exports = router;