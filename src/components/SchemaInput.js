import { useState } from "react";
import useQueryStore from "../store/queryStore";

const SchemaInput = () => {
  const [schemaText, setSchemaText] = useState("");
  const setSchema = useQueryStore((state) => state.setSchema);
  const schema = useQueryStore((state) => state.schema);

  const handleParse = () => {
    if (schemaText.trim()) {
      setSchema(schemaText);
    }
  };

  const exampleSchema = `CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending',
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);`;

  const loadExample = () => {
    setSchemaText(exampleSchema);
    setSchema(exampleSchema);
  };

  const handleReset = () => {
    setSchemaText("");
    setSchema(null);
    setIsExpanded(true);
  };

  const [isExpanded, setIsExpanded] = useState(!schema);

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.headerContent}>
          <span style={styles.headerIcon}>{isExpanded ? "▼" : "▶"}</span>
          <span style={styles.headerTitle}>Schema Input</span>
        </div>
        {schema && <span style={styles.badge}>✓ Loaded</span>}
      </div>

      {isExpanded && (
        <div style={styles.content}>
          <textarea
            style={styles.textarea}
            value={schemaText}
            onChange={(e) => setSchemaText(e.target.value)}
            placeholder="Paste CREATE TABLE statements here..."
            rows={10}
          />

          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={handleParse}>
              {schema ? "Update" : "Parse"}
            </button>
            <button style={styles.secondaryButton} onClick={loadExample}>
              Example
            </button>
            {schema && (
              <button style={styles.dangerButton} onClick={handleReset}>
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    borderBottom: "1px solid #dee2e6",
    backgroundColor: "white",
  },
  header: {
    padding: "12px 16px",
    backgroundColor: "#f8f9fa",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    userSelect: "none",
    borderBottom: "1px solid #dee2e6",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  headerIcon: {
    fontSize: "12px",
    color: "#6c757d",
  },
  headerTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  badge: {
    padding: "2px 8px",
    fontSize: "11px",
    backgroundColor: "#28a745",
    color: "white",
    borderRadius: "12px",
    fontWeight: "500",
  },
  content: {
    padding: "16px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #dee2e6",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "monospace",
    marginBottom: "12px",
    resize: "vertical",
    boxSizing: "border-box",
    lineHeight: "1.4",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
    flex: 1,
  },
  secondaryButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
    flex: 1,
  },
  dangerButton: {
    padding: "8px 16px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default SchemaInput;
