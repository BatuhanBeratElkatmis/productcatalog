const Category = require('../models/Category');
const { APP_CONSTANTS } = require('../config/constants');

const categoryController = {
  // Kategori listesi sayfası
  getCategories: async (req, res) => {
    try {
      // HATA 1 DÜZELTMESİ: N+1 sorgu problemi düzeltildi.
      // Artık 'res.locals.categories' kullanmak yerine,
      // ürün sayılarını tek bir aggregation sorgusuyla getiren yeni fonksiyonu çağırıyoruz.
      const categoriesWithCounts = await Category.getAllWithProductCounts();

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
        // HATA 1 DÜZELTMESİ: Hata durumunda da N+1 sorgu problemi düzeltildi.
        const categoriesWithCounts = await Category.getAllWithProductCounts();

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
      // HATA 1 DÜZELTMESİ: Hata durumunda da N+1 sorgu problemi düzeltildi.
      const categoriesWithCounts = await Category.getAllWithProductCounts();

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
        // HATA 1 DÜZELTMESİ: Hata durumunda da N+1 sorgu problemi düzeltildi.
        const categoriesWithCounts = await Category.getAllWithProductCounts();

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
