const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verificaToken, verificaAdmin } = require('../middlewares/auth');

// Crear un producto
router.post('/', verificaToken, verificaAdmin, productController.createProduct);

// Obtener todos los productos
router.get('/', productController.getAllProducts);

router.get('/brand/:brandId', productController.getProductsByBrand);

// Obtener un producto por ID
router.get('/:id', productController.getProductById);

router.get('/brand/:brandId/random/:excludeId', productController.getRandomProductsByBrand);

// Actualizar un producto
router.put('/:id', verificaToken, verificaAdmin, productController.updateProduct);

// Eliminar un producto
router.delete('/:id', verificaToken, verificaAdmin, productController.deleteProduct);

module.exports = router;