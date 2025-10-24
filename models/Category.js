const { getCollection } = require('../config/database');
const { ObjectId } = require('mongodb');

const Category = {
  // Tüm kategorileri getir
  getAll: async () => {
    try {
      const collection = getCollection('categories');
      return await collection.find().sort({ name: 1 }).toArray();
    } catch (error) {
      throw new Error(`Kategoriler getirilirken hata: ${error.message}`);
    }
  },

  // ID'ye göre kategori getir
  getById: async (id) => {
    try {
      // HATA DÜZELTİLDİ: ObjectId formatı kontrolü eklendi.
      if (!ObjectId.isValid(id)) {
        return null; // Geçersiz formatta ID gelirse null döndür.
      }
      const collection = getCollection('categories');
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error(`Kategori getirilirken hata: ${error.message}`);
    }
  },

  // Slug'a göre kategori getir
  getBySlug: async (slug) => {
    try {
      const collection = getCollection('categories');
      return await collection.findOne({ slug: slug });
    } catch (error) {
      throw new Error(`Kategori getirilirken hata: ${error.message}`);
    }
  },

  // Yeni kategori oluştur
  create: async (categoryData) => {
    try {
      const collection = getCollection('categories');
      
      const newCategory = {
        ...categoryData,
        slug: categoryData.name.toLowerCase().replace(/ /g, '-'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newCategory);
      return result.insertedId;
    } catch (error) {
      throw new Error(`Kategori oluşturulurken hata: ${error.message}`);
    }
  },

  // Kategori güncelle
  update: async (id, updateData) => {
    try {
      // HATA DÜZELTİLDİ: ObjectId formatı kontrolü eklendi.
      if (!ObjectId.isValid(id)) {
        return 0; // Geçersiz formatta ID gelirse 0 döndür.
      }
      const collection = getCollection('categories');
      
      const updates = {
        ...updateData,
        slug: updateData.name.toLowerCase().replace(/ /g, '-'),
        updatedAt: new Date()
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Kategori güncellenirken hata: ${error.message}`);
    }
  },

  // Kategori sil
  delete: async (id) => {
    try {
      // HATA DÜZELTİLDİ: ObjectId formatı kontrolü eklendi.
      if (!ObjectId.isValid(id)) {
        return 0; // Geçersiz formatta ID gelirse 0 döndür.
      }
      const collection = getCollection('categories');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Kategori silinirken hata: ${error.message}`);
    }
  },

  // Kategoriye ait ürün sayısını getir
  getProductCount: async (categorySlug) => {
    try {
      const productsCollection = getCollection('products');
      return await productsCollection.countDocuments({ 
        category: categorySlug
      });
    } catch (error) {
      throw new Error(`Ürün sayısı getirilirken hata: ${error.message}`);
    }
  },

  // HATA 1 DÜZELTMESİ: Ürün sayılarıyla birlikte tüm kategorileri getirmek için aggregation
  getAllWithProductCounts: async () => {
    try {
      const collection = getCollection('categories');
      return await collection.aggregate([
        {
          // Kategorileri 'slug' alanı üzerinden Ürünlerin 'category' alanı ile birleştir
          $lookup: {
            from: 'products',
            localField: 'slug',
            foreignField: 'category',
            as: 'products'
          }
        },
        {
          // Her kategori için ürün sayısını hesapla
          $addFields: {
            productCount: { $size: '$products' }
          }
        },
        {
          // Gereksiz 'products' dizisini sonuçtan kaldır
          $project: {
            products: 0 
          }
        },
        {
          // İsim sırasına göre diz
          $sort: { name: 1 }
        }
      ]).toArray();
    } catch (error) {
      throw new Error(`Kategoriler ve ürün sayıları getirilirken hata: ${error.message}`);
    }
  }
};

module.exports = Category;
