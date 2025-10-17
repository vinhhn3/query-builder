import { useState } from "react";
import useQueryStore from "../store/queryStore";
import { generateSQL } from "../utils/sqlGenerator";

const SQLOutput = () => {
  const queryState = useQueryStore();
  const [copied, setCopied] = useState(false);

  const sql = generateSQL(queryState);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([sql], { type: "text/sql" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Generated SQL</h3>
        <div style={styles.actions}>
          <button style={styles.button} onClick={handleCopy}>
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
          <button style={styles.button} onClick={handleExport}>
            💾 Export
          </button>
        </div>
      </div>
      <pre style={styles.sqlOutput}>
        <code>{sql}</code>
      </pre>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    height: "100vh",
    backgroundColor: "#1e1e1e",
    borderLeft: "1px solid #333",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid #333",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#fff",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  button: {
    padding: "6px 12px",
    fontSize: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  sqlOutput: {
    flex: 1,
    padding: "16px",
    margin: 0,
    overflow: "auto",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#d4d4d4",
    fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

export default SQLOutput;
