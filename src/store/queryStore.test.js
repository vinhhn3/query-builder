import { act, renderHook } from "@testing-library/react";
import useQueryStore from "../store/queryStore";

describe("Query Store", () => {
  test("should parse schema correctly", () => {
    const { result } = renderHook(() => useQueryStore());

    const schema = `
      CREATE TABLE users (
        id INT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE
      );
    `;

    act(() => {
      result.current.setSchema(schema);
    });

    expect(result.current.tables).toHaveLength(1);
    expect(result.current.tables[0].name).toBe("users");
    expect(result.current.tables[0].columns).toHaveLength(3);
  });

  test("should add and remove selected fields", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.addSelectedField({
        table: "users",
        column: "name",
        alias: null,
      });
    });

    expect(result.current.selectedFields).toHaveLength(1);
    expect(result.current.selectedFields[0].column).toBe("name");

    const fieldId = result.current.selectedFields[0].id;

    act(() => {
      result.current.removeSelectedField(fieldId);
    });

    expect(result.current.selectedFields).toHaveLength(0);
  });

  test("should add and remove FROM tables", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.addFromTable({ table: "users", alias: null });
    });

    expect(result.current.fromTables).toHaveLength(1);
    expect(result.current.fromTables[0].table).toBe("users");

    const tableId = result.current.fromTables[0].id;

    act(() => {
      result.current.removeFromTable(tableId);
    });

    expect(result.current.fromTables).toHaveLength(0);
  });

  test("should remove related fields when table is removed", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.addFromTable({ table: "users", alias: null });
      result.current.addSelectedField({
        table: "users",
        column: "name",
        alias: null,
      });
      result.current.addWhereCondition({
        field: "users.id",
        operator: "=",
        value: "1",
      });
    });

    expect(result.current.selectedFields).toHaveLength(1);
    expect(result.current.whereConditions).toHaveLength(1);

    const tableId = result.current.fromTables[0].id;

    act(() => {
      result.current.removeFromTable(tableId);
    });

    expect(result.current.fromTables).toHaveLength(0);
    expect(result.current.selectedFields).toHaveLength(0);
    expect(result.current.whereConditions).toHaveLength(0);
  });

  test("should handle WHERE conditions with logic operators", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.addWhereCondition({
        field: "users.age",
        operator: ">",
        value: "18",
        logic: "AND",
      });
      result.current.addWhereCondition({
        field: "users.status",
        operator: "=",
        value: "'active'",
        logic: "OR",
      });
    });

    expect(result.current.whereConditions).toHaveLength(2);
    expect(result.current.whereConditions[0].operator).toBe(">");
    expect(result.current.whereConditions[1].logic).toBe("OR");
  });

  test("should change query type and reset state", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.addFromTable({ table: "users", alias: null });
      result.current.addSelectedField({
        table: "users",
        column: "name",
        alias: null,
      });
    });

    expect(result.current.fromTables).toHaveLength(1);
    expect(result.current.selectedFields).toHaveLength(1);

    act(() => {
      result.current.setQueryType("INSERT");
    });

    expect(result.current.queryType).toBe("INSERT");
    expect(result.current.fromTables).toHaveLength(0);
    expect(result.current.selectedFields).toHaveLength(0);
  });

  test("should handle INSERT query", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.setQueryType("INSERT");
      result.current.setInsertTable("users");
      result.current.addInsertField({ column: "name", value: "'John'" });
      result.current.addInsertField({
        column: "email",
        value: "'john@example.com'",
      });
    });

    expect(result.current.queryType).toBe("INSERT");
    expect(result.current.insertTable).toBe("users");
    expect(result.current.insertFields).toHaveLength(2);
  });

  test("should handle UPDATE query", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.setQueryType("UPDATE");
      result.current.setUpdateTable("users");
      result.current.addSetField({ column: "name", value: "'Jane'" });
      result.current.addWhereCondition({
        field: "users.id",
        operator: "=",
        value: "1",
      });
    });

    expect(result.current.queryType).toBe("UPDATE");
    expect(result.current.updateTable).toBe("users");
    expect(result.current.setFields).toHaveLength(1);
    expect(result.current.whereConditions).toHaveLength(1);
  });

  test("should handle DELETE query", () => {
    const { result } = renderHook(() => useQueryStore());

    act(() => {
      result.current.setQueryType("DELETE");
      result.current.setDeleteTable("users");
      result.current.addWhereCondition({
        field: "users.id",
        operator: "=",
        value: "1",
      });
    });

    expect(result.current.queryType).toBe("DELETE");
    expect(result.current.deleteTable).toBe("users");
    expect(result.current.whereConditions).toHaveLength(1);
  });
});
