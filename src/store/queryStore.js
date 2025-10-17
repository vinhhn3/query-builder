import { create } from "zustand";

const useQueryStore = create((set, get) => ({
  // Schema data
  schema: null,
  tables: [],

  // Query structure
  queryType: "SELECT", // SELECT, INSERT, UPDATE, DELETE
  selectedFields: [], // { id, table, column, alias, function }
  fromTables: [], // { id, table, alias }
  joins: [], // { id, type, table, alias, condition }
  whereConditions: [], // { id, field, operator, value, logic }
  groupBy: [], // { id, table, column }
  having: [], // { id, condition }
  orderBy: [], // { id, table, column, direction }
  limit: null,
  distinct: false,

  // For INSERT
  insertTable: null,
  insertFields: [], // { id, column, value }

  // For UPDATE
  updateTable: null,
  setFields: [], // { id, column, value }

  // For DELETE
  deleteTable: null,

  // Actions
  setSchema: (schemaText) => {
    const tables = parseSchema(schemaText);
    set({ schema: schemaText, tables });
  },

  setQueryType: (type) => {
    set({ queryType: type });
    // Reset query structure when changing type
    set({
      selectedFields: [],
      fromTables: [],
      joins: [],
      whereConditions: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
      insertTable: null,
      insertFields: [],
      updateTable: null,
      setFields: [],
      deleteTable: null,
    });
  },

  // SELECT actions
  addSelectedField: (field) => {
    set((state) => ({
      selectedFields: [...state.selectedFields, { ...field, id: generateId() }],
    }));
  },

  removeSelectedField: (id) => {
    set((state) => ({
      selectedFields: state.selectedFields.filter((f) => f.id !== id),
    }));
  },

  updateSelectedField: (id, updates) => {
    set((state) => ({
      selectedFields: state.selectedFields.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  },

  // FROM actions
  addFromTable: (table) => {
    set((state) => ({
      fromTables: [...state.fromTables, { ...table, id: generateId() }],
    }));
  },

  removeFromTable: (tableId) => {
    const state = get();
    const removedTable = state.fromTables.find((t) => t.id === tableId);
    if (!removedTable) return;

    const tableName = removedTable.table;

    // Remove the table
    const newFromTables = state.fromTables.filter((t) => t.id !== tableId);

    // Remove all fields related to this table
    const newSelectedFields = state.selectedFields.filter(
      (f) => f.table !== tableName
    );

    // Remove all joins related to this table
    const newJoins = state.joins.filter(
      (j) => j.table !== tableName && !j.condition?.includes(tableName)
    );

    // Remove all WHERE conditions related to this table
    const newWhereConditions = state.whereConditions.filter(
      (c) => !c.field?.includes(tableName)
    );

    // Remove all GROUP BY related to this table
    const newGroupBy = state.groupBy.filter((g) => g.table !== tableName);

    // Remove all ORDER BY related to this table
    const newOrderBy = state.orderBy.filter((o) => o.table !== tableName);

    set({
      fromTables: newFromTables,
      selectedFields: newSelectedFields,
      joins: newJoins,
      whereConditions: newWhereConditions,
      groupBy: newGroupBy,
      orderBy: newOrderBy,
    });
  },

  updateFromTable: (id, updates) => {
    set((state) => ({
      fromTables: state.fromTables.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },

  // JOIN actions
  addJoin: (join) => {
    set((state) => ({
      joins: [...state.joins, { ...join, id: generateId() }],
    }));
  },

  removeJoin: (id) => {
    set((state) => ({
      joins: state.joins.filter((j) => j.id !== id),
    }));
  },

  updateJoin: (id, updates) => {
    set((state) => ({
      joins: state.joins.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    }));
  },

  // WHERE actions
  addWhereCondition: (condition) => {
    set((state) => ({
      whereConditions: [
        ...state.whereConditions,
        { ...condition, id: generateId() },
      ],
    }));
  },

  removeWhereCondition: (id) => {
    set((state) => ({
      whereConditions: state.whereConditions.filter((c) => c.id !== id),
    }));
  },

  updateWhereCondition: (id, updates) => {
    set((state) => ({
      whereConditions: state.whereConditions.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  },

  // GROUP BY actions
  addGroupBy: (field) => {
    set((state) => ({
      groupBy: [...state.groupBy, { ...field, id: generateId() }],
    }));
  },

  removeGroupBy: (id) => {
    set((state) => ({
      groupBy: state.groupBy.filter((g) => g.id !== id),
    }));
  },

  // ORDER BY actions
  addOrderBy: (field) => {
    set((state) => ({
      orderBy: [
        ...state.orderBy,
        { ...field, id: generateId(), direction: "ASC" },
      ],
    }));
  },

  removeOrderBy: (id) => {
    set((state) => ({
      orderBy: state.orderBy.filter((o) => o.id !== id),
    }));
  },

  updateOrderBy: (id, updates) => {
    set((state) => ({
      orderBy: state.orderBy.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      ),
    }));
  },

  // Other actions
  setDistinct: (value) => set({ distinct: value }),
  setLimit: (value) => set({ limit: value }),

  // INSERT actions
  setInsertTable: (table) => set({ insertTable: table }),
  addInsertField: (field) => {
    set((state) => ({
      insertFields: [...state.insertFields, { ...field, id: generateId() }],
    }));
  },
  removeInsertField: (id) => {
    set((state) => ({
      insertFields: state.insertFields.filter((f) => f.id !== id),
    }));
  },
  updateInsertField: (id, updates) => {
    set((state) => ({
      insertFields: state.insertFields.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  },

  // UPDATE actions
  setUpdateTable: (table) => set({ updateTable: table }),
  addSetField: (field) => {
    set((state) => ({
      setFields: [...state.setFields, { ...field, id: generateId() }],
    }));
  },
  removeSetField: (id) => {
    set((state) => ({
      setFields: state.setFields.filter((f) => f.id !== id),
    }));
  },
  updateSetField: (id, updates) => {
    set((state) => ({
      setFields: state.setFields.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  },

  // DELETE actions
  setDeleteTable: (table) => set({ deleteTable: table }),
}));

// Helper functions
let idCounter = 0;
const generateId = () => `id_${Date.now()}_${idCounter++}`;

const parseSchema = (schemaText) => {
  const tables = [];

  // Simple regex-based parser for CREATE TABLE statements
  const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\);/gi;
  let match;

  while ((match = tableRegex.exec(schemaText)) !== null) {
    const tableName = match[1];
    const columnsText = match[2];

    // Parse columns
    const columns = [];
    const columnLines = columnsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    for (const line of columnLines) {
      // Skip FOREIGN KEY, PRIMARY KEY, etc.
      if (
        line.startsWith("FOREIGN KEY") ||
        line.startsWith("PRIMARY KEY") ||
        line.startsWith("UNIQUE") ||
        line.startsWith("CHECK") ||
        line.startsWith("CONSTRAINT")
      ) {
        continue;
      }

      // Extract column name and type
      const columnMatch = line.match(/^(\w+)\s+([A-Z]+(\([^)]+\))?)/i);
      if (columnMatch) {
        const columnName = columnMatch[1];
        const dataType = columnMatch[2];
        const isPrimaryKey = line.includes("PRIMARY KEY");
        const isNotNull = line.includes("NOT NULL");
        const isUnique = line.includes("UNIQUE");

        columns.push({
          name: columnName,
          type: dataType,
          isPrimaryKey,
          isNotNull,
          isUnique,
        });
      }
    }

    tables.push({
      name: tableName,
      columns,
    });
  }

  return tables;
};

export default useQueryStore;
