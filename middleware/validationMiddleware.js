// Ürün validasyon middleware'i
const validateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body;
  const errors = [];

  // İsim validasyonu
  if (!name || name.trim().length < 2) {
    errors.push('Ürün adı en az 2 karakter olmalıdır');
  }

  if (name && name.length > 100) {
    errors.push('Ürün adı 100 karakterden uzun olamaz');
  }

  // Fiyat validasyonu
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    errors.push('Geçerli bir fiyat giriniz');
  }

  if (price && parseFloat(price) > 1000000) {
    errors.push('Fiyat 1.000.000 TL den yüksek olamaz');
  }

  // Kategori validasyonu
  if (!category) {
    errors.push('Kategori seçimi zorunludur');
  }

  // Stok validasyonu
  if (!stock || isNaN(stock) || parseInt(stock) < 0) {
    errors.push('Geçerli bir stok miktarı giriniz');
  }

  // Rating validasyonu
  if (req.body.rating) {
    const rating = parseFloat(req.body.rating);
    if (rating < 0 || rating > 5) {
      errors.push('Puan 0-5 arasında olmalıdır');
    }
  }

  // Hata varsa
  if (errors.length > 0) {
    return res.status(400).render(`pages/products/${req.method === 'POST' ? 'new' : 'edit'}`, {
      title: req.method === 'POST' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle',
      product: req.body,
      categories: require('../models/Category').getAll(),
      constants: require('../config/constants').APP_CONSTANTS,
      errors
    });
  }

  next();
};

// Kategori validasyon middleware'i
const validateCategory = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  // İsim validasyonu
  if (!name || name.trim().length < 2) {
    errors.push('Kategori adı en az 2 karakter olmalıdır');
  }

  if (name && name.length > 50) {
    errors.push('Kategori adı 50 karakterden uzun olamaz');
  }

  // Hata varsa
  if (errors.length > 0) {
    return res.status(400).render('pages/categories/list', {
      title: 'Kategoriler',
      categories: require('../models/Category').getAll(),
      constants: require('../config/constants').APP_CONSTANTS,
      errors
    });
  }

  next();
};

// Arama query validasyonu
const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;

  if (q && q.length < 2) {
    return res.status(400).render('pages/products/list', {
      title: 'Arama Sonuçları',
      products: [],
      pagination: { page: 1, limit: 12, total: 0, pages: 0 },
      searchQuery: q,
      errors: ['Arama terimi en az 2 karakter olmalıdır'],
      constants: require('../config/constants').APP_CONSTANTS
    });
  }

  next();
};

module.exports = {
  validateProduct,
  validateCategory,
  validateSearchQuery
};