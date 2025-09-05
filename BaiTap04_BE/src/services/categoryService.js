const Category = require('../models/category');

const createCategoryService = async (name, description) => {
    const category = await Category.create({ name, description });
    return category;
};

const getCategoryService = async () => {
    const categories = await Category.find();
    return categories;
};

module.exports = {
    createCategoryService,
    getCategoryService
};
