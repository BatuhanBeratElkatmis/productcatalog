const Product = require('../models/Product');
// HATA 4 DÜZELTMESİ: Kategori artık global middleware'den geldiği için burada gerek yok.
// const Category = require('../models/Category');
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

      // HATA 4 DÜZELTMESİ: Kategori verisi 'res.locals' aracılığıyla zaten mevcut.
      // const categories = await Category.getAll();

      res.render('pages/home', {
        title: 'Ana Sayfa',
        popularProducts: popularProducts.products,
        // categories, // Kaldırıldı
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
    // HATA 4 DÜZELTMESİ: Kategori verisi 'res.locals' aracılığıyla zaten mevcut.
    // Hiçbir değişiklik gerekmez.
    res.render('pages/about', {
      title: 'Hakkımızda',
      constants: APP_CONSTANTS
    });
  },

  // İletişim sayfası
  getContactPage: (req, res) => {
    // HATA 4 DÜZELTMESİ: Kategori verisi 'res.locals' aracılığıyla zaten mevcut.
    // Hiçbir değişiklik gerekmez.
    res.render('pages/contact', {
      title: 'İletişim',
      constants: APP_CONSTANTS
    });
  }
};

module.exports = homeController;
