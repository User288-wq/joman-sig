import React from "react";
import "./MenuBar.css";

export default function MenuBar({ activeTab, setActiveTab }) {
  return (
    <div className="menu-bar">
      <button onClick={() => setActiveTab("file")}>File</button>
      <button onClick={() => setActiveTab("edit")}>Edit</button>
      <button onClick={() => setActiveTab("view")}>View</button>
      <button onClick={() => setActiveTab("tools")}>Tools</button>
      <button onClick={() => setActiveTab("help")}>Help</button>
    </div>
  );
}
