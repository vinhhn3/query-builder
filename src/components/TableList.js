import { useDraggable } from "@dnd-kit/core";
import { useState } from "react";
import useQueryStore from "../store/queryStore";
import SchemaInput from "./SchemaInput";

const DraggableTable = ({ table }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `table-${table.name}`,
    data: { type: "table", table: table.name },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const [expanded, setExpanded] = useState(false);

  return (
    <div style={styles.tableCard}>
      <div
        ref={setNodeRef}
        style={{ ...styles.tableHeader, ...style }}
        {...listeners}
        {...attributes}
      >
        <div style={styles.tableTitle}>
          <span style={styles.dragHandle}>⋮⋮</span>
          <span>{table.name}</span>
        </div>
        <button
          style={styles.expandButton}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "▼" : "▶"}
        </button>
      </div>

      {expanded && (
        <div style={styles.columnList}>
          {table.columns.map((column) => (
            <DraggableColumn
              key={column.name}
              table={table.name}
              column={column}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DraggableColumn = ({ table, column }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `column-${table}-${column.name}`,
    data: { type: "column", table, column: column.name },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...styles.columnItem, ...style }}
      {...listeners}
      {...attributes}
    >
      <span style={styles.dragHandle}>⋮⋮</span>
      <span style={styles.columnName}>{column.name}</span>
      <span style={styles.columnType}>{column.type}</span>
      {column.isPrimaryKey && <span style={styles.badge}>PK</span>}
    </div>
  );
};

const TableList = () => {
  const tables = useQueryStore((state) => state.tables);
  const schema = useQueryStore((state) => state.schema);

  return (
    <div style={styles.container}>
      <SchemaInput />

      {schema && (
        <>
          <div style={styles.tableList}>
            {tables.length > 0 ? (
              tables.map((table) => (
                <DraggableTable key={table.name} table={table} />
              ))
            ) : (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No tables found in schema</p>
              </div>
            )}
          </div>

          <div style={styles.hint}>
            <p style={styles.hintText}>
              💡 Drag tables and columns to the canvas
            </p>
          </div>
        </>
      )}

      {!schema && (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>
            � Load a schema to start building queries
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "280px",
    height: "100vh",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #dee2e6",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tableList: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  emptyText: {
    margin: 0,
    fontSize: "14px",
    color: "#6c757d",
    textAlign: "center",
  },
  tableCard: {
    backgroundColor: "white",
    borderRadius: "6px",
    marginBottom: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "grab",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    userSelect: "none",
  },
  tableTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "500",
  },
  dragHandle: {
    cursor: "grab",
    opacity: 0.7,
  },
  expandButton: {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
    padding: "4px",
  },
  columnList: {
    padding: "8px",
  },
  columnItem: {
    padding: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    marginBottom: "4px",
    cursor: "grab",
    fontSize: "13px",
    userSelect: "none",
  },
  columnName: {
    flex: 1,
    fontWeight: "500",
    color: "#333",
  },
  columnType: {
    fontSize: "11px",
    color: "#6c757d",
  },
  badge: {
    padding: "2px 6px",
    fontSize: "10px",
    backgroundColor: "#ffc107",
    color: "#000",
    borderRadius: "3px",
    fontWeight: "bold",
  },
  hint: {
    padding: "16px",
    borderTop: "1px solid #dee2e6",
    backgroundColor: "#e7f3ff",
  },
  hintText: {
    margin: 0,
    fontSize: "13px",
    color: "#0066cc",
  },
};

export default TableList;
