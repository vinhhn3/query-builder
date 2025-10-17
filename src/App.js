import { useState } from "react";
import "./App.css";
import DndContextProvider from "./components/DndContext";
import ERDiagram from "./components/ERDiagram";
import QueryBuilder from "./components/QueryBuilder";
import SQLOutput from "./components/SQLOutput";
import TableList from "./components/TableList";

function App() {
  const [activeView, setActiveView] = useState("builder"); // "builder" or "erd"

  return (
    <DndContextProvider>
      <div style={styles.container}>
        <TableList />

        <div style={styles.mainContent}>
          <div style={styles.tabBar}>
            <button
              style={{
                ...styles.tab,
                ...(activeView === "builder" ? styles.activeTab : {}),
              }}
              onClick={() => setActiveView("builder")}
            >
              🔧 Query Builder
            </button>
            <button
              style={{
                ...styles.tab,
                ...(activeView === "erd" ? styles.activeTab : {}),
              }}
              onClick={() => setActiveView("erd")}
            >
              📊 ERD Diagram
            </button>
          </div>

          <div style={styles.viewContainer}>
            {activeView === "builder" ? <QueryBuilder /> : <ERDiagram />}
          </div>
        </div>

        <SQLOutput />
      </div>
    </DndContextProvider>
  );
}

const styles = {
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  tabBar: {
    display: "flex",
    borderBottom: "2px solid #dee2e6",
    backgroundColor: "#f8f9fa",
  },
  tab: {
    padding: "12px 24px",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6c757d",
    transition: "all 0.2s",
  },
  activeTab: {
    color: "#007bff",
    borderBottomColor: "#007bff",
    backgroundColor: "white",
  },
  viewContainer: {
    flex: 1,
    overflow: "hidden",
  },
};

export default App;
