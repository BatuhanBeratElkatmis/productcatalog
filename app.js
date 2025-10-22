const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');

// Çevre değişkenlerini yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB bağlantısını içe aktar
const { connectDB } = require('./config/database');

// Helpers'ı içe aktar
const helpers = require('./utils/helpers');

// HATA 4 DÜZELTMESİ: Category modelini ana app'e dahil et
const Category = require('./models/Category');

// Middleware'ler
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); // PUT ve DELETE için

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helpers'ı ve sabitleri tüm template'lere aktar
app.locals.helpers = helpers;
app.locals.constants = require('./config/constants').APP_CONSTANTS;

// HATA 4 DÜZELTMESİ (En İyi Yöntem): Global Middleware
// Bu middleware, her istekte kategorileri çeker ve
// 'res.locals' aracılığıyla tüm EJS temalarında 'categories' değişkenini kullanılabilir hale getirir.
app.use(async (req, res, next) => {
  try {
    const categories = await Category.getAll();
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.error("Global kategori middleware hatası:", error);
    next(error); // Hata yönetimi middleware'ine yönlendir
  }
});

// Routes
app.use('/', require('./routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/error', {
    title: 'Sayfa Bulunamadı',
    message: 'Aradığınız sayfa mevcut değil.'
  });
});

// Error handling middleware
app.use(require('./middleware/errorMiddleware'));

// Sunucuyu başlat
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB bağlantısı başarılı');

    app.listen(PORT, () => {
      console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    });
  } catch (error) {
    console.error('❌ Sunucu başlatılamadı:', error);
    process.exit(1);
  }
};

startServer();






// product-catalog/
// ├── app.js                    # Ana uygulama ve sunucu dosyası
// ├── package.json
// ├── .env                      # Çevre değişkenleri
// ├── .gitignore
// ├── config/                   # Konfigürasyon dosyaları
// │   ├── database.js           # MongoDB bağlantı konfigürasyonu
// │   └── constants.js          # Sabit değerler
// ├── public/                   # Static dosyalar
// │   ├── assets/
// │   │   ├── images/           # Görseller
// │   │   │   ├── products/     # Ürün görselleri
// │   │   │   ├── icons/        # İkonlar
// │   │   │   └── logos/        # Logolar
// │   │   └── fonts/            # Font dosyaları
// │   ├── css/
// │   │   ├── base/             # Temel stiller
// │   │   │   ├── reset.css     # CSS reset
// │   │   │   ├── typography.css # Yazı stilleri
// │   │   │   ├── variables.css # CSS değişkenleri
// │   │   │   └── utilities.css # Utility class'ları
// │   │   ├── components/       # Bileşen stilleri
// │   │   │   ├── navbar.css
// │   │   │   ├── buttons.css
// │   │   │   ├── cards.css
// │   │   │   ├── forms.css
// │   │   │   ├── filters.css
// │   │   │   └── pagination.css
// │   │   ├── layouts/          # Layout stilleri
// │   │   │   ├── grid.css
// │   │   │   ├── header.css
// │   │   │   └── footer.css
// │   │   ├── pages/            # Sayfa özel stilleri
// │   │   │   ├── home.css
// │   │   │   ├── products.css
// │   │   │   ├── product-detail.css
// │   │   │   └── categories.css
// │   │   └── main.css          # Tüm CSS dosyalarını import eden ana dosya
// │   └── js/
// │       ├── modules/          # JavaScript modülleri
// │       │   ├── filters.js    # Filtreleme işlevleri
// │       │   ├── ui.js         # UI interaksiyonları
// │       │   └── form-validation.js # Form validasyonu
// │       └── main.js           # Ana JavaScript dosyası
// ├── views/
// │   ├── layouts/              # Layout şablonları
// │   │   └── main.ejs          # Ana layout template
// │   ├── partials/             # Tekrar kullanılan bileşenler
// │   │   ├── header.ejs
// │   │   ├── navbar.ejs
// │   │   ├── footer.ejs
// │   │   ├── product-card.ejs  # Ürün kartı component'i
// │   │   ├── filter-sidebar.ejs # Filtre sidebar component'i
// │   │   └── pagination.ejs    # Sayfalama component'i
// │   └── pages/                # Sayfa şablonları
// │       ├── home.ejs
// │       ├── products/
// │       │   ├── list.ejs      # Ürün listesi
// │       │   ├── detail.ejs    # Ürün detay
// │       │   ├── new.ejs       # Yeni ürün formu
// │       │   └── edit.ejs      # Ürün düzenleme formu
// │       └── categories/
// │           ├── list.ejs      # Kategori listesi
// │           └── manage.ejs    # Kategori yönetimi
// ├── models/                   # Veritabanı modelleri ve işlemleri
// │   ├── Product.js            # Ürün modeli ve CRUD işlemleri
// │   └── Category.js           # Kategori modeli ve CRUD işlemleri
// ├── controllers/              # İş mantığı (Controllers)
// │   ├── homeController.js
// │   ├── productController.js
// │   └── categoryController.js
// ├── routes/                   # Route tanımlamaları
// │   ├── index.js              # Ana route dosyası
// │   ├── homeRoutes.js
// │   ├── productRoutes.js
// │   └── categoryRoutes.js
// ├── middleware/               # Custom middleware'ler
// │   ├── errorMiddleware.js    # Hata yönetimi middleware
// │   └── validationMiddleware.js # Validasyon middleware
// ├── utils/                    # Yardımcı fonksiyonlar
// │   ├── helpers.js            # Genel helper fonksiyonlar
// │   ├── validators.js         # Veri validasyon fonksiyonları
// │   └── seedData.js           # Hazır veri oluşturma
// └── data/                     # Hazır veri dosyaları
//     ├── products.json         # Örnek ürün verileri
//     └── categories.json       # Örnek kategori verileri






// # public/assets/ klasör yapısı
// public/assets/
// ├── images/
// │   ├── products/
// │   │   ├── placeholder.jpg
// │   │   ├── iphone15-pro-1.jpg
// │   │   ├── iphone15-pro-2.jpg
// │   │   ├── galaxy-s24-ultra-1.jpg
// │   │   ├── galaxy-s24-ultra-2.jpg
// │   │   ├── macbook-air-m3-1.jpg
// │   │   ├── macbook-air-m3-2.jpg
// │   │   ├── nike-air-max-270-1.jpg
// │   │   ├── nike-air-max-270-2.jpg
// │   │   ├── adidas-ultraboost-22-1.jpg
// │   │   ├── adidas-ultraboost-22-2.jpg
// │   │   ├── ikea-markus-1.jpg
// │   │   ├── ikea-markus-2.jpg
// │   │   ├── philips-4k-tv-1.jpg
// │   │   ├── philips-4k-tv-2.jpg
// │   │   ├── zumba-set-1.jpg
// │   │   ├── zumba-set-2.jpg
// │   │   ├── crazy-rich-asians-1.jpg
// │   │   ├── crazy-rich-asians-2.jpg
// │   │   ├── apple-watch-9-1.jpg
// │   │   └── apple-watch-9-2.jpg
// │   ├── categories/
// │   │   ├── electronics.jpg
// │   │   ├── fashion.jpg
// │   │   ├── home.jpg
// │   │   ├── sports.jpg
// │   │   └── books.jpg
// │   ├── icons/
// │   │   ├── search.svg
// │   │   ├── cart.svg
// │   │   ├── user.svg
// │   │   └── menu.svg
// │   ├── logos/
// │   │   └── logo.png
// │   └── favicon.ico
// └── fonts/
//     ├── inter-var.woff2
//     └── inter-var.woff
