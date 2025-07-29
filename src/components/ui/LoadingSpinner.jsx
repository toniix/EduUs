import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <span
        className="relative flex h-20 w-20"
      >
        <span
          className="absolute inset-0 rounded-full animate-spin shadow-lg"
          style={{
            borderTop: "4px solid #ED441D",      // primary
            borderRight: "4px solid #4BBAAA",    // secondary
            borderBottom: "4px solid #F4B63B",   // accent
            borderLeft: "4px solid #FFFFFF",     // light
            borderRadius: "50%",
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            boxShadow: "0 4px 24px 0 rgba(237,68,29,0.10)",
            background: "transparent"
          }}
        ></span>
        {/* Centro para logo o icono opcional */}
        <span className="absolute inset-3 bg-white rounded-full"></span>
      </span>
    </div>
  );
};

export default LoadingSpinner;
