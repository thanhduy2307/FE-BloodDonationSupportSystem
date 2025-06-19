import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Dropdown, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard-staff/${key}`}> {label} </Link>,
  };
}

const items = [
  getItem("User", "member-staff", <UserOutlined />),
  getItem("Feedback", "feedback-staff", <DesktopOutlined />),
  getItem("Request", "request", < DesktopOutlined />),
  getItem("donationEvent", "donation-event", < DesktopOutlined />),
];

const DashboardStaff = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const userSelect = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
            <div className="flex items-center gap-3 cursor-pointer">
              <span className="text-base font-semibold text-gray-800">
                {userSelect?.name || "Người dùng"}
              </span>
              <img
                src={userSelect?.avatar || "https://i.pravatar.cc/100"}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-red-400 shadow object-cover"
              />
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: "0 16px", position: "relative" }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[{ title: "User" }, { title: "Bill" }]}
          />
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* Nội dung con ở đây */}
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardStaff;
