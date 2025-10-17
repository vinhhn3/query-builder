# React Drag & Drop SQL Query Builder

A visual SQL query builder that allows users to construct SQL statements through drag-and-drop interactions.

## Features

✅ **Visual Query Building**: Drag tables and columns to build queries
✅ **Multiple Query Types**: Support for SELECT, INSERT, UPDATE, and DELETE
✅ **Advanced SQL Features**: JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT
✅ **Logical Operators**: AND, OR, NOT support in conditions
✅ **Special Operators**: LIKE, IN, BETWEEN, EXISTS
✅ **Aggregate Functions**: COUNT, SUM, AVG, MAX, MIN
✅ **Auto-cleanup**: Removing a table automatically removes all related fields
✅ **Real-time SQL Generation**: See your SQL update as you build
✅ **Inline Editing**: No modal dialogs - all editing happens inline
✅ **Export SQL**: Copy or download generated SQL queries
✅ **ERD Visualization**: Interactive Entity Relationship Diagram with zoom, pan, and export

## Installation

```bash
npm install
```

## Running the Application

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

## Running Tests

```bash
npm test
```

## How to Use

### 1. Input Schema

When you first open the application, you'll see a schema input screen. You can:

- Paste your SQL schema (CREATE TABLE statements)
- Click "Load Example" to see a sample schema
- Click "Parse Schema" to start building queries

### 2. Building Queries

The interface is divided into three main areas:

#### Left Panel - Tables & Schema

- **Schema Input**: Collapsible section to load/edit schema
- Shows all tables from your schema
- Click the arrow to expand and see columns
- Drag tables to the FROM or JOIN sections
- Drag columns to SELECT, WHERE, GROUP BY, or ORDER BY sections

#### Middle Panel - Query Builder / ERD

**Two Tabs Available:**

**🔧 Query Builder Tab:**

- Select query type: SELECT, INSERT, UPDATE, or DELETE
- Drag and drop elements from the left panel
- Configure options inline (aliases, operators, functions)
- Each section has a colored header for easy identification

**📊 ERD Diagram Tab:**

- Visual representation of database schema
- Shows tables, columns, and relationships
- Interactive zoom and pan controls
- Click tables to highlight them
- Export diagram as SVG

#### Right Panel - SQL Output

- Shows real-time generated SQL
- Copy or export the SQL query
- Formatted for readability

### 3. Query Types

#### SELECT Query

1. Drag columns to the SELECT section
2. Drag a table to the FROM section
3. (Optional) Drag tables to JOIN and configure join conditions
4. (Optional) Drag columns to WHERE for filters
5. (Optional) Use GROUP BY, ORDER BY, and LIMIT

**Example:**

```sql
SELECT users.name, COUNT(orders.id) AS order_count
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE users.status = 'active'
GROUP BY users.name
ORDER BY order_count DESC
LIMIT 10
```

#### INSERT Query

1. Drag a table to the INSERT INTO section
2. Drag columns to the VALUES section
3. Enter values for each column

**Example:**

```sql
INSERT INTO users (name, email)
VALUES ('John', 'john@example.com')
```

#### UPDATE Query

1. Drag a table to the UPDATE section
2. Drag columns to the SET section and enter new values
3. (Optional) Add WHERE conditions

**Example:**

```sql
UPDATE users
SET status = 'inactive'
WHERE last_login < '2023-01-01'
```

#### DELETE Query

1. Drag a table to the DELETE FROM section
2. (Optional) Add WHERE conditions

**Example:**

```sql
DELETE FROM users
WHERE status = 'deleted'
```

### 4. Advanced Features

#### Aggregate Functions

In SELECT queries, you can apply functions to columns:

- COUNT, SUM, AVG, MAX, MIN
- Add an alias for the result

#### WHERE Conditions

- Multiple operators: =, !=, >, <, >=, <=, LIKE, IN, BETWEEN, IS NULL
- Combine with AND/OR logic
- Use NOT to negate conditions

#### JOINs

- Support for all join types: INNER, LEFT, RIGHT, FULL, CROSS
- Enter join conditions manually (e.g., `table1.id = table2.foreign_id`)

#### Auto-cleanup

When you remove a table from the FROM section, all related elements are automatically removed:

- Selected fields from that table
- JOINs involving that table
- WHERE conditions referencing that table
- GROUP BY and ORDER BY clauses using that table's columns

#### ERD Visualization

The ERD (Entity Relationship Diagram) feature provides a visual representation of your database:

**Features:**

- **Visual Schema**: See all tables, columns, and data types at a glance
- **Relationships**: Foreign key relationships displayed with connecting lines
- **Primary Keys**: Highlighted in yellow with 🔑 icon
- **Interactive Navigation**:
  - Mouse wheel to zoom in/out
  - Click and drag to pan around the diagram
  - Click tables to highlight/select them
- **Zoom Controls**: +/- buttons and reset view option
- **Export**: Download the diagram as SVG for documentation

**How to Use ERD:**

1. Load your schema
2. Click the "📊 ERD Diagram" tab in the middle panel
3. Use mouse wheel to zoom, click and drag to pan
4. Click "💾 Export" to save the diagram

## Schema Format

The application parses standard SQL CREATE TABLE statements:

```sql
CREATE TABLE TableName (
    column_name DATA_TYPE [PRIMARY KEY] [NOT NULL] [UNIQUE],
    ...
    FOREIGN KEY (column_name) REFERENCES OtherTable(column_name)
);
```

**Supported features:**

- Column names and data types
- Primary keys
- Unique constraints
- Not null constraints
- Foreign keys (for reference, not enforced in UI)

## Architecture

### Technologies Used

- **React 19**: UI framework
- **Zustand**: State management
- **@dnd-kit**: Drag and drop functionality
- **sql-formatter**: SQL formatting
- **node-sql-parser**: SQL parsing (future enhancement)

### Project Structure

```
src/
  components/
    SchemaInput.js       # Schema input screen
    TableList.js         # Left panel - draggable tables
    QueryBuilder.js      # Middle panel - query construction
    SQLOutput.js         # Right panel - SQL display
    DndContext.js        # Drag & drop context provider
  store/
    queryStore.js        # Zustand store for query state
  utils/
    sqlGenerator.js      # SQL generation logic
  App.js                 # Main application component
```

## Future Enhancements

- [ ] Sub-queries support
- [ ] UNION/INTERSECT/EXCEPT operations
- [ ] Visual query execution and result preview
- [ ] Save/load queries to/from files
- [ ] Query history
- [ ] Multi-database support (PostgreSQL, MySQL, SQL Server dialects)
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Query performance hints

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
