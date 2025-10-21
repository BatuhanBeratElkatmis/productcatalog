const express = require('express');
const router = express.Router();

// Route gruplarını içe aktar
const homeRoutes = require('./homeRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');

// Route gruplarını kullan
router.use('/', homeRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;