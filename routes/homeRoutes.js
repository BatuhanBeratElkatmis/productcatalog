const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Ana sayfa route'ları
router.get('/', homeController.getHomePage);
router.get('/about', homeController.getAboutPage);
router.get('/contact', homeController.getContactPage);

module.exports = router;