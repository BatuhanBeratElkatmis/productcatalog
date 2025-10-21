const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Ürün listesi ve filtreleme
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);

// Yeni ürün oluşturma
router.get('/new', productController.getNewProductForm);
router.post('/new', productController.createProduct);

// Ürün detayları
router.get('/:id', productController.getProductDetail);

// Ürün düzenleme
router.get('/:id/edit', productController.getEditProductForm);
router.post('/:id/edit', productController.updateProduct);

// Ürün silme
router.post('/:id/delete', productController.deleteProduct);

module.exports = router;