import { generateSQL } from "../utils/sqlGenerator";

describe("SQL Generator", () => {
  test("should generate basic SELECT query", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("SELECT");
    expect(sql).toContain("users.name");
    expect(sql).toContain("FROM users");
  });

  test("should generate SELECT with DISTINCT", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: true,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("DISTINCT");
  });

  test("should generate SELECT with aggregate function", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        {
          table: "users",
          column: "id",
          alias: "user_count",
          function: "COUNT",
        },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("COUNT(users.id)");
    expect(sql).toContain("AS user_count");
  });

  test("should generate SELECT with WHERE clause", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [
        {
          field: "users.age",
          operator: ">",
          value: "18",
          logic: "AND",
          not: false,
        },
      ],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("WHERE");
    expect(sql).toContain("users.age > 18");
  });

  test("should generate SELECT with JOIN", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
        { table: "orders", column: "total", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [
        {
          type: "INNER",
          table: "orders",
          alias: null,
          condition: "users.id = orders.user_id",
        },
      ],
      whereConditions: [],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("INNER JOIN orders");
    expect(sql).toContain("ON users.id = orders.user_id");
  });

  test("should generate SELECT with GROUP BY and ORDER BY", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
        {
          table: "orders",
          column: "id",
          alias: "order_count",
          function: "COUNT",
        },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [
        {
          type: "INNER",
          table: "orders",
          alias: null,
          condition: "users.id = orders.user_id",
        },
      ],
      whereConditions: [],
      groupBy: [{ table: "users", column: "name" }],
      having: [],
      orderBy: [{ table: "orders", column: "id", direction: "DESC" }],
      limit: 10,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("GROUP BY");
    expect(sql).toContain("ORDER BY");
    expect(sql).toContain("DESC");
    expect(sql).toContain("LIMIT 10");
  });

  test("should generate INSERT query", () => {
    const queryState = {
      queryType: "INSERT",
      insertTable: "users",
      insertFields: [
        { column: "name", value: "'John'" },
        { column: "email", value: "'john@example.com'" },
      ],
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("INSERT INTO users");
    expect(sql).toContain("(name, email)");
    expect(sql).toContain("VALUES ('John', 'john@example.com')");
  });

  test("should generate UPDATE query", () => {
    const queryState = {
      queryType: "UPDATE",
      updateTable: "users",
      setFields: [
        { column: "name", value: "'Jane'" },
        { column: "status", value: "'active'" },
      ],
      whereConditions: [
        {
          field: "users.id",
          operator: "=",
          value: "1",
          logic: "AND",
          not: false,
        },
      ],
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("UPDATE users");
    expect(sql).toContain("SET");
    expect(sql).toContain("name = 'Jane'");
    expect(sql).toContain("WHERE");
    expect(sql).toContain("users.id = 1");
  });

  test("should generate DELETE query", () => {
    const queryState = {
      queryType: "DELETE",
      deleteTable: "users",
      whereConditions: [
        {
          field: "users.status",
          operator: "=",
          value: "'inactive'",
          logic: "AND",
          not: false,
        },
      ],
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("DELETE FROM users");
    expect(sql).toContain("WHERE");
    expect(sql).toContain("users.status = 'inactive'");
  });

  test("should handle NOT in WHERE conditions", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [
        {
          field: "users.status",
          operator: "=",
          value: "'active'",
          logic: "AND",
          not: true,
        },
      ],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("NOT");
  });

  test("should handle LIKE operator", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [
        {
          field: "users.name",
          operator: "LIKE",
          value: "'%John%'",
          logic: "AND",
          not: false,
        },
      ],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("LIKE");
    expect(sql).toContain("'%John%'");
  });

  test("should handle IN operator", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [
        {
          field: "users.status",
          operator: "IN",
          value: "'active', 'pending'",
          logic: "AND",
          not: false,
        },
      ],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("IN");
    expect(sql).toContain("('active', 'pending')");
  });

  test("should handle BETWEEN operator", () => {
    const queryState = {
      queryType: "SELECT",
      selectedFields: [
        { table: "users", column: "name", alias: null, function: null },
      ],
      fromTables: [{ table: "users", alias: null }],
      joins: [],
      whereConditions: [
        {
          field: "users.age",
          operator: "BETWEEN",
          value: "18, 65",
          logic: "AND",
          not: false,
        },
      ],
      groupBy: [],
      having: [],
      orderBy: [],
      limit: null,
      distinct: false,
    };

    const sql = generateSQL(queryState);
    expect(sql).toContain("BETWEEN");
    expect(sql).toContain("18 AND 65");
  });
});
