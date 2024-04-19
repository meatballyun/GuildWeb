const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const auth = passport.authenticate('jwt', { session: true });
const { GuildAuth, GuildController, UserGuildRelationController } = require('../controllers/guildControllers');
const TaskController = require('../controllers/taskControllers');
const guild = new GuildController();
const guildAuth = new GuildAuth();
const member = new UserGuildRelationController();
const task = new TaskController();

// Guild
router.get('/', auth, guild.getGuilds);

router.get('/:gid', auth, guildAuth.isMember, guild.getGuildDetail);

router.post('/', auth, guild.addGuild);

router.put('/:gid', auth, guildAuth.isMaster, guild.updateGuild);

router.delete('/:gid', auth, guildAuth.isMaster, guild.daleteGuild);

// Member
router.get('/:gid/invitation', auth, member.replyInvitation);

router.get('/:gid/member', auth, guildAuth.isMember, member.getMember);

router.post('/:gid/member', auth, guildAuth.isMasterOrAdmin, member.sendInvitation);

router.patch('/:gid/member', auth, guildAuth.isMember, guildAuth.isMaster, member.updateMember);

router.delete('/:gid/member/:uid', auth, guildAuth.isMember, member.deleteMember);

// Task
router.get('/:gid/task', auth, task.getTasks);

router.get('/:gid/task/:tid', auth, guildAuth.isMember, task.getTaskDetail);

router.get('/:gid/task/:tid/accepted', auth, guildAuth.isMember, task.acceptTack);

router.post('/:gid/task/', auth, guildAuth.isMasterOrAdmin, task.addTask);

router.patch('/:gid/task/cancel', auth, guildAuth.isMasterOrAdmin, task.cancelTask);

router.put('/:gid/task/', auth, guildAuth.isMasterOrAdmin, task.updateTask);

router.delete('/:gid/task/:tid', auth, guildAuth.isMember, task.deleteTask);

module.exports = router;