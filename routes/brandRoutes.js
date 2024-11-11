const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { verificaToken, verificaAdmin } = require('../middlewares/auth');

// Crear una marca
router.post('/', verificaToken, verificaAdmin, brandController.createBrand);

// Obtener todas las marcas
router.get('/', brandController.getAllBrands);

// Obtener una marca por ID
router.get('/:id', brandController.getBrandById);

// Actualizar una marca
router.put('/:id', verificaToken, verificaAdmin, brandController.updateBrand);

// Eliminar una marca
router.delete('/:id', verificaToken, verificaAdmin, brandController.deleteBrand);

module.exports = router;