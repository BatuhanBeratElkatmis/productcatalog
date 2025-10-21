const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct, validateSearchQuery } = require('../middleware/validationMiddleware');

// Ürün listesi ve filtreleme
router.get('/', productController.getProducts);
router.get('/search', validateSearchQuery, productController.searchProducts);

// Yeni ürün oluşturma
router.get('/new', productController.getNewProductForm);
router.post('/new', validateProduct, productController.createProduct);

// Ürün detayları
router.get('/:id', productController.getProductDetail);

// Ürün düzenleme - PUT için method override kullan
router.get('/:id/edit', productController.getEditProductForm);
router.put('/:id/edit', validateProduct, productController.updateProduct);

// Ürün silme - DELETE için method override kullan
router.delete('/:id/delete', productController.deleteProduct);

module.exports = router;