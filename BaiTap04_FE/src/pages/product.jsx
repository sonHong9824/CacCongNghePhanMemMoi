import React, { useState, useEffect } from "react";
import { Select, Card, Row, Col, Pagination, Spin, Empty } from "antd";
import { 
  getCategoryApi, 
  getProductApi, 
  getProductByCategoryApi 
} from "../util/api";

const { Option } = Select;

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);

  const [products, setProducts] = useState([]);
  const [loadingProd, setLoadingProd] = useState(false);

  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 6;
  const [total, setTotal] = useState(0);

  // 🔹 Lấy categories khi khởi tạo
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCat(true);
        const res = await getCategoryApi();
        setCategories(res.data || []);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Lấy sản phẩm (all hoặc theo category)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProd(true);
        let res;
        if (categoryId) {
          res = await getProductByCategoryApi(categoryId, page, limit);
        } else {
          res = await getProductApi(page, limit);
        }
        setProducts(res.data?.products || []);
        setTotal(res.data?.total || 0);
      } catch (err) {
        console.error("Lỗi load products:", err);
      } finally {
        setLoadingProd(false);
      }
    };
    fetchProducts();
  }, [categoryId, page]);

  const handleCategoryChange = (value) => {
    setCategoryId(value || null);
    setPage(1); // reset page khi đổi category
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Danh sách sản phẩm</h2>

      {loadingCat ? (
        <Spin />
      ) : (
        <Select
          placeholder="Chọn loại sản phẩm"
          style={{ width: 250, marginBottom: 20 }}
          onChange={handleCategoryChange}
          allowClear
        >
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      )}

      {loadingProd ? (
        <Spin />
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {products.map((prod) => (
              <Col key={prod._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    prod.images && prod.images.length > 0 ? (
                      <img
                        alt={prod.name}
                        src={prod.images[0]}
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    ) : null
                  }
                >
                  <Card.Meta
                    title={prod.name}
                    description={`$${prod.price}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={(p) => setPage(p)}
            style={{ marginTop: 20, textAlign: "center" }}
          />
        </>
      ) : (
        <Empty description="Không có sản phẩm" />
      )}
    </div>
  );
};

export default ProductPage;
