import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Pagination,
  Spin,
  Empty,
  Typography,
  Select,
  Input,
  Slider,
  Button,
} from "antd";
import {
  getCategoryApi,
  getProductApi,
  searchProductApi,
} from "../util/api";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCat, setLoadingCat] = useState(false);
  const [loadingProd, setLoadingProd] = useState(false);

  // filter người dùng nhập
  const [filterDraft, setFilterDraft] = useState({
    keyword: "",
    categoryId: null,
    priceRange: [0, 1000000],
    discountRange: [0, 100],
  });

  // filter áp dụng (chỉ dùng cho search)
  const [filters, setFilters] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 8;
  const [total, setTotal] = useState(0);

  // load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCat(true);
        const res = await getCategoryApi();
        const list = res?.data || res?.DT || res?.categories || res || [];
        setCategories(list);
      } catch (err) {
        console.error("Lỗi load categories:", err);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategories();
  }, []);

  // load products
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoadingProd(true);
      let res;

      if (filters) {
        console.log("📡 Gọi searchProductApi với filters:", filters); // log filters
        res = await searchProductApi({
          keyword: filters.keyword,
          page,
          limit,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          discountMin: filters.discountRange?.[0],
          discountMax: filters.discountRange?.[1],
          categoryId: filters.categoryId,
        });
      } else {
        console.log("📡 Gọi getProductApi (all), page:", page); // log get all
        res = await getProductApi(page, limit);
      }

      console.log("✅ Kết quả API:", res); // log kết quả trả về

      setProducts(res?.data?.products || res?.products || []);
      setTotal(res?.data?.total || res?.total || 0);
    } catch (err) {
      console.error("❌ Lỗi load/search products:", err);
    } finally {
      setLoadingProd(false);
    }
  };

  fetchProducts();
}, [filters, page]);

  // bấm tìm kiếm
  const applyFilters = () => {
  console.log("🔍 Apply filters:", filterDraft); // log filterDraft
  setFilters({ ...filterDraft });
  setPage(1);
};

  // reset
  const resetFilters = () => {
    const defaultFilters = {
      keyword: "",
      categoryId: null,
      priceRange: [0, 1000000],
      discountRange: [0, 100],
    };
    setFilterDraft(defaultFilters);
    setFilters(null); // quay lại load all
    setPage(1);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      <Title level={2} style={{ marginBottom: 24, textAlign: "center" }}>
        🛍️ Danh sách sản phẩm
      </Title>

      <Row gutter={24}>
        {/* Bộ lọc */}
        <Col xs={24} sm={6} md={5} lg={4}>
          <Card
            title="Bộ lọc sản phẩm"
            size="small"
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Keyword */}
            <Text strong>Tìm kiếm</Text>
            <Input
              placeholder="Tên sản phẩm..."
              value={filterDraft.keyword}
              onChange={(e) =>
                setFilterDraft({ ...filterDraft, keyword: e.target.value })
              }
              style={{ marginBottom: 16 }}
            />

            {/* Category */}
            <Text strong>Danh mục</Text>
            <Select
              value={filterDraft.categoryId || undefined}
              onChange={(v) =>
                setFilterDraft({ ...filterDraft, categoryId: v || null })
              }
              style={{ width: "100%", marginBottom: 16 }}
              allowClear
              placeholder="Chọn danh mục"
              loading={loadingCat}
            >
              {categories.map((cat) => (
                <Option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>

            {/* Price */}
            <Text strong>Khoảng giá</Text>
            <Slider
              range
              min={0}
              max={1000000}
              step={10000}
              value={filterDraft.priceRange}
              onChange={(v) =>
                setFilterDraft({ ...filterDraft, priceRange: v })
              }
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">
                {filterDraft.priceRange[0].toLocaleString()}đ
              </Text>
              <Text type="secondary">
                {filterDraft.priceRange[1].toLocaleString()}đ
              </Text>
            </div>

            {/* Discount */}
            <Text strong style={{ marginTop: 16, display: "block" }}>
              Discount (%)
            </Text>
            <Slider
              range
              min={0}
              max={100}
              step={1}
              value={filterDraft.discountRange}
              onChange={(v) =>
                setFilterDraft({ ...filterDraft, discountRange: v })
              }
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text type="secondary">{filterDraft.discountRange[0]}%</Text>
              <Text type="secondary">{filterDraft.discountRange[1]}%</Text>
            </div>

            {/* Buttons */}
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <Button type="primary" onClick={applyFilters}>
                Tìm kiếm
              </Button>
              <Button
                type="link"
                onClick={resetFilters}
                style={{ marginLeft: 8 }}
              >
                Đặt lại
              </Button>
            </div>
          </Card>
        </Col>

        {/* Products */}
        <Col xs={24} sm={18} md={19} lg={20}>
          <Spin spinning={loadingProd}>
            {products.length > 0 ? (
              <>
                <Row gutter={[20, 20]}>
                  {products.map((prod) => (
                    <Col key={prod.id || prod._id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 12,
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          height: "100%",
                        }}
                        cover={
                          prod.images?.length > 0 ? (
                            <img
                              alt={prod.name}
                              src={prod.images[0]}
                              style={{
                                height: 220,
                                objectFit: "cover",
                                borderBottom: "1px solid #f0f0f0",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                height: 220,
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
                          title={
                            <Text strong ellipsis>
                              {prod.name}
                            </Text>
                          }
                          description={
                            <>
                              <Text strong style={{ color: "#1890ff" }}>
                                {prod.price?.toLocaleString()}đ
                              </Text>
                              {prod.discount !== undefined &&
                                prod.discount > 0 && (
                                  <div style={{ color: "#f5222d" }}>
                                    Giảm: {prod.discount}%
                                  </div>
                                )}
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
