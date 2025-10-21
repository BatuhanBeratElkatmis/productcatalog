const Category = require('../models/Category');
const Product = require('../models/Product');
const { APP_CONSTANTS } = require('../config/constants');

const categoryController = {
  // Kategori listesi sayfası
  getCategories: async (req, res) => {
    try {
      const categories = await Category.getAll();

      // Her kategori için ürün sayısını getir
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Category.getProductCount(category._id);
          return {
            ...category,
            productCount
          };
        })
      );

      res.render('pages/categories/list', {
        title: 'Kategoriler',
        categories: categoriesWithCounts,
        constants: APP_CONSTANTS
      });
    } catch (error) {
      console.error('Kategori listesi yüklenirken hata:', error);
      res.status(500).render('pages/error', {
        title: 'Hata',
        message: 'Kategori listesi yüklenirken bir hata oluştu.'
      });
    }
  },

  // Yeni kategori oluştur
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;

      // Basit validasyon
      if (!name) {
        const categories = await Category.getAll();
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            const productCount = await Category.getProductCount(category._id);
            return { ...category, productCount };
          })
        );

        return res.render('pages/categories/list', {
          title: 'Kategoriler',
          categories: categoriesWithCounts,
          constants: APP_CONSTANTS,
          error: 'Kategori adı zorunludur.'
        });
      }

      await Category.create({ name, description });

      res.redirect('/categories');
    } catch (error) {
      console.error('Kategori oluşturulurken hata:', error);
      const categories = await Category.getAll();
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Category.getProductCount(category._id);
          return { ...category, productCount };
        })
      );

      res.status(500).render('pages/categories/list', {
        title: 'Kategoriler',
        categories: categoriesWithCounts,
        constants: APP_CONSTANTS,
        error: 'Kategori oluşturulurken bir hata oluştu.'
      });
    }
  },

  // Kategori sil - GÜNCELLENDİ: DELETE methodu için
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      // Kategoriye ait ürün var mı kontrol et
      const productCount = await Category.getProductCount(id);
      
      if (productCount > 0) {
        const categories = await Category.getAll();
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            const count = await Category.getProductCount(category._id);
            return { ...category, productCount: count };
          })
        );

        return res.render('pages/categories/list', {
          title: 'Kategoriler',
          categories: categoriesWithCounts,
          constants: APP_CONSTANTS,
          error: 'Bu kategoriye ait ürünler olduğu için silinemez. Önce ürünleri silin veya taşıyın.'
        });
      }

      const deletedCount = await Category.delete(id);

      if (deletedCount === 0) {
        return res.status(404).render('pages/error', {
          title: 'Kategori Bulunamadı',
          message: 'Silmek istediğiniz kategori mevcut değil.'
        });
      }

      res.redirect('/categories');
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      res.status(500).render('pages/error', {
        title: 'Hata',
        message: 'Kategori silinirken bir hata oluştu.'
      });
    }
  }
};

module.exports = categoryController;