const { getCollection } = require('../config/database');
const { ObjectId } = require('mongodb');

const Product = {
  // Tüm ürünleri getir (filtrelerle birlikte)
  getAll: async (filters = {}, sort = {}, pagination = {}) => {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        rating,
        inStock,
        search,
        brand
      } = filters;

      const query = {};

      // Kategori filtresi
      if (category && category !== 'all') {
        query.category = category;
      }

      // Fiyat aralığı filtresi
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      // Rating filtresi
      if (rating) {
        query.rating = { $gte: parseFloat(rating) };
      }

      // Stok durumu filtresi
      if (inStock === 'true') {
        query.stock = { $gt: 0 };
      }

      // Marka filtresi
      if (brand) {
        query.brand = { $regex: brand, $options: 'i' };
      }

      // HATA DÜZELTİLDİ: Arama filtresi
      // Yavaş olan $regex sorgusu yerine, performansı artırmak için
      // veritabanında oluşturulan text index'i kullanan $text operatörü eklendi.
      if (search) {
        query.$text = { $search: search };
      }

      // Sıralama
      const sortOptions = {};
      if (sort.field) {
        sortOptions[sort.field] = sort.order || 1;
      } else {
        sortOptions.createdAt = -1; // Varsayılan: en yeni
      }

      // Sayfalama
      const page = parseInt(pagination.page) || 1;
      const limit = parseInt(pagination.limit) || 12;
      const skip = (page - 1) * limit;

      const collection = getCollection('products');
      const products = await collection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray();

      // Toplam ürün sayısı
      const total = await collection.countDocuments(query);

      return {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Ürünler getirilirken hata: ${error.message}`);
    }
  },

  // ID'ye göre ürün getir
  getById: async (id) => {
    try {
      if (!ObjectId.isValid(id)) {
        return null;
      }
      const collection = getCollection('products');
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error(`Ürün getirilirken hata: ${error.message}`);
    }
  },

  // Yeni ürün oluştur
  create: async (productData) => {
    try {
      const collection = getCollection('products');
      
      const newProduct = {
        ...productData,
        price: parseFloat(productData.price),
        rating: parseFloat(productData.rating) || 0,
        stock: parseInt(productData.stock) || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newProduct);
      return result.insertedId;
    } catch (error) {
      throw new Error(`Ürün oluşturulurken hata: ${error.message}`);
    }
  },

  // Ürün güncelle
  update: async (id, updateData) => {
    try {
      if (!ObjectId.isValid(id)) {
        return 0;
      }
      const collection = getCollection('products');
      
      const updates = {
        ...updateData,
        price: parseFloat(updateData.price),
        rating: parseFloat(updateData.rating),
        stock: parseInt(updateData.stock),
        updatedAt: new Date()
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );

      return result.modifiedCount;
    } catch (error) {
      throw new Error(`Ürün güncellenirken hata: ${error.message}`);
    }
  },

  // Ürün sil
  delete: async (id) => {
    try {
      if (!ObjectId.isValid(id)) {
        return 0;
      }
      const collection = getCollection('products');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Ürün silinirken hata: ${error.message}`);
    }
  },

  // Benzer ürünleri getir
  getSimilar: async (productId, category, limit = 4) => {
    try {
      if (!ObjectId.isValid(productId)) {
        return [];
      }
      const collection = getCollection('products');
      return await collection
        .find({ 
          category: category,
          _id: { $ne: new ObjectId(productId) }
        })
        .limit(limit)
        .toArray();
    } catch (error) {
      throw new Error(`Benzer ürünler getirilirken hata: ${error.message}`);
    }
  },

  // Kategoriye göre ürün sayısı
  getCountByCategory: async () => {
    try {
      const collection = getCollection('products');
      return await collection.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]).toArray();
    } catch (error) {
      throw new Error(`Kategori sayıları getirilirken hata: ${error.message}`);
    }
  },

  // MARKALARI GETİR
  getBrands: async () => {
    try {
      const collection = getCollection('products');
      const brands = await collection.distinct('brand');
      return brands.filter(brand => brand && brand.trim() !== '');
    } catch (error) {
      throw new Error(`Markalar getirilirken hata: ${error.message}`);
    }
  }
};

module.exports = Product;

