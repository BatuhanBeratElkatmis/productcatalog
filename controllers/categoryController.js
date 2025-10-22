const Category = require('../models/Category');
const { APP_CONSTANTS } = require('../config/constants');

const categoryController = {
  // Kategori listesi sayfası
  getCategories: async (req, res) => {
    try {
      // HATA 4 DÜZELTMESİ: 'res.locals.categories' global değişkenden alınır.
      const categories = res.locals.categories;

      // Her kategori için ürün sayısını getir
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          // DÜZELTME: Fonksiyona category._id yerine category.slug gönderiliyor.
          // Ürünler, kategorileri "slug" alanı üzerinden tanır.
          const productCount = await Category.getProductCount(category.slug);
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

      if (!name) {
        // Hata durumunda da ürün sayılarını doğru hesapla
        // HATA 4 DÜZELTMESİ: 'res.locals.categories' global değişkenden alınır.
        const categories = res.locals.categories;
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            const productCount = await Category.getProductCount(category.slug);
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
      // Hata durumunda da ürün sayılarını doğru hesapla
      // HATA 4 DÜZELTMESİ: 'res.locals.categories' global değişkenden alınır.
      const categories = res.locals.categories;
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category) => {
          const productCount = await Category.getProductCount(category.slug);
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

  // Kategori sil
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      // Önce silinecek kategorinin bilgilerini (slug dahil) al
      const categoryToDelete = await Category.getById(id);
      if (!categoryToDelete) {
          return res.status(404).render('pages/error', {
              title: 'Kategori Bulunamadı',
              message: 'Silmek istediğiniz kategori mevcut değil.'
          });
      }

      // Kategoriye ait ürün var mı kontrol et
      // DÜZELTME: Fonksiyona ID yerine kategorinin slug'ı gönderiliyor.
      const productCount = await Category.getProductCount(categoryToDelete.slug);
      
      if (productCount > 0) {
        // Hata durumunda da ürün sayılarını doğru hesapla
        // HATA 4 DÜZELTMESİ: 'res.locals.categories' global değişkenden alınır.
        const categories = res.locals.categories;
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            const count = await Category.getProductCount(category.slug);
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
