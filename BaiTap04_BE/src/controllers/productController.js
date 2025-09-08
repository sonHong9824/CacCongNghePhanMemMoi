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
  const keyword = req.query.keyword || req.query.q;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Lọc khoảng giá
  const minPrice = req.query.priceMin !== undefined ? parseFloat(req.query.priceMin) : null;
  const maxPrice = req.query.priceMax !== undefined ? parseFloat(req.query.priceMax) : null;

  // Lọc khoảng discount
  const minDiscount = req.query.discountMin !== undefined ? parseFloat(req.query.discountMin) : null;
  const maxDiscount = req.query.discountMax !== undefined ? parseFloat(req.query.discountMax) : null;

  // Lọc theo danh mục
  const categoryId = req.query.categoryId || null;

  // Nếu không có từ khóa và filter → báo lỗi
  if (!keyword && minPrice === null && maxPrice === null && minDiscount === null && maxDiscount === null && !categoryId) {
    return res.status(400).json({ error: "Missing search query or filters" });
  }

  try {
    const mustQueries = [];

    // Tìm theo keyword
    if (keyword) {
      mustQueries.push({
        multi_match: {
          query: keyword,
          fields: ["name^3", "description"],
          fuzziness: "AUTO"
        }
      });
    }

    // Lọc theo khoảng giá
    if (minPrice !== null || maxPrice !== null) {
      const range = {};
      if (minPrice !== null) range.gte = minPrice;
      if (maxPrice !== null) range.lte = maxPrice;

      mustQueries.push({
        range: { price: range }
      });
    }

    // Lọc theo khoảng discount
    if (minDiscount !== null || maxDiscount !== null) {
      const range = {};
      if (minDiscount !== null) range.gte = minDiscount;
      if (maxDiscount !== null) range.lte = maxDiscount;

      mustQueries.push({
        range: { discount: range }
      });
    }

    // Lọc theo category
    if (categoryId) {
      mustQueries.push({
        term: { category: categoryId } // category trong ES phải là string
      });
    }

    const result = await esClient.search({
      index: "products",
      from: (page - 1) * limit,
      size: limit,
      query: {
        bool: {
          must: mustQueries
        }
      }
    });

    const products = result.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      ...hit._source,
    }));

    res.json({
      EC: 0,
      EM: "Search products successfully",
      total: result.hits.total.value,
      page,
      totalPages: Math.ceil(result.hits.total.value / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createProduct,
  getProducts,
  getProductsByCategory,
  searchProducts
};
