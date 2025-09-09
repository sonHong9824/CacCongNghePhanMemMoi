const Product = require('../models/product'); // import model
const { esClient } = require('../elasticsearch');
const {
  createProductService,
  getProductService,
  getProductByCategoryService
} = require('../services/productService');

const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();

    // Index vào Elasticsearch
    await esClient.index({
      index: 'products',
      id: savedProduct._id.toString(),
      document: {
        name: savedProduct.name,
        description: savedProduct.description,
        price: savedProduct.price,
        stock: savedProduct.stock,
        images: savedProduct.images,
        category: savedProduct.category.toString(),
        discount: savedProduct.discount || 0,
        createdAt: savedProduct.createdAt
      }
    });

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;      
    const limit = parseInt(req.query.limit) || 10;    
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate('category');

    res.status(200).json({
      EC: 0,
      EM: "Get products successfully",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    res.status(500).json({ EC: 1, EM: "Error fetching products", error });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({ category: categoryId });
    const products = await Product.find({ category: categoryId })
      .skip(skip)
      .limit(limit)
      .populate('category');

    res.status(200).json({
      EC: 0,
      EM: "Get products by category successfully",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    res.status(500).json({ EC: 1, EM: "Error fetching products by category", error });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { q, keyword, categoryId, priceMin, priceMax, discountMin, discountMax } = req.query;

    console.log("👉 Nhận request search với query:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const mustQueries = [];

    const searchKeyword = keyword || q;
    if (searchKeyword) {
      mustQueries.push({
        multi_match: {
          query: searchKeyword,
          fields: ["name^3", "description"],
          fuzziness: "AUTO"
        }
      });
    }

    if (categoryId) {
      mustQueries.push({ term: { category: categoryId } });
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      const range = {};
      if (priceMin !== undefined) range.gte = parseFloat(priceMin);
      if (priceMax !== undefined) range.lte = parseFloat(priceMax);
      mustQueries.push({ range: { price: range } });
    }

    if (discountMin !== undefined || discountMax !== undefined) {
      const range = {};
      if (discountMin !== undefined) range.gte = parseFloat(discountMin);
      if (discountMax !== undefined) range.lte = parseFloat(discountMax);
      mustQueries.push({ range: { discount: range } });
    }

    if (mustQueries.length === 0) {
      console.warn("⚠️ Không có filter nào, return lỗi");
      return res.status(400).json({ error: "Missing search query or filters" });
    }

    const result = await esClient.search({
      index: "products",
      from: (page - 1) * limit,
      size: limit,
      query: { bool: { must: mustQueries } }
    });

    console.log("✅ Elasticsearch trả về:", JSON.stringify(result.hits, null, 2));

    const products = result.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }));

    res.json({
      EC: 0,
      EM: "Search products successfully",
      total: result.hits.total.value,
      page,
      totalPages: Math.ceil(result.hits.total.value / limit),
      products
    });
  } catch (err) {
    console.error("❌ Lỗi searchProducts:", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createProduct,
  getProducts,
  getProductsByCategory,
  searchProducts
};
