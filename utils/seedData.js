const { connectDB, getDB } = require('../config/database');
const fs = require('fs');
const path = require('path');

const seedData = async () => {
  try {
    console.log('🌱 Veritabanı seed işlemi başlatılıyor...');

    // Veritabanına bağlan
    await connectDB();
    const db = getDB();

    // Kategori verilerini yükle
    const categoriesPath = path.join(__dirname, '../data/categories.json');
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
    
    // Ürün verilerini yükle
    const productsPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

    // Koleksiyonları temizle (isteğe bağlı)
    console.log('🗑️  Mevcut veriler temizleniyor...');
    await db.collection('categories').deleteMany({});
    await db.collection('products').deleteMany({});

    // Kategorileri ekle
    console.log('📂 Kategoriler ekleniyor...');
    const categoriesResult = await db.collection('categories').insertMany(categoriesData);
    console.log(`✅ ${categoriesResult.insertedCount} kategori eklendi`);

    // Ürünleri ekle
    console.log('📦 Ürünler ekleniyor...');
    const productsResult = await db.collection('products').insertMany(productsData);
    console.log(`✅ ${productsResult.insertedCount} ürün eklendi`);

    // Index'ler oluştur
    console.log('📊 Veritabanı indexleri oluşturuluyor...');
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ price: 1 });
    await db.collection('products').createIndex({ rating: -1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text', brand: 'text' });
    
    await db.collection('categories').createIndex({ slug: 1 });

    console.log('🎉 Veritabanı seed işlemi başarıyla tamamlandı!');
    console.log('\n📊 Özet:');
    console.log(`   - ${categoriesResult.insertedCount} kategori`);
    console.log(`   - ${productsResult.insertedCount} ürün`);
    console.log('\n🚀 Uygulamayı başlatmak için: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed işlemi sırasında hata:', error);
    process.exit(1);
  }
};

// Script doğrudan çalıştırılıyorsa seed işlemini başlat
if (require.main === module) {
  seedData();
}

module.exports = seedData;