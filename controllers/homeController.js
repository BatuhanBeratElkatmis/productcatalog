const Product = require('../models/Product');
const Category = require('../models/Category');
const { APP_CONSTANTS } = require('../config/constants');

const homeController = {
  // Ana sayfa
  getHomePage: async (req, res) => {
    try {
      // Popüler ürünleri getir (rating'e göre sırala)
      const popularProducts = await Product.getAll(
        {}, 
        { field: 'rating', order: -1 }, 
        { limit: 8 }
      );

      // Tüm kategorileri getir
      const categories = await Category.getAll();

      res.render('pages/home', {
        title: 'Ana Sayfa',
        popularProducts: popularProducts.products,
        categories,
        constants: APP_CONSTANTS
      });
    } catch (error) {
      console.error('Ana sayfa yüklenirken hata:', error);
      res.status(500).render('pages/error', {
        title: 'Hata',
        message: 'Ana sayfa yüklenirken bir hata oluştu.'
      });
    }
  },

  // Hakkında sayfası
  getAboutPage: (req, res) => {
    res.render('pages/about', {
      title: 'Hakkımızda',
      constants: APP_CONSTANTS
    });
  },

  // İletişim sayfası
  getContactPage: (req, res) => {
    res.render('pages/contact', {
      title: 'İletişim',
      constants: APP_CONSTANTS
    });
  }
};

module.exports = homeController;