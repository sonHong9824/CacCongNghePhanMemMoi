const express = require('express');
const {
  createUser,
  handleLogin,
  getUser,
  getAccount
} = require('../controllers/userController');

const auth = require('../middleware/auth');
const {
  createCategory,
  getCategories
} = require('../controllers/categoryController');
const {
  createProduct,
  getProducts,
  getProductsByCategory
} = require('../controllers/productController');

const routerAPI = express.Router();

routerAPI.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from server"
  });
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);

routerAPI.get('/users', auth, getUser);
routerAPI.get('/account', auth, getAccount);

routerAPI.post('/category', auth, createCategory);
routerAPI.get('/category', getCategories);

routerAPI.post('/product', auth, createProduct);
routerAPI.get('/product', getProducts);

routerAPI.get('/category/:categoryId', getProductsByCategory);

module.exports = routerAPI;
