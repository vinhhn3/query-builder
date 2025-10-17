# ✅ Prompt: React Drag & Drop SQL Query Builder (Focused DML Version)

**Goal:**
Create a **React drag-and-drop SQL Query Builder** that allows users to visually construct SQL statements from a pasted database schema. The app should generate valid SQL dynamically, supporting **SELECT**, **INSERT**, **UPDATE**, and **DELETE** statements along with essential SQL clauses like **FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT**, and logical operators **AND, OR, NOT**.

The schema will be pasted in SQL like below:

```sql
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending',
    total_amount DECIMAL(10,2),
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- 4. OrderItems Table
CREATE TABLE OrderItems (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- 5. Payments Table
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Completed',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
);

```

When the user removes a `FROM` table, **all fields and expressions related to that table must also be automatically removed** from the builder and generated SQL.
No modals — inline editing only.

---

## 1. Supported SQL statements

**DML only:**

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

---

## 2. Supported clauses and operators

**Core clauses:**

- `FROM`
- `JOIN`

  - All types: `INNER`, `LEFT`, `RIGHT`, `FULL`, `CROSS`, `NATURAL`

- `WHERE`
- `GROUP BY`
- `HAVING`
- `ORDER BY`
- `LIMIT`

**Logical / conditional operators:**

- `AND`
- `OR`
- `NOT`

**Other expressions / keywords:**

- `DISTINCT`
- `EXISTS`
- `IN`
- `LIKE`
- `BETWEEN`

---

## 3. Functional behavior

1. **Schema input**

   - User pastes SQL schema text containing one or more `CREATE TABLE ...` statements.
   - The app parses the schema to extract tables, columns, data types, primary/foreign keys.
   - Parsed schema populates a left sidebar (table list) for drag-and-drop.

2. **Visual query builder**

   - Users drag tables, fields, and clauses onto a main canvas to build queries.
   - The builder provides areas for SELECT fields, FROM tables, JOIN conditions, WHERE filters, GROUP/HAVING, ORDER BY, and LIMIT.
   - Dragging a function or condition creates inline editable elements.
   - `AND`, `OR`, and `NOT` can be dragged or toggled within conditions.

3. **Automatic cleanup**

   - When a `FROM` table is removed:

     - All fields, JOINs, WHERE, GROUP BY, HAVING, and ORDER BY clauses referencing that table are also removed.
     - The generated SQL updates instantly.

4. **Inline editing**

   - No pop-up modals — all editing (aliases, operators, constants, function parameters) happens inline or in side-panels.

5. **Real-time SQL generation**

   - Display a live, formatted SQL output panel that updates with every user action.
   - Optionally support reverse sync: small SQL edits update the visual structure.

6. **Query types**

   - **SELECT:** Drag tables, choose columns, add filters and ordering.
   - **INSERT:** Choose target table and add field–value pairs.
   - **UPDATE:** Choose target table, add `SET` field–value pairs, and optional `WHERE`.
   - **DELETE:** Choose target table and optional `WHERE`.

7. **Parsing & validation**

   - Use an existing SQL parser (e.g., `node-sql-parser`, `pgsql-ast-parser`) to handle schema and query ASTs.
   - Validate for ambiguous columns, invalid references, and empty clause sections.

8. **Output**

   - Generate both:

     - Formatted SQL string
     - JSON/AST representation of the query

   - Example API:

     ```tsx
     <QueryBuilder
       schema={schemaText}
       onChange={(sql, ast) => console.log(sql, ast)}
     />
     ```

9. **Implementation details**

   - **Tech stack:** React + TypeScript
   - **Drag & drop:** `dnd-kit` or `react-beautiful-dnd`
   - **State:** Zustand or React Context
   - **Styling:** TailwindCSS (clean, minimal)
   - **SQL formatting:** `sql-formatter`
   - **Persistence:** LocalStorage or export/import JSON schema and queries

10. **Testing & validation**

    - Must include automated tests verifying:

      - SQL generation correctness
      - Field/table dependency removal
      - Proper handling of nested conditions (`AND`, `OR`, `NOT`)

---

## 4. Example usage flows

### Example 1 — SELECT query

User pastes schema with `users`, `orders`, `order_items`.
They build:

```
SELECT users.name, COUNT(order_items.id) AS item_count
FROM users
JOIN orders ON users.id = orders.user_id
JOIN order_items ON orders.id = order_items.order_id
WHERE users.country = 'VN' AND orders.status = 'completed'
GROUP BY users.name
HAVING COUNT(order_items.id) > 3
ORDER BY item_count DESC
LIMIT 10;
```

If the user removes `orders` from FROM, all fields and JOINs referencing it (`orders.status`, `JOIN order_items ...`) are automatically removed.

---

### Example 2 — UPDATE query

```
UPDATE products
SET price = price * 1.05
WHERE category = 'electronics';
```

Built visually by dragging table → field → operator/value.

---

### Example 3 — DELETE query

```
DELETE FROM orders
WHERE NOT EXISTS (
  SELECT 1 FROM order_items WHERE order_items.order_id = orders.id
);
```

---

### Example 4 — INSERT query

```
INSERT INTO customers (name, email)
VALUES ('Alice', 'alice@example.com');
```

---

## 5. Acceptance Criteria

- ✅ User can build **SELECT / INSERT / UPDATE / DELETE** visually.
- ✅ Real-time SQL generation and AST output.
- ✅ Removing a `FROM` table removes all related fields/conditions.
- ✅ Supports WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, DISTINCT, EXISTS, IN, LIKE, BETWEEN.
- ✅ No modal dialogs — all inline editing.
- ✅ Clean UI with drag & drop interaction.

---
