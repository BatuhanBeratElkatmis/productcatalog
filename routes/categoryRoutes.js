const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middleware/validationMiddleware');

// Kategori listesi ve yönetimi
router.get('/', categoryController.getCategories);
router.post('/', validateCategory, categoryController.createCategory);
router.delete('/:id/delete', categoryController.deleteCategory); // DELETE methodu

module.exports = router;