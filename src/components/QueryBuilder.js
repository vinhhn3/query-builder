import { useDroppable } from "@dnd-kit/core";
import useQueryStore from "../store/queryStore";

const QueryBuilder = () => {
  const queryType = useQueryStore((state) => state.queryType);
  const setQueryType = useQueryStore((state) => state.setQueryType);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Query Builder</h3>
        <div style={styles.queryTypeSelector}>
          {["SELECT"].map((type) => (
            <button
              key={type}
              style={{
                ...styles.typeButton,
                ...(queryType === type ? styles.typeButtonActive : {}),
              }}
              onClick={() => setQueryType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.builderArea}>
        {queryType === "SELECT" && <SelectBuilder />}
        {/* {queryType === "INSERT" && <InsertBuilder />} */}
        {/* {queryType === "UPDATE" && <UpdateBuilder />} */}
        {/* {queryType === "DELETE" && <DeleteBuilder />} */}
      </div>
    </div>
  );
};

const SelectBuilder = () => {
  const selectedFields = useQueryStore((state) => state.selectedFields);
  const fromTables = useQueryStore((state) => state.fromTables);
  const joins = useQueryStore((state) => state.joins);
  const whereConditions = useQueryStore((state) => state.whereConditions);
  const groupBy = useQueryStore((state) => state.groupBy);
  const orderBy = useQueryStore((state) => state.orderBy);
  const limit = useQueryStore((state) => state.limit);
  const distinct = useQueryStore((state) => state.distinct);

  const removeSelectedField = useQueryStore(
    (state) => state.removeSelectedField
  );
  const updateSelectedField = useQueryStore(
    (state) => state.updateSelectedField
  );
  const removeFromTable = useQueryStore((state) => state.removeFromTable);
  const removeJoin = useQueryStore((state) => state.removeJoin);
  const updateJoin = useQueryStore((state) => state.updateJoin);
  const removeWhereCondition = useQueryStore(
    (state) => state.removeWhereCondition
  );
  const updateWhereCondition = useQueryStore(
    (state) => state.updateWhereCondition
  );
  const removeGroupBy = useQueryStore((state) => state.removeGroupBy);
  const removeOrderBy = useQueryStore((state) => state.removeOrderBy);
  const updateOrderBy = useQueryStore((state) => state.updateOrderBy);
  const setDistinct = useQueryStore((state) => state.setDistinct);
  const setLimit = useQueryStore((state) => state.setLimit);

  return (
    <>
      <Section title="SELECT" color="#28a745">
        <div style={styles.optionRow}>
          <label style={styles.checkbox}>
            <input
              type="checkbox"
              checked={distinct}
              onChange={(e) => setDistinct(e.target.checked)}
            />
            DISTINCT
          </label>
        </div>
        <DropZone type="select" label="Drop columns here">
          {selectedFields.map((field) => (
            <EditableField
              key={field.id}
              field={field}
              onRemove={() => removeSelectedField(field.id)}
              onChange={(updates) => updateSelectedField(field.id, updates)}
            />
          ))}
        </DropZone>
      </Section>

      <Section title="FROM" color="#007bff">
        <DropZone type="from" label="Drop tables here">
          {fromTables.map((table) => (
            <TableChip
              key={table.id}
              name={table.table}
              onRemove={() => removeFromTable(table.id)}
            />
          ))}
        </DropZone>
      </Section>

      <Section title="JOIN" color="#6f42c1">
        <DropZone type="join" label="Drop tables to join">
          {joins.map((join) => (
            <JoinItem
              key={join.id}
              join={join}
              onRemove={() => removeJoin(join.id)}
              onChange={(updates) => updateJoin(join.id, updates)}
            />
          ))}
        </DropZone>
      </Section>

      <Section title="WHERE" color="#fd7e14">
        <DropZone type="where" label="Drop columns for conditions">
          {whereConditions.map((condition, index) => (
            <WhereCondition
              key={condition.id}
              condition={condition}
              showLogic={index > 0}
              onRemove={() => removeWhereCondition(condition.id)}
              onChange={(updates) =>
                updateWhereCondition(condition.id, updates)
              }
            />
          ))}
        </DropZone>
      </Section>

      <Section title="GROUP BY" color="#17a2b8">
        <DropZone type="groupby" label="Drop columns to group by">
          {groupBy.map((field) => (
            <FieldChip
              key={field.id}
              table={field.table}
              column={field.column}
              onRemove={() => removeGroupBy(field.id)}
            />
          ))}
        </DropZone>
      </Section>

      <Section title="ORDER BY" color="#dc3545">
        <DropZone type="orderby" label="Drop columns to order by">
          {orderBy.map((field) => (
            <OrderByField
              key={field.id}
              field={field}
              onRemove={() => removeOrderBy(field.id)}
              onChange={(updates) => updateOrderBy(field.id, updates)}
            />
          ))}
        </DropZone>
      </Section>

      <Section title="LIMIT" color="#6c757d">
        <input
          type="number"
          style={styles.input}
          placeholder="Enter limit..."
          value={limit || ""}
          onChange={(e) => setLimit(e.target.value)}
        />
      </Section>
    </>
  );
};

const InsertBuilder = () => {
  const insertTable = useQueryStore((state) => state.insertTable);
  const insertFields = useQueryStore((state) => state.insertFields);
  const setInsertTable = useQueryStore((state) => state.setInsertTable);
  const removeInsertField = useQueryStore((state) => state.removeInsertField);
  const updateInsertField = useQueryStore((state) => state.updateInsertField);

  return (
    <>
      <Section title="INSERT INTO" color="#28a745">
        <DropZone type="insert-table" label="Drop table here">
          {insertTable && (
            <TableChip
              name={insertTable}
              onRemove={() => setInsertTable(null)}
            />
          )}
        </DropZone>
      </Section>

      <Section title="VALUES" color="#007bff">
        <DropZone type="insert-field" label="Drop columns to insert">
          {insertFields.map((field) => (
            <InsertField
              key={field.id}
              field={field}
              onRemove={() => removeInsertField(field.id)}
              onChange={(updates) => updateInsertField(field.id, updates)}
            />
          ))}
        </DropZone>
      </Section>
    </>
  );
};

const UpdateBuilder = () => {
  const updateTable = useQueryStore((state) => state.updateTable);
  const setFields = useQueryStore((state) => state.setFields);
  const whereConditions = useQueryStore((state) => state.whereConditions);
  const setUpdateTable = useQueryStore((state) => state.setUpdateTable);
  const removeSetField = useQueryStore((state) => state.removeSetField);
  const updateSetField = useQueryStore((state) => state.updateSetField);
  const removeWhereCondition = useQueryStore(
    (state) => state.removeWhereCondition
  );
  const updateWhereCondition = useQueryStore(
    (state) => state.updateWhereCondition
  );

  return (
    <>
      <Section title="UPDATE" color="#ffc107">
        <DropZone type="update-table" label="Drop table here">
          {updateTable && (
            <TableChip
              name={updateTable}
              onRemove={() => setUpdateTable(null)}
            />
          )}
        </DropZone>
      </Section>

      <Section title="SET" color="#28a745">
        <DropZone type="update-field" label="Drop columns to update">
          {setFields.map((field) => (
            <SetField
              key={field.id}
              field={field}
              onRemove={() => removeSetField(field.id)}
              onChange={(updates) => updateSetField(field.id, updates)}
            />
          ))}
        </DropZone>
      </Section>

      <Section title="WHERE" color="#fd7e14">
        <DropZone type="where" label="Drop columns for conditions">
          {whereConditions.map((condition, index) => (
            <WhereCondition
              key={condition.id}
              condition={condition}
              showLogic={index > 0}
              onRemove={() => removeWhereCondition(condition.id)}
              onChange={(updates) =>
                updateWhereCondition(condition.id, updates)
              }
            />
          ))}
        </DropZone>
      </Section>
    </>
  );
};

const DeleteBuilder = () => {
  const deleteTable = useQueryStore((state) => state.deleteTable);
  const whereConditions = useQueryStore((state) => state.whereConditions);
  const setDeleteTable = useQueryStore((state) => state.setDeleteTable);
  const removeWhereCondition = useQueryStore(
    (state) => state.removeWhereCondition
  );
  const updateWhereCondition = useQueryStore(
    (state) => state.updateWhereCondition
  );

  return (
    <>
      <Section title="DELETE FROM" color="#dc3545">
        <DropZone type="delete-table" label="Drop table here">
          {deleteTable && (
            <TableChip
              name={deleteTable}
              onRemove={() => setDeleteTable(null)}
            />
          )}
        </DropZone>
      </Section>

      <Section title="WHERE" color="#fd7e14">
        <DropZone type="where" label="Drop columns for conditions">
          {whereConditions.map((condition, index) => (
            <WhereCondition
              key={condition.id}
              condition={condition}
              showLogic={index > 0}
              onRemove={() => removeWhereCondition(condition.id)}
              onChange={(updates) =>
                updateWhereCondition(condition.id, updates)
              }
            />
          ))}
        </DropZone>
      </Section>
    </>
  );
};

const Section = ({ title, color, children }) => (
  <div style={styles.section}>
    <div style={{ ...styles.sectionHeader, backgroundColor: color }}>
      {title}
    </div>
    <div style={styles.sectionContent}>{children}</div>
  </div>
);

const DropZone = ({ type, label, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `dropzone-${type}`,
    data: { type },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...styles.dropZone,
        ...(isOver ? styles.dropZoneActive : {}),
      }}
    >
      {children.length === 0 ? (
        <div style={styles.dropPlaceholder}>{label}</div>
      ) : (
        <div style={styles.itemList}>{children}</div>
      )}
    </div>
  );
};

const EditableField = ({ field, onRemove, onChange }) => (
  <div style={styles.editableField}>
    <span style={styles.fieldLabel}>
      {field.table}.{field.column}
    </span>
    <select
      style={styles.select}
      value={field.function || ""}
      onChange={(e) => onChange({ function: e.target.value || null })}
    >
      <option value="">No Function</option>
      <option value="COUNT">COUNT</option>
      <option value="SUM">SUM</option>
      <option value="AVG">AVG</option>
      <option value="MAX">MAX</option>
      <option value="MIN">MIN</option>
    </select>
    <input
      type="text"
      style={styles.input}
      placeholder="Alias..."
      value={field.alias || ""}
      onChange={(e) => onChange({ alias: e.target.value })}
    />
    <button style={styles.removeButton} onClick={onRemove}>
      ×
    </button>
  </div>
);

const TableChip = ({ name, onRemove }) => (
  <div style={styles.chip}>
    <span>{name}</span>
    <button style={styles.chipRemove} onClick={onRemove}>
      ×
    </button>
  </div>
);

const FieldChip = ({ table, column, onRemove }) => (
  <div style={styles.chip}>
    <span>
      {table}.{column}
    </span>
    <button style={styles.chipRemove} onClick={onRemove}>
      ×
    </button>
  </div>
);

const JoinItem = ({ join, onRemove, onChange }) => (
  <div style={styles.editableField}>
    <select
      style={styles.select}
      value={join.type || "INNER"}
      onChange={(e) => onChange({ type: e.target.value })}
    >
      <option value="INNER">INNER</option>
      <option value="LEFT">LEFT</option>
      <option value="RIGHT">RIGHT</option>
      <option value="FULL">FULL</option>
      <option value="CROSS">CROSS</option>
    </select>
    <span style={styles.fieldLabel}>{join.table}</span>
    <input
      type="text"
      style={{ ...styles.input, flex: 2 }}
      placeholder="ON condition (e.g., table1.id = table2.id)"
      value={join.condition || ""}
      onChange={(e) => onChange({ condition: e.target.value })}
    />
    <button style={styles.removeButton} onClick={onRemove}>
      ×
    </button>
  </div>
);

const WhereCondition = ({ condition, showLogic, onRemove, onChange }) => (
  <div style={styles.editableField}>
    {showLogic && (
      <select
        style={styles.select}
        value={condition.logic || "AND"}
        onChange={(e) => onChange({ logic: e.target.value })}
      >
        <option value="AND">AND</option>
        <option value="OR">OR</option>
      </select>
    )}
    <label style={styles.checkboxSmall}>
      <input
        type="checkbox"
        checked={condition.not || false}
        onChange={(e) => onChange({ not: e.target.checked })}
      />
      NOT
    </label>
    <span style={styles.fieldLabel}>{condition.field}</span>
    <select
      style={styles.select}
      value={condition.operator || "="}
      onChange={(e) => onChange({ operator: e.target.value })}
    >
      <option value="=">=</option>
      <option value="!=">!=</option>
      <option value=">">&gt;</option>
      <option value="<">&lt;</option>
      <option value=">=">&gt;=</option>
      <option value="<=">&lt;=</option>
      <option value="LIKE">LIKE</option>
      <option value="IN">IN</option>
      <option value="BETWEEN">BETWEEN</option>
      <option value="IS NULL">IS NULL</option>
    </select>
    <input
      type="text"
      style={styles.input}
      placeholder="Value..."
      value={condition.value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
    />
    <button style={styles.removeButton} onClick={onRemove}>
      ×
    </button>
  </div>
);

const OrderByField = ({ field, onRemove, onChange }) => (
  <div style={styles.editableField}>
    <span style={styles.fieldLabel}>
      {field.table}.{field.column}
    </span>
    <select
      style={styles.select}
      value={field.direction || "ASC"}
      onChange={(e) => onChange({ direction: e.target.value })}
    >
      <option value="ASC">ASC</option>
      <option value="DESC">DESC</option>
    </select>
    <button style={styles.removeButton} onClick={onRemove}>
      ×
    </button>
  </div>
);

const InsertField = ({ field, onRemove, onChange }) => (
  <div style={styles.editableField}>
    <span style={styles.fieldLabel}>{field.column}</span>
    <input
      type="text"
      style={{ ...styles.input, flex: 1 }}
      placeholder="Value..."
      value={field.value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
    />
    <button style={styles.removeButton} onClick={onRemove}>
      ×
    </button>
  </div>
);

const SetField = ({ field, onRemove, onChange }) => (
  <div style={styles.editableField}>
    <span style={styles.fieldLabel}>{field.column}</span>
    <span>=</span>
    <input
      type="text"
      style={{ ...styles.input, flex: 1 }}
      placeholder="Value..."
      value={field.value || ""}
      onChange={(e) => onChange({ value: e.target.value })}
    />
    <button style={styles.removeButton} onClick={onRemove}>
      ×
    </button>
  </div>
);

const styles = {
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "white",
    overflow: "hidden",
  },
  header: {
    padding: "16px",
    borderBottom: "1px solid #dee2e6",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
  },
  queryTypeSelector: {
    display: "flex",
    gap: "8px",
  },
  typeButton: {
    padding: "8px 16px",
    border: "1px solid #dee2e6",
    backgroundColor: "white",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  typeButtonActive: {
    backgroundColor: "#007bff",
    color: "white",
    borderColor: "#007bff",
  },
  builderArea: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
  },
  section: {
    marginBottom: "16px",
    border: "1px solid #dee2e6",
    borderRadius: "6px",
    overflow: "hidden",
  },
  sectionHeader: {
    padding: "10px 16px",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
  },
  sectionContent: {
    padding: "16px",
  },
  dropZone: {
    minHeight: "60px",
    border: "2px dashed #dee2e6",
    borderRadius: "4px",
    padding: "12px",
    transition: "all 0.2s",
  },
  dropZoneActive: {
    borderColor: "#007bff",
    backgroundColor: "#e7f3ff",
  },
  dropPlaceholder: {
    color: "#6c757d",
    fontSize: "13px",
    textAlign: "center",
    padding: "8px",
  },
  itemList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  editableField: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  fieldLabel: {
    fontWeight: "500",
    fontSize: "13px",
    color: "#333",
  },
  input: {
    padding: "6px 10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "13px",
    flex: 1,
  },
  select: {
    padding: "6px 10px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "13px",
    backgroundColor: "white",
  },
  removeButton: {
    width: "24px",
    height: "24px",
    border: "none",
    backgroundColor: "#dc3545",
    color: "white",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: "500",
  },
  chipRemove: {
    width: "18px",
    height: "18px",
    border: "none",
    backgroundColor: "rgba(255,255,255,0.3)",
    color: "white",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
    padding: 0,
  },
  optionRow: {
    marginBottom: "12px",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  checkboxSmall: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};

export default QueryBuilder;
