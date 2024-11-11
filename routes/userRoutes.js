const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verificaToken, verificaAdmin } = require('../middlewares/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/', verificaToken, verificaAdmin, userController.getAllUsers);
router.get('/:id', verificaToken, verificaAdmin, userController.getUserById);
router.put('/:id', verificaToken, verificaAdmin, userController.updateUser);
router.delete('/:id', verificaToken, verificaAdmin, userController.deleteUser);

module.exports = router;
