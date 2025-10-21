const { APP_CONSTANTS } = require('../config/constants');

// Format helpers
const helpers = {
  // Fiyat formatlama
  formatPrice: (price) => {
    if (!price && price !== 0) return 'Fiyat Yok';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  },

  // Tarih formatlama
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Kısa açıklama oluşturma
  truncateText: (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  // Rating yıldızları oluşturma
  generateStarRating: (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '';
    
    // Tam yıldızlar
    for (let i = 0; i < fullStars; i++) {
      stars += '<span class="star full">★</span>';
    }
    
    // Yarım yıldız
    if (halfStar) {
      stars += '<span class="star half">★</span>';
    }
    
    // Boş yıldızlar
    for (let i = 0; i < emptyStars; i++) {
      stars += '<span class="star empty">★</span>';
    }

    return stars;
  },

  // Sayfalama URL'si oluşturma
  buildPaginationUrl: (baseUrl, query, page) => {
    const url = new URL(baseUrl, APP_CONSTANTS.APP_URL);
    
    // Mevcut query parametrelerini ekle
    Object.keys(query).forEach(key => {
      if (key !== 'page' && query[key]) {
        url.searchParams.set(key, query[key]);
      }
    });
    
    // Yeni sayfa numarasını ekle
    if (page > 1) {
      url.searchParams.set('page', page);
    }
    
    return url.pathname + url.search;
  },

  // Aktif filtre kontrolü
  isFilterActive: (filters) => {
    return Object.keys(filters).some(key => {
      if (key === 'page') return false;
      return filters[key] !== undefined && filters[key] !== '';
    });
  },

  // Query string'den filtre objesi oluşturma
  parseFiltersFromQuery: (query) => {
    const filters = {};
    
    if (query.category && query.category !== 'all') {
      filters.category = query.category;
    }
    
    if (query.minPrice) {
      filters.minPrice = parseFloat(query.minPrice);
    }
    
    if (query.maxPrice) {
      filters.maxPrice = parseFloat(query.maxPrice);
    }
    
    if (query.rating) {
      filters.rating = parseFloat(query.rating);
    }
    
    if (query.inStock) {
      filters.inStock = query.inStock === 'true';
    }
    
    if (query.brand) {
      filters.brand = query.brand;
    }
    
    if (query.search) {
      filters.search = query.search;
    }

    return filters;
  },

  // SEO uyumlu slug oluşturma
  generateSlug: (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  },

  // Rastgele ID oluşturma
  generateId: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

module.exports = helpers;