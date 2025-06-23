import React, { useEffect, useState } from "react";
import { Typography, Table, Spin, message } from "antd";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import axios from "axios";
import dayjs from "dayjs";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip);

const { Title: AntTitle } = Typography;

const History = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const userId = localStorage.getItem("user_id") || "demo";
      try {
        const res = await axios.get("http://localhost:8000/mood_entries", {
          params: { user_id: userId }
        }); 
        setData(res.data.reverse());
      } catch (error) {
        message.error("Failed to load mood history.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const getSmoothedScores = (scores, windowSize = 3) => {
    const result = [];
    for (let i = 0; i < scores.length; i++) {
      const window = scores.slice(Math.max(0, i - windowSize + 1), i + 1);
      const avg = window.reduce((a, b) => a + b, 0) / window.length;
      result.push(avg);
    }
    return result;
  };

  const timestamps = data.map(d => dayjs(d.timestamp).format("MMM D"));
  const scores = data.map(d => d.burnout_score);
  const smoothed = getSmoothedScores(scores);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: "Burnout Score",
        data: smoothed,
        fill: false,
        borderColor: "#4CAF50",
        tension: 0.3,
      },
    ],
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Journal",
      dataIndex: "journal_text",
      key: "journal_text",
    },
    {
      title: "Burnout Score",
      dataIndex: "burnout_score",
      key: "burnout_score",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <AntTitle level={3}>📊 Burnout History</AntTitle>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Line data={chartData} />
          <div style={{ marginTop: 40 }}>
            <AntTitle level={4}>📝 Journal Entries</AntTitle>
            <Table columns={columns} dataSource={data} rowKey="_id" pagination={{ pageSize: 5 }} />
          </div>
        </>
      )}
    </div>
  );
};

export default History;
