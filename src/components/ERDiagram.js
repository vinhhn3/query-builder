import { useEffect, useRef, useState } from "react";
import useQueryStore from "../store/queryStore";

const ERDiagram = () => {
  const tables = useQueryStore((state) => state.tables);
  const schema = useQueryStore((state) => state.schema);
  const [relationships, setRelationships] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggingTable, setDraggingTable] = useState(null);
  const [tablePositions, setTablePositions] = useState({});

  // Parse foreign key relationships from schema
  useEffect(() => {
    if (!schema) return;

    const rels = [];
    const foreignKeyRegex =
      /FOREIGN\s+KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/gi;
    const lines = schema.split("\n");
    let currentTable = null;

    lines.forEach((line) => {
      const tableMatch = line.match(/CREATE\s+TABLE\s+(\w+)/i);
      if (tableMatch) {
        currentTable = tableMatch[1];
      }

      if (currentTable) {
        let match;
        while ((match = foreignKeyRegex.exec(line)) !== null) {
          rels.push({
            fromTable: currentTable,
            fromColumn: match[1],
            toTable: match[2],
            toColumn: match[3],
          });
        }
      }
    });

    setRelationships(rels);
  }, [schema]);

  // Initialize table positions in a grid layout
  useEffect(() => {
    if (tables.length === 0) return;

    setTablePositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      tables.forEach((table, index) => {
        if (!newPositions[table.name]) {
          const cols = Math.ceil(Math.sqrt(tables.length));
          const row = Math.floor(index / cols);
          const col = index % cols;
          const spacing = 300;
          const startX = 50;
          const startY = 50;

          newPositions[table.name] = {
            x: startX + col * spacing,
            y: startY + row * spacing,
          };
        }
      });
      return newPositions;
    });
  }, [tables]);

  // Get table position (from custom positions or default grid)
  const getTablePosition = (tableName) => {
    return tablePositions[tableName] || { x: 0, y: 0 };
  };

  // Handle mouse wheel for zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.3, Math.min(2, prev * delta)));
  };

  // Handle canvas pan
  const handleMouseDown = (e) => {
    if (e.target.tagName === "svg") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !draggingTable) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingTable) {
      // Calculate mouse position in SVG coordinates
      const svgRect = canvasRef.current.getBoundingClientRect();
      const svgX = (e.clientX - svgRect.left - pan.x) / zoom;
      const svgY = (e.clientY - svgRect.top - pan.y) / zoom;

      setTablePositions((prev) => ({
        ...prev,
        [draggingTable]: {
          x: svgX - dragStart.offsetX,
          y: svgY - dragStart.offsetY,
        },
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingTable(null);
  };

  // Handle table drag start
  const handleTableMouseDown = (e, tableName) => {
    e.stopPropagation();
    const pos = getTablePosition(tableName);

    // Calculate mouse position in SVG coordinates
    const svgRect = canvasRef.current.getBoundingClientRect();
    const svgX = (e.clientX - svgRect.left - pan.x) / zoom;
    const svgY = (e.clientY - svgRect.top - pan.y) / zoom;

    setDraggingTable(tableName);
    setDragStart({
      offsetX: svgX - pos.x,
      offsetY: svgY - pos.y,
    });
  };

  // Export as SVG
  const exportAsSVG = () => {
    if (!canvasRef.current) return;

    const svgData = canvasRef.current.outerHTML;
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "erd-diagram.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Draw relationship line
  const drawRelationship = (rel) => {
    const fromTable = tables.find((t) => t.name === rel.fromTable);
    const toTable = tables.find((t) => t.name === rel.toTable);

    if (!fromTable || !toTable) return null;

    const fromPos = getTablePosition(rel.fromTable);
    const toPos = getTablePosition(rel.toTable);

    const fromTableHeight = 30 + fromTable.columns.length * 25;

    const fromX = fromPos.x + 125; // Half of table width
    const fromY = fromPos.y + fromTableHeight; // Bottom of table
    const toX = toPos.x + 125;
    const toY = toPos.y; // Top of table

    // Create curved path
    const midY = (fromY + toY) / 2;

    return (
      <g key={`${rel.fromTable}-${rel.toTable}-${rel.fromColumn}`}>
        <path
          d={`M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`}
          stroke="#6c757d"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          style={{ transition: "all 0.3s ease" }}
        />
        <text
          x={(fromX + toX) / 2}
          y={midY - 5}
          fontSize="11"
          fill="#6c757d"
          textAnchor="middle"
          style={{ pointerEvents: "none" }}
        >
          {rel.fromColumn} → {rel.toColumn}
        </text>
      </g>
    );
  };

  if (!schema) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyContent}>
          <span style={styles.emptyIcon}>📊</span>
          <h3 style={styles.emptyTitle}>No Schema Loaded</h3>
          <p style={styles.emptyText}>Load a schema to view the ERD</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Entity Relationship Diagram</h3>
        <div style={styles.controls}>
          <span style={styles.zoomLabel}>Zoom: {Math.round(zoom * 100)}%</span>
          <button
            style={styles.controlButton}
            onClick={() => setZoom((prev) => Math.min(2, prev + 0.1))}
            title="Zoom In"
          >
            🔍+
          </button>
          <button
            style={styles.controlButton}
            onClick={() => setZoom((prev) => Math.max(0.3, prev - 0.1))}
            title="Zoom Out"
          >
            🔍-
          </button>
          <button
            style={styles.controlButton}
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            title="Reset View"
          >
            🔄 Reset View
          </button>
          <button
            style={styles.controlButton}
            onClick={() => {
              setTablePositions({});
            }}
            title="Reset Table Positions"
          >
            ↺ Reset Layout
          </button>
          <button
            style={styles.exportButton}
            onClick={() => exportAsSVG()}
            title="Export as SVG"
          >
            💾 Export
          </button>
        </div>
      </div>

      <div
        style={styles.canvas}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            cursor:
              isDragging && !draggingTable
                ? "grabbing"
                : draggingTable
                ? "grabbing"
                : "grab",
          }}
          viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${1000 / zoom} ${
            600 / zoom
          }`}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#6c757d" />
            </marker>
          </defs>

          {/* Draw relationships first (so they appear behind tables) */}
          {relationships.map((rel) => drawRelationship(rel))}

          {/* Draw tables */}
          {tables.map((table) => {
            const pos = getTablePosition(table.name);
            const isSelected = selectedTable === table.name;
            const isBeingDragged = draggingTable === table.name;

            return (
              <g
                key={table.name}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={(e) => handleTableMouseDown(e, table.name)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTable(isSelected ? null : table.name);
                }}
                style={{
                  cursor: isBeingDragged ? "grabbing" : "move",
                  opacity: isBeingDragged ? 0.7 : 1,
                }}
              >
                {/* Table shadow */}
                <rect
                  x="2"
                  y="2"
                  width="250"
                  height={30 + table.columns.length * 25}
                  fill="rgba(0,0,0,0.1)"
                  rx="4"
                />

                {/* Table container */}
                <rect
                  x="0"
                  y="0"
                  width="250"
                  height={30 + table.columns.length * 25}
                  fill="white"
                  stroke={isSelected ? "#007bff" : "#dee2e6"}
                  strokeWidth={isSelected ? "3" : "1"}
                  rx="4"
                />

                {/* Table header */}
                <rect
                  x="0"
                  y="0"
                  width="250"
                  height="30"
                  fill="#007bff"
                  rx="4"
                />
                <rect x="0" y="15" width="250" height="15" fill="#007bff" />

                <text
                  x="125"
                  y="20"
                  fontSize="14"
                  fontWeight="bold"
                  fill="white"
                  textAnchor="middle"
                >
                  {table.name}
                </text>

                {/* Columns */}
                {table.columns.map((column, colIndex) => (
                  <g key={column.name}>
                    <rect
                      x="0"
                      y={30 + colIndex * 25}
                      width="250"
                      height="25"
                      fill={column.isPrimaryKey ? "#fff3cd" : "white"}
                    />
                    <text
                      x="10"
                      y={30 + colIndex * 25 + 17}
                      fontSize="12"
                      fill="#333"
                    >
                      {column.isPrimaryKey && "🔑 "}
                      {column.name}
                    </text>
                    <text
                      x="240"
                      y={30 + colIndex * 25 + 17}
                      fontSize="10"
                      fill="#6c757d"
                      textAnchor="end"
                    >
                      {column.type.substring(0, 15)}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div style={styles.footer}>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendBox, backgroundColor: "#fff3cd" }} />
            <span style={styles.legendText}>Primary Key</span>
          </div>
          <div style={styles.legendItem}>
            <div style={styles.legendLine} />
            <span style={styles.legendText}>Foreign Key Relationship</span>
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendText}>
              {tables.length} Tables • {relationships.length} Relationships
            </span>
          </div>
          <div style={styles.legendItem}>
            <span style={styles.legendText}>💡 Drag tables to rearrange</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "white",
  },
  emptyContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    backgroundColor: "#f8f9fa",
  },
  emptyContent: {
    textAlign: "center",
    padding: "40px",
  },
  emptyIcon: {
    fontSize: "64px",
    display: "block",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6c757d",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  controls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  zoomLabel: {
    fontSize: "12px",
    color: "#6c757d",
    fontWeight: "500",
    marginRight: "8px",
  },
  controlButton: {
    padding: "6px 12px",
    fontSize: "12px",
    backgroundColor: "white",
    color: "#333",
    border: "1px solid #dee2e6",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  exportButton: {
    padding: "6px 12px",
    fontSize: "12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
  canvas: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#fafafa",
    position: "relative",
  },
  footer: {
    padding: "12px 16px",
    borderTop: "1px solid #dee2e6",
    backgroundColor: "#f8f9fa",
  },
  legend: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  legendBox: {
    width: "20px",
    height: "14px",
    border: "1px solid #dee2e6",
    borderRadius: "2px",
  },
  legendLine: {
    width: "30px",
    height: "2px",
    backgroundColor: "#6c757d",
    position: "relative",
  },
  legendText: {
    fontSize: "12px",
    color: "#6c757d",
  },
};

export default ERDiagram;
