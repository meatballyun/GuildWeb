const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');

const GuildController = require('../controllers/guildControllers');
const guildController = new GuildController();
const UserGuildRelationController = require('../controllers/userGuildRelationControllers');
const userGuildRelationController = new UserGuildRelationController();

router.get('/', passport.authenticate('jwt', { session: true }), guildController.getGuilds);

router.get('/:id', passport.authenticate('jwt', { session: true }), guildController.getGuildDetail);

router.post('/', passport.authenticate('jwt', { session: true }), guildController.addGuild);

router.put('/:id', passport.authenticate('jwt', { session: true }), guildController.updateGuild);

router.delete('/:id', passport.authenticate('jwt', { session: true }), guildController.daleteGuild);

router.get('/:id/invitation', passport.authenticate('jwt', { session: true }), userGuildRelationController.replyInvitation);

router.get('/:id/member', passport.authenticate('jwt', { session: true }), userGuildRelationController.getUserGuildRelations);

router.post('/:id/member', passport.authenticate('jwt', { session: true }), userGuildRelationController.sendInvitation);

router.patch('/:id/member', passport.authenticate('jwt', { session: true }), userGuildRelationController.updateUserGuildRelations);

router.delete('/:id/member/:userId', passport.authenticate('jwt', { session: true }), userGuildRelationController.deleteUserGuildRelations);

module.exports = router;