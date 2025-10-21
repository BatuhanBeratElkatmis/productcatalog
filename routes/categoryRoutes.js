const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Kategori listesi ve yönetimi
router.get('/', categoryController.getCategories);
router.post('/', categoryController.createCategory);
router.post('/:id/delete', categoryController.deleteCategory);

module.exports = router;