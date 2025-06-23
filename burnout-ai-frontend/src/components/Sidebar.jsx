import React from "react";
import { Layout, Menu } from "antd";
import {
  EditOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo" style={{ color: "white", padding: 16, fontSize: 18 }}>
        WellDone.AI
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["/"]}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="/checkin" icon={<EditOutlined />}>
          <Link to="/checkin">Daily Check-In</Link>
        </Menu.Item>
        <Menu.Item key="/history" icon={<HistoryOutlined />}>
          <Link to="/history">Mood History</Link>
        </Menu.Item>
        <Menu.Item key="/focus" icon={<ClockCircleOutlined />}>
          <Link to="/focus">Focus Mode</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
