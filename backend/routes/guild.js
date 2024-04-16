const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');

const GuildController = require('../controllers/guildControllers');
const guildController = new GuildController();

router.post('/', passport.authenticate('jwt', { session: true }), guildController.addGuild);
router.put('/', passport.authenticate('jwt', { session: true }), guildController.updateGuild);

module.exports = router;