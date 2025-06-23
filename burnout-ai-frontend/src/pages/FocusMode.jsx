import React, { useState, useEffect, useRef } from "react";
import { Typography, Button, Space } from "antd";

const { Title } = Typography;

const FocusMode = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60); 
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <Title level={2}>⏱️ Focus Mode</Title>
      <Title level={1}>{formatTime(secondsLeft)}</Title>
      <Space>
        <Button type="primary" onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </Space>
    </div>
  );
};

export default FocusMode;
