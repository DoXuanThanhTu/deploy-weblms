import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

const COLORS = {
  info: "#2196f3",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
};

const NotificationWrapper = styled.div`
  background: #fff;
  color: #333;
  padding: 14px 20px;
  border-radius: 8px;
  width: 320px;
  margin-bottom: 12px;
  z-index: 9999;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  font-family: sans-serif;
  position: fixed;
  top: 20px;
  right: 10px;
  border-left: 6px solid ${({ type }) => COLORS[type] || COLORS.info};
`;

const Message = styled.div`
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 5px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  ${({ type }) => css`
    background: ${COLORS[type] || COLORS.info};
  `}
  width: ${({ progress }) => progress}%;
  transition: width 50ms linear;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 10px;
  top: 8px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #888;
`;

const NotificationWithProgressBar = ({
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      setProgress(100 - (currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        if (onClose) onClose();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <NotificationWrapper type={type}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <Message>{message}</Message>
      <ProgressBar>
        <Progress progress={progress} type={type} />
      </ProgressBar>
    </NotificationWrapper>
  );
};

export default NotificationWithProgressBar;
