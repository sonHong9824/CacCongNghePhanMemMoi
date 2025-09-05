const Product = require('../models/product');

const createProductService = async (name, description, price, stock, images, category) => {
    const product = await Product.create({
        name,
        description,
        price,
        stock,
        images,
        category
    });
    return product;
};

const getProductService = async () => {
    const products = await Product.find().populate('category');
    return products;
};

const getProductByCategoryService = async (categoryId) => {
    const products = await Product.find({ category: categoryId }).populate('category');
    return products;
};

module.exports = {
    createProductService,
    getProductService,
    getProductByCategoryService
};
