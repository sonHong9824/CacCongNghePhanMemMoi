import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name,
        email,
        password,
    };
    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email,
        password,
    };
    return axios.post(URL_API, data);
};

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API);
};

const getCategoryApi = () => {
  const URL_API = "/v1/api/category";
  return axios.get(URL_API);
};

const createCategoryApi = (name, description) => {
  const URL_API = "/v1/api/category";
  const data = { name, description };
  return axios.post(URL_API, data);
};

const getProductApi = (page = 1, limit = 10) => {
  const URL_API = `/v1/api/product?page=${page}&limit=${limit}`;
  return axios.get(URL_API);
};

const getProductByCategoryApi = (categoryId, page = 1, limit = 10) => {
  const URL_API = `/v1/api/category/${categoryId}?page=${page}&limit=${limit}`;
  return axios.get(URL_API);
};

const createProductApi = (name, description, price, stock, images, category) => {
  const URL_API = "/v1/api/product";
  const data = { name, description, price, stock, images, category };
  return axios.post(URL_API, data);
};

const searchProductApi = ({
  keyword = "",
  page = 1,
  limit = 10,
  priceMin,
  priceMax,
  discountMin,
  discountMax,
  categoryId,
}) => {
  let URL_API = `/v1/api/product/search?keyword=${encodeURIComponent(
    keyword
  )}&page=${page}&limit=${limit}`;

  if (priceMin !== undefined) URL_API += `&priceMin=${priceMin}`;
  if (priceMax !== undefined) URL_API += `&priceMax=${priceMax}`;
  if (discountMin !== undefined) URL_API += `&discountMin=${discountMin}`;
  if (discountMax !== undefined) URL_API += `&discountMax=${discountMax}`;
  if (categoryId) URL_API += `&categoryId=${categoryId}`;

  return axios.get(URL_API);
};


export {
  createUserApi,
  loginApi,
  getUserApi,
  getCategoryApi,
  createCategoryApi,
  getProductApi,
  getProductByCategoryApi,
  createProductApi,
  searchProductApi,
};