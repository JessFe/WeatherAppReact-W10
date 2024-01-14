import React, { useState } from "react";

function CollapsibleText({ triggerText, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // stile normal / hover
  const normalStyle = {
    cursor: "pointer",
  };

  const hoverStyle = {
    ...normalStyle,
    color: "#333",
    fontWeight: "bold",
  };

  return (
    <div className="text-center w-100" onClick={toggleVisibility} style={{ cursor: "pointer" }}>
      <span
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={isHovered ? hoverStyle : normalStyle}
      >
        {triggerText}
      </span>

      {isVisible && <div>{children}</div>}
    </div>
  );
}

export { CollapsibleText };
