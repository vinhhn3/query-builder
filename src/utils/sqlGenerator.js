import { format } from "sql-formatter";

export const generateSQL = (queryState) => {
  const {
    queryType,
    selectedFields,
    fromTables,
    joins,
    whereConditions,
    groupBy,
    having,
    orderBy,
    limit,
    distinct,
    insertTable,
    insertFields,
    updateTable,
    setFields,
    deleteTable,
  } = queryState;

  let sql = "";

  switch (queryType) {
    case "SELECT":
      sql = generateSelect({
        selectedFields,
        fromTables,
        joins,
        whereConditions,
        groupBy,
        having,
        orderBy,
        limit,
        distinct,
      });
      break;
    case "INSERT":
      sql = generateInsert({ insertTable, insertFields });
      break;
    case "UPDATE":
      sql = generateUpdate({ updateTable, setFields, whereConditions });
      break;
    case "DELETE":
      sql = generateDelete({ deleteTable, whereConditions });
      break;
    default:
      sql = "";
  }

  try {
    return format(sql, { language: "sql" });
  } catch (e) {
    return sql;
  }
};

const generateSelect = ({
  selectedFields,
  fromTables,
  joins,
  whereConditions,
  groupBy,
  having,
  orderBy,
  limit,
  distinct,
}) => {
  if (fromTables.length === 0) {
    return "-- Add a FROM table to start building your query";
  }

  let sql = "SELECT ";

  if (distinct) {
    sql += "DISTINCT ";
  }

  // SELECT fields
  if (selectedFields.length === 0) {
    sql += "*";
  } else {
    sql += selectedFields
      .map((field) => {
        let fieldStr = "";

        if (field.function) {
          fieldStr = `${field.function}(${field.table}.${field.column})`;
        } else {
          fieldStr = `${field.table}.${field.column}`;
        }

        if (field.alias) {
          fieldStr += ` AS ${field.alias}`;
        }

        return fieldStr;
      })
      .join(", ");
  }

  // FROM clause
  sql +=
    "\nFROM " +
    fromTables
      .map((t) => {
        return t.alias ? `${t.table} AS ${t.alias}` : t.table;
      })
      .join(", ");

  // JOIN clauses
  if (joins.length > 0) {
    joins.forEach((join) => {
      sql += `\n${join.type || "INNER"} JOIN ${join.table}`;
      if (join.alias) {
        sql += ` AS ${join.alias}`;
      }
      if (join.condition) {
        sql += ` ON ${join.condition}`;
      }
    });
  }

  // WHERE clause
  if (whereConditions.length > 0) {
    sql += "\nWHERE " + buildWhereClause(whereConditions);
  }

  // GROUP BY clause
  if (groupBy.length > 0) {
    sql +=
      "\nGROUP BY " + groupBy.map((g) => `${g.table}.${g.column}`).join(", ");
  }

  // HAVING clause
  if (having.length > 0) {
    sql += "\nHAVING " + having.map((h) => h.condition).join(" AND ");
  }

  // ORDER BY clause
  if (orderBy.length > 0) {
    sql +=
      "\nORDER BY " +
      orderBy.map((o) => `${o.table}.${o.column} ${o.direction}`).join(", ");
  }

  // LIMIT clause
  if (limit) {
    sql += `\nLIMIT ${limit}`;
  }

  return sql;
};

const buildWhereClause = (conditions) => {
  if (conditions.length === 0) return "";

  return conditions
    .map((condition, index) => {
      let clause = "";

      if (index > 0 && condition.logic) {
        clause += ` ${condition.logic} `;
      }

      if (condition.not) {
        clause += "NOT ";
      }

      const operator = condition.operator || "=";
      const value = condition.value || "''";

      // Handle special operators
      if (operator.toUpperCase() === "IN") {
        clause += `${condition.field} IN (${value})`;
      } else if (operator.toUpperCase() === "BETWEEN") {
        const values = value.split(",").map((v) => v.trim());
        clause += `${condition.field} BETWEEN ${values[0]} AND ${values[1]}`;
      } else if (operator.toUpperCase() === "LIKE") {
        clause += `${condition.field} LIKE ${value}`;
      } else if (operator.toUpperCase() === "EXISTS") {
        clause += `EXISTS (${value})`;
      } else {
        clause += `${condition.field} ${operator} ${value}`;
      }

      return clause;
    })
    .join("");
};

const generateInsert = ({ insertTable, insertFields }) => {
  if (!insertTable || insertFields.length === 0) {
    return "-- Select a table and add fields to insert";
  }

  const columns = insertFields.map((f) => f.column).join(", ");
  const values = insertFields.map((f) => f.value || "''").join(", ");

  return `INSERT INTO ${insertTable} (${columns})\nVALUES (${values})`;
};

const generateUpdate = ({ updateTable, setFields, whereConditions }) => {
  if (!updateTable || setFields.length === 0) {
    return "-- Select a table and add fields to update";
  }

  let sql = `UPDATE ${updateTable}\nSET `;
  sql += setFields.map((f) => `${f.column} = ${f.value || "''"}`).join(", ");

  if (whereConditions.length > 0) {
    sql += "\nWHERE " + buildWhereClause(whereConditions);
  }

  return sql;
};

const generateDelete = ({ deleteTable, whereConditions }) => {
  if (!deleteTable) {
    return "-- Select a table to delete from";
  }

  let sql = `DELETE FROM ${deleteTable}`;

  if (whereConditions.length > 0) {
    sql += "\nWHERE " + buildWhereClause(whereConditions);
  }

  return sql;
};
