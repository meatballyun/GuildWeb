const express = require("express")
const router = express.Router();
const passport = require('../verification/passport');
const TaskController = require('../controllers/taskControllers');
const taskController = new TaskController();

router.get('/', passport.authenticate('jwt', { session: true }), taskController.getTask);

router.get('/:id', passport.authenticate('jwt', { session: true }), taskController.getTaskDetail);

router.get('/:id/accepted', passport.authenticate('jwt', { session: true }), taskController.acceptTack);

router.post('/', passport.authenticate('jwt', { session: true }), taskController.addTask);

router.put('/', passport.authenticate('jwt', { session: true }), taskController.updateTask);

router.delete('/:id', passport.authenticate('jwt', { session: true }), taskController.deleteTask);

module.exports = router;