// Global hata yönetimi middleware'i
const errorMiddleware = (err, req, res, next) => {
  console.error('❌ Hata Yakalandı:', err);

  // Varsayılan hata mesajı
  let error = {
    message: 'Sunucu hatası oluştu',
    statusCode: 500
  };

  // MongoDB hatası
  if (err.name === 'MongoError') {
    error.message = 'Veritabanı hatası oluştu';
    error.statusCode = 500;
  }

  // Validation hatası
  if (err.name === 'ValidationError') {
    error.message = 'Geçersiz veri';
    error.statusCode = 400;
  }

  // Cast hatası (geçersiz ID)
  if (err.name === 'CastError') {
    error.message = 'Geçersiz ID formatı';
    error.statusCode = 400;
  }

  // Özel hata mesajı
  if (err.message) {
    error.message = err.message;
  }

  // Status code
  if (err.statusCode) {
    error.statusCode = err.statusCode;
  }

  // Geliştirme ortamında stack trace göster
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  // JSON response (API istekleri için)
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error.stack && { stack: error.stack })
    });
  }

  // EJS sayfası render (web istekleri için)
  res.status(error.statusCode).render('pages/error', {
    title: 'Hata',
    message: error.message,
    stack: error.stack,
    constants: require('../config/constants').APP_CONSTANTS
  });
};

module.exports = errorMiddleware;