import React, { useEffect, useState } from "react";
import "./resultsPanel.css";

/**
 * Affiche les rÃƒÆ’Ã‚Â©sultats des mesures, infos ou actions utilisateurs
 * ÃƒÆ’Ã¢â‚¬Â°coute l'ÃƒÆ’Ã‚Â©vÃƒÆ’Ã‚Â©nement 'joman-result'
 */

export default function ResultsPanel() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleResult = (e) => {
      const msg = e.detail.message;
      setMessages((prev) => [...prev, msg]);
    };
    window.addEventListener("joman-result", handleResult);

    return () => {
      window.removeEventListener("joman-result", handleResult);
    };
  }, []);

  return (
    <div className="joman-results-panel">
      {messages.map((m, idx) => (
        <div key={idx} className="joman-result-msg">{m}</div>
      ))}
    </div>
  );
}
