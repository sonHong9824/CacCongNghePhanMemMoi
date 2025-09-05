import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  Spin,
  Empty,
  Typography,
  Menu,
} from "antd";
import {
  getCategoryApi,
  getProductApi,
  getProductByCategoryApi,
} from "../util/api";

const { Title } = Typography;
const { SubMenu } = Menu;

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);

  const [products, setProducts] = useState([]);
  const [loadingProd, setLoadingProd] = useState(false);

  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [total, setTotal] = useState(0);

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCat(true);
        const res = await getCategoryApi();
        const list =
          res?.data || res?.DT || res?.categories || res || [];

        setCategories(list);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  // Lấy sản phẩm
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
        setProducts(res?.data?.products || res?.products || []);
        setTotal(res?.data?.total || res?.total || 0);
      } catch (err) {
        console.error("Lỗi load products:", err);
      } finally {
        setLoadingProd(false);
      }
    };
    fetchProducts();
  }, [categoryId, page]);

  // Gom nhóm categories
  const groupedCategories = {
    Nam: [],
    Nữ: [],
    "Trẻ em": [],
  };

  categories.forEach((cat) => {
    if (/nam/i.test(cat.name)) {
      groupedCategories.Nam.push(cat);
    } else if (/nữ/i.test(cat.name) || /nu/i.test(cat.name)) {
      groupedCategories.Nữ.push(cat);
    } else {
      groupedCategories["Trẻ em"].push(cat);
    }
  });

  const handleCategoryChange = (catId) => {
    setCategoryId(catId || null);
    setPage(1);
  };

  return (
    <div style={{ padding: "20px", maxWidth: 1300, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 20 }}>
        Danh sách sản phẩm
      </Title>

      <Row gutter={24}>
        {/* Sidebar */}
        <Col xs={24} sm={6} md={5} lg={4}>
          {loadingCat ? (
            <Spin />
          ) : (
            <Menu
              mode="inline"
              selectedKeys={[categoryId || "all"]}
              onClick={(e) =>
                handleCategoryChange(e.key === "all" ? null : e.key)
              }
              style={{
                borderRadius: 8,
                padding: "12px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Menu.Item key="all">Tất cả</Menu.Item>

              <SubMenu key="men" title="👔 Nam">
                {groupedCategories.Nam.map((cat) => (
                  <Menu.Item key={cat._id}>{cat.name}</Menu.Item>
                ))}
              </SubMenu>

              <SubMenu key="women" title="👗 Nữ">
                {groupedCategories.Nữ.map((cat) => (
                  <Menu.Item key={cat._id}>{cat.name}</Menu.Item>
                ))}
              </SubMenu>

              <SubMenu key="kids" title="🧸 Trẻ em">
                {groupedCategories["Trẻ em"].map((cat) => (
                  <Menu.Item key={cat._id}>{cat.name}</Menu.Item>
                ))}
              </SubMenu>
            </Menu>
          )}
        </Col>

        {/* Danh sách sản phẩm */}
        <Col xs={24} sm={18} md={19} lg={20}>
          <Spin spinning={loadingProd}>
            {products && products.length > 0 ? (
              <>
                <Row gutter={[16, 16]}>
                  {products.map((prod) => (
                    <Col key={prod._id || prod.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                        cover={
                          prod.images && prod.images.length > 0 ? (
                            <img
                              alt={prod.name}
                              src={prod.images[0]}
                              style={{
                                height: 200,
                                objectFit: "cover",
                                borderBottom: "1px solid #f0f0f0",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#fafafa",
                                color: "#aaa",
                              }}
                            >
                              Không có ảnh
                            </div>
                          )
                        }
                      >
                        <Card.Meta
                          title={prod.name}
                          description={
                            <span
                              style={{
                                color: "#1890ff",
                                fontWeight: 500,
                              }}
                            >
                              {prod.price
                                ? `$${prod.price.toLocaleString()}`
                                : "Liên hệ"}
                            </span>
                          }
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
                    style={{
                        marginTop: 30,
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                    showSizeChanger={false}
                />

              </>
            ) : (
              !loadingProd && <Empty description="Không có sản phẩm nào" />
            )}
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default ProductPage;
