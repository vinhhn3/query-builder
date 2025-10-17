import "./App.css";
import DndContextProvider from "./components/DndContext";
import QueryBuilder from "./components/QueryBuilder";
import SQLOutput from "./components/SQLOutput";
import TableList from "./components/TableList";

function App() {
  return (
    <DndContextProvider>
      <div style={styles.container}>
        <TableList />
        <QueryBuilder />
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
};

export default App;
