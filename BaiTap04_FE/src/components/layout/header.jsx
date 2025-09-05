import { useContext, useState } from "react";
import {
    UsergroupAddOutlined,
    HomeOutlined,
    SettingOutlined,
    ShoppingOutlined, // icon cho product
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const [current, setCurrent] = useState("home");

    const displayName = auth?.user?.name || auth?.user?.email || "User";

    const getUserMenu = () => {
        if (auth.isAuthenticated) {
            return [
                {
                    label: (
                        <span
                            onClick={() => {
                                localStorage.removeItem("access_token");
                                setCurrent("home");
                                setAuth({
                                    isAuthenticated: false,
                                    user: { email: "", name: "" }
                                });
                                navigate("/");
                            }}
                        >
                            Đăng xuất
                        </span>
                    ),
                    key: "logout",
                },
            ];
        }
        return [
            {
                label: <Link to={"/login"}>Đăng nhập</Link>,
                key: "login",
            },
        ];
    };

    const items = [
        {
            label: <Link to={"/"}>Home Page</Link>,
            key: "home",
            icon: <HomeOutlined />,
        },
        {
            label: <Link to={"/product"}>Products</Link>,
            key: "product",
            icon: <ShoppingOutlined />,
        },
        ...(auth.isAuthenticated
            ? [
                {
                    label: <Link to={"/user"}>Users</Link>,
                    key: "user",
                    icon: <UsergroupAddOutlined />,
                },
            ]
            : []),
        {
            label: auth.isAuthenticated ? `Welcome ${displayName}` : "Welcome Guest",
            key: "SubMenu",
            icon: <SettingOutlined />,
            children: getUserMenu(),
        },
    ];

    const onClick = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};

export default Header;
