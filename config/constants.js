// CSS Breakpoints
const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

// Renk Palette
const COLORS = {
  primary: '#2563eb',
  primaryDark: '#1d4ed8',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  gray100: '#f8fafc',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a'
};

// Uygulama Sabitleri
const APP_CONSTANTS = {
  APP_NAME: process.env.APP_NAME || 'Product Catalog',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  ITEMS_PER_PAGE: 12,
  MAX_PRICE: 100000,
  CURRENCY: '₺'
};

// Kategori Sabitleri
const CATEGORIES = {
  ELECTRONICS: 'electronics',
  FASHION: 'fashion',
  HOME: 'home',
  SPORTS: 'sports',
  BOOKS: 'books'
};

// Sıralama Seçenekleri
const SORT_OPTIONS = {
  NEWEST: { field: 'createdAt', order: -1, label: 'En Yeni' },
  PRICE_LOW: { field: 'price', order: 1, label: 'Fiyat: Düşükten Yükseğe' },
  PRICE_HIGH: { field: 'price', order: -1, label: 'Fiyat: Yüksekten Düşüğe' },
  RATING: { field: 'rating', order: -1, label: 'En Yüksek Puan' },
  NAME: { field: 'name', order: 1, label: 'İsme Göre (A-Z)' }
};

module.exports = {
  BREAKPOINTS,
  COLORS,
  APP_CONSTANTS,
  CATEGORIES,
  SORT_OPTIONS
};