import React from "react";

const Uploading = ({ text }) => {
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          zIndex: 9999,
          cursor: "not-allowed",
        }}
      >
        <div>
          <div
            className="spinner"
            style={{
              width: "50px",
              height: "50px",
              border: "6px solid #fff",
              borderTop: "6px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ marginLeft: "-22px", marginTop: "10px" }}>{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Uploading;
