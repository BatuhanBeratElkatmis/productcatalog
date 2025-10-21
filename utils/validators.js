// Veri validasyon fonksiyonları
const validators = {
  // E-posta validasyonu
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Telefon numarası validasyonu
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // URL validasyonu
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Sayı validasyonu
  isNumber: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  // Pozitif sayı validasyonu
  isPositiveNumber: (value) => {
    return validators.isNumber(value) && parseFloat(value) > 0;
  },

  // Tamsayı validasyonu
  isInteger: (value) => {
    return Number.isInteger(Number(value));
  },

  // Boşluk kontrolü
  isNotEmpty: (value) => {
    return value && value.toString().trim().length > 0;
  },

  // Minimum uzunluk kontrolü
  hasMinLength: (value, minLength) => {
    return value && value.toString().length >= minLength;
  },

  // Maksimum uzunluk kontrolü
  hasMaxLength: (value, maxLength) => {
    return value && value.toString().length <= maxLength;
  },

  // Ürün fiyatı validasyonu
  isValidPrice: (price) => {
    return validators.isPositiveNumber(price) && parseFloat(price) <= 1000000;
  },

  // Stok miktarı validasyonu
  isValidStock: (stock) => {
    return validators.isInteger(stock) && parseInt(stock) >= 0;
  },

  // Rating validasyonu
  isValidRating: (rating) => {
    return validators.isNumber(rating) && 
           parseFloat(rating) >= 0 && 
           parseFloat(rating) <= 5;
  },

  // Kategori ID validasyonu
  isValidCategoryId: (categoryId) => {
    const validCategories = ['electronics', 'fashion', 'home', 'sports', 'books'];
    return validCategories.includes(categoryId);
  },

  // Dosya uzantısı validasyonu
  isValidImageExtension: (filename) => {
    if (!filename) return false;
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return allowedExtensions.includes(extension);
  }
};

module.exports = validators;