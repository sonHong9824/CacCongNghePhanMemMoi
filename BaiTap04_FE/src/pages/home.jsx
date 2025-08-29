import { CrownOutlined } from "@ant-design/icons";
import { Result } from "antd";

const HomePage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Result
                icon={<CrownOutlined style={{ color: "#108ee9" }} />}
                title="Welcome to the Home Page"
                subTitle="This is the home page of our application."
            />
        </div>
    );
}
export default HomePage