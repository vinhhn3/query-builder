import { render, screen } from "@testing-library/react";
import ERDiagram from "../components/ERDiagram";
import useQueryStore from "../store/queryStore";

// Mock the store
jest.mock("../store/queryStore");

describe("ERDiagram Component", () => {
  beforeEach(() => {
    useQueryStore.mockReturnValue({
      tables: [],
      schema: null,
    });
  });

  test("should show empty state when no schema is loaded", () => {
    render(<ERDiagram />);
    expect(screen.getByText("No Schema Loaded")).toBeInTheDocument();
    expect(
      screen.getByText("Load a schema to view the ERD")
    ).toBeInTheDocument();
  });

  test("should display tables when schema is loaded", () => {
    useQueryStore.mockReturnValue({
      tables: [
        {
          name: "users",
          columns: [
            { name: "id", type: "INT", isPrimaryKey: true },
            { name: "name", type: "VARCHAR(50)", isPrimaryKey: false },
          ],
        },
        {
          name: "orders",
          columns: [
            { name: "id", type: "INT", isPrimaryKey: true },
            { name: "user_id", type: "INT", isPrimaryKey: false },
          ],
        },
      ],
      schema: "CREATE TABLE users...",
    });

    render(<ERDiagram />);
    expect(screen.getByText("Entity Relationship Diagram")).toBeInTheDocument();
  });

  test("should have zoom controls", () => {
    useQueryStore.mockReturnValue({
      tables: [
        {
          name: "users",
          columns: [{ name: "id", type: "INT", isPrimaryKey: true }],
        },
      ],
      schema: "CREATE TABLE users...",
    });

    render(<ERDiagram />);

    // Check for zoom buttons
    const zoomInButton = screen.getByTitle("Zoom In");
    const zoomOutButton = screen.getByTitle("Zoom Out");
    const resetButton = screen.getByTitle("Reset View");

    expect(zoomInButton).toBeInTheDocument();
    expect(zoomOutButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  test("should have export button", () => {
    useQueryStore.mockReturnValue({
      tables: [
        {
          name: "users",
          columns: [{ name: "id", type: "INT", isPrimaryKey: true }],
        },
      ],
      schema: "CREATE TABLE users...",
    });

    render(<ERDiagram />);

    const exportButton = screen.getByTitle("Export as SVG");
    expect(exportButton).toBeInTheDocument();
  });

  test("should display table and relationship counts", () => {
    useQueryStore.mockReturnValue({
      tables: [
        {
          name: "users",
          columns: [{ name: "id", type: "INT", isPrimaryKey: true }],
        },
        {
          name: "orders",
          columns: [{ name: "id", type: "INT", isPrimaryKey: true }],
        },
      ],
      schema: `
        CREATE TABLE users (id INT PRIMARY KEY);
        CREATE TABLE orders (
          id INT PRIMARY KEY,
          user_id INT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
    });

    render(<ERDiagram />);

    // Should show counts
    expect(screen.getByText(/2 Tables/)).toBeInTheDocument();
    expect(screen.getByText(/Relationships/)).toBeInTheDocument();
  });

  test("should parse foreign key relationships", () => {
    useQueryStore.mockReturnValue({
      tables: [
        {
          name: "users",
          columns: [{ name: "id", type: "INT", isPrimaryKey: true }],
        },
        {
          name: "orders",
          columns: [
            { name: "id", type: "INT", isPrimaryKey: true },
            { name: "user_id", type: "INT", isPrimaryKey: false },
          ],
        },
      ],
      schema: `
        CREATE TABLE users (id INT PRIMARY KEY);
        CREATE TABLE orders (
          id INT PRIMARY KEY,
          user_id INT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `,
    });

    render(<ERDiagram />);

    // Should display relationship count
    expect(screen.getByText(/1 Relationship/)).toBeInTheDocument();
  });
});
