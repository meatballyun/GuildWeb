const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');

const GuildController = require('../controllers/guildControllers');
const guildController = new GuildController();
const UserGuildRelationController = require('../controllers/userGuildRelationControllers');
const userGuildRelationController = new UserGuildRelationController();

router.post('/', passport.authenticate('jwt', { session: true }), guildController.addGuild);

router.put('/', passport.authenticate('jwt', { session: true }), guildController.updateGuild);

router.get('/', passport.authenticate('jwt', { session: true }), guildController.getGuilds);

router.get('/:id', passport.authenticate('jwt', { session: true }), guildController.getGuildDetail);

router.delete('/:id', passport.authenticate('jwt', { session: true }), guildController.daleteGuild);

router.post('/member', passport.authenticate('jwt', { session: true }), userGuildRelationController.sendInvitation);

router.put('/member', passport.authenticate('jwt', { session: true }), userGuildRelationController.updateUserGuildRelations);

router.get('/member', passport.authenticate('jwt', { session: true }), userGuildRelationController.replyInvitation);

router.delete('/member/:guildId/:userId', passport.authenticate('jwt', { session: true }), userGuildRelationController.deleteUserGuildRelations);

module.exports = router;