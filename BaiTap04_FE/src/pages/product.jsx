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
  Input,
  Slider,
  Button,
} from "antd";
import { getCategoryApi, getProductApi, searchProductApi } from "../util/api";

const { Title } = Typography;
const { SubMenu } = Menu;
const { Search } = Input;

const ProductPage = () => {
  // ----- State categories -----
  const [categories, setCategories] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);

  // ----- State products -----
  const [products, setProducts] = useState([]);
  const [loadingProd, setLoadingProd] = useState(false);

  // ----- Bộ lọc -----
  const [categoryId, setCategoryId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [discountRange, setDiscountRange] = useState([0, 100]);

  // ----- Phân trang -----
  const [page, setPage] = useState(1);
  const limit = 8;
  const [total, setTotal] = useState(0);

  // ----- Lấy categories -----
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCat(true);
        const res = await getCategoryApi();
        console.log("Category API response:", res.data);
        // Nếu backend trả mảng trực tiếp
        const list = Array.isArray(res.data) ? res.data : res.data.categories || [];
        setCategories(list);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  // ----- Lấy products -----
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProd(true);
        let res;
        if (keyword || categoryId || priceRange || discountRange) {
          res = await searchProductApi({
            keyword,
            categoryId,
            priceMin: priceRange[0],
            priceMax: priceRange[1],
            discountMin: discountRange[0],
            discountMax: discountRange[1],
            page,
            limit,
          });
        } else {
          res = await getProductApi(page, limit);
        }
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("Lỗi load products:", err);
      } finally {
        setLoadingProd(false);
      }
    };
    fetchProducts();
  }, [categoryId, keyword, priceRange, discountRange, page]);

  // ----- Gom nhóm categories -----
  const groupedCategories = { Nam: [], Nữ: [], "Trẻ em": [] };
  categories.forEach((cat) => {
    if (/nam/i.test(cat.name)) groupedCategories.Nam.push(cat);
    else if (/nữ/i.test(cat.name) || /nu/i.test(cat.name)) groupedCategories.Nữ.push(cat);
    else groupedCategories["Trẻ em"].push(cat);
  });

  // ----- Handlers -----
  const handleCategoryChange = (catId) => {
    setCategoryId(catId || null);
    setKeyword("");
    setPage(1);
  };

  const handleSearch = (value) => {
    setKeyword(value.trim());
    setCategoryId(null);
    setPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setPage(1);
  };

  const handleDiscountChange = (value) => {
    setDiscountRange(value);
    setPage(1);
  };

  const resetFilters = () => {
    setKeyword("");
    setCategoryId(null);
    setPriceRange([0, 1000000]);
    setDiscountRange([0, 100]);
    setPage(1);
  };

  return (
    <div style={{ padding: "20px", maxWidth: 1300, margin: "0 auto" }}>
      <Title level={3} style={{ marginBottom: 20 }}>Danh sách sản phẩm</Title>

      <Search
        placeholder="Tìm kiếm sản phẩm..."
        enterButton="Tìm"
        allowClear
        onSearch={handleSearch}
        style={{ maxWidth: 400, marginBottom: 20 }}
      />

      <Row gutter={24}>
        {/* Sidebar */}
        <Col xs={24} sm={6} md={5} lg={4}>
          {loadingCat ? <Spin /> : (
            <Menu
              mode="inline"
              selectedKeys={[categoryId || "all"]}
              onClick={(e) => handleCategoryChange(e.key === "all" ? null : e.key)}
              style={{ borderRadius: 8, padding: "12px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            >
              <Menu.Item key="all">Tất cả</Menu.Item>
              <SubMenu key="men" title="👔 Nam">
                {groupedCategories.Nam.map((cat, idx) => <Menu.Item key={cat._id || idx}>{cat.name}</Menu.Item>)}
              </SubMenu>
              <SubMenu key="women" title="👗 Nữ">
                {groupedCategories.Nữ.map((cat, idx) => <Menu.Item key={cat._id || idx}>{cat.name}</Menu.Item>)}
              </SubMenu>
              <SubMenu key="kids" title="🧸 Trẻ em">
                {groupedCategories["Trẻ em"].map((cat, idx) => <Menu.Item key={cat._id || idx}>{cat.name}</Menu.Item>)}
              </SubMenu>
            </Menu>
          )}

          {/* Bộ lọc giá */}
          <div style={{ marginTop: 20, padding: "0 10px" }}>
            <Title level={5}>Khoảng giá</Title>
            <Slider
              range
              min={0}
              max={1000000}
              step={10000}
              value={priceRange}
              onChange={handlePriceChange}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span>{priceRange[0].toLocaleString()}đ</span>
              <span>{priceRange[1].toLocaleString()}đ</span>
            </div>

            <Title level={5} style={{ marginTop: 20 }}>Discount (%)</Title>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={discountRange}
              onChange={handleDiscountChange}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span>{discountRange[0]}%</span>
              <span>{discountRange[1]}%</span>
            </div>

            <Button type="link" onClick={resetFilters} style={{ marginTop: 10 }}>Reset bộ lọc</Button>
          </div>
        </Col>

        {/* Products */}
        <Col xs={24} sm={18} md={19} lg={20}>
          <Spin spinning={loadingProd}>
            {products && products.length > 0 ? (
              <>
                <Row gutter={[16, 16]}>
                  {products.map((prod) => (
                    <Col key={prod._id || prod.id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                        cover={prod.images && prod.images.length > 0 ? (
                          <img alt={prod.name} src={prod.images[0]} style={{ height: 200, objectFit: "cover", borderBottom: "1px solid #f0f0f0" }} />
                        ) : (
                          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", color: "#aaa" }}>Không có ảnh</div>
                        )}
                      >
                        <Card.Meta
                          title={prod.name}
                          description={
                            <>
                              <span style={{ color: "#1890ff", fontWeight: 500 }}>
                                {prod.price ? `${prod.price.toLocaleString()}đ` : "Liên hệ"}
                              </span>
                              <br />
                              {prod.discount ? <span style={{ color: "#f5222d" }}>Giảm: {prod.discount}%</span> : null}
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Pagination
                  current={page}
                  pageSize={limit}
                  total={total}
                  onChange={(p) => setPage(p)}
                  style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}
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
