const Product = require('../models/product'); // import model
const {
  createProductService,
  getProductService,
  getProductByCategoryService
} = require('../services/productService');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, images, category } = req.body;
    const data = await createProductService(
      name,
      description,
      price,
      stock,
      images,
      category
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
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

module.exports = {
  createProduct,
  getProducts,
  getProductsByCategory
};
