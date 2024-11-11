const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verificaToken, verificaAdmin } = require('../middlewares/auth');

// Crear una categoría
router.post('/', verificaToken, verificaAdmin, categoryController.createCategory);

// Obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// Obtener una categoría por ID
router.get('/:id', categoryController.getCategoryById);

// Actualizar una categoría
router.put('/:id', verificaToken, verificaAdmin, categoryController.updateCategory);

// Eliminar una categoría
router.delete('/:id', verificaToken, verificaAdmin, categoryController.deleteCategory);

module.exports = router;