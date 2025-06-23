import React, { useEffect } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import History from "./pages/History";
import FocusMode from "./pages/FocusMode";

const { Content } = Layout;

const App = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user_id");
    if (!storedUser) {
      const input = prompt("Enter your name or alias:");
      if (input) {
        localStorage.setItem("user_id", input.trim().toLowerCase());
      }
    }
  }, []);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Content style={{ margin: "24px 16px 0", padding: 24 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkin" element={<CheckIn />} />
              <Route path="/history" element={<History />} />
              <Route path="/focus" element={<FocusMode />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
