import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import useQueryStore from "../store/queryStore";

const DndContextProvider = ({ children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const addSelectedField = useQueryStore((state) => state.addSelectedField);
  const addFromTable = useQueryStore((state) => state.addFromTable);
  const addJoin = useQueryStore((state) => state.addJoin);
  const addWhereCondition = useQueryStore((state) => state.addWhereCondition);
  const addGroupBy = useQueryStore((state) => state.addGroupBy);
  const addOrderBy = useQueryStore((state) => state.addOrderBy);
  const setInsertTable = useQueryStore((state) => state.setInsertTable);
  const addInsertField = useQueryStore((state) => state.addInsertField);
  const setUpdateTable = useQueryStore((state) => state.setUpdateTable);
  const addSetField = useQueryStore((state) => state.addSetField);
  const setDeleteTable = useQueryStore((state) => state.setDeleteTable);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const dragData = active.data.current;
    const dropData = over.data.current;

    if (!dragData || !dropData) return;

    const { type: dragType } = dragData;
    const { type: dropType } = dropData;

    // Handle table drops
    if (dragType === "table") {
      const tableName = dragData.table;

      if (dropType === "from") {
        addFromTable({ table: tableName, alias: null });
      } else if (dropType === "join") {
        addJoin({
          type: "INNER",
          table: tableName,
          alias: null,
          condition: "",
        });
      } else if (dropType === "insert-table") {
        setInsertTable(tableName);
      } else if (dropType === "update-table") {
        setUpdateTable(tableName);
      } else if (dropType === "delete-table") {
        setDeleteTable(tableName);
      }
    }

    // Handle column drops
    if (dragType === "column") {
      const { table, column } = dragData;

      if (dropType === "select") {
        addSelectedField({ table, column, alias: null, function: null });
      } else if (dropType === "where") {
        addWhereCondition({
          field: `${table}.${column}`,
          operator: "=",
          value: "",
          logic: "AND",
          not: false,
        });
      } else if (dropType === "groupby") {
        addGroupBy({ table, column });
      } else if (dropType === "orderby") {
        addOrderBy({ table, column, direction: "ASC" });
      } else if (dropType === "insert-field") {
        addInsertField({ column, value: "" });
      } else if (dropType === "update-field") {
        addSetField({ column, value: "" });
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        <div style={styles.dragOverlay}>Dragging...</div>
      </DragOverlay>
    </DndContext>
  );
};

const styles = {
  dragOverlay: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "4px",
    fontSize: "13px",
    fontWeight: "500",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
};

export default DndContextProvider;
