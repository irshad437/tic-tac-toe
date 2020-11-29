import React from "react";

const Popup = ({ title, onClick }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "wheat",
        top: "0px",
        left: "0px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontSize: "3em",
          color: "#5f5f5f",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        x
      </span>
      <h1>{title}</h1>
    </div>
  );
};

export default Popup;
