const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const TaskController = require('../controllers/taskControllers');
const taskController = new TaskController();

router.post('/', passport.authenticate('jwt', { session: true }), taskController.addTask);
router.put('/', passport.authenticate('jwt', { session: true }), taskController.updateTask);


module.exports = router;