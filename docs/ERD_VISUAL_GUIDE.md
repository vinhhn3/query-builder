# ERD Diagram Feature - Visual Guide

## Screenshot Guide

### Main Interface with ERD

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Left Panel          │      Middle Panel - ERD Tab      │   Right Panel      │
│                     │                                   │                    │
│ ┌─────────────────┐ │ ┌──────────────────────────────┐ │ ┌────────────────┐│
│ │ Schema Input ▼  │ │ │ 🔧 Query Builder│📊 ERD Diagram│ │ │ Generated SQL ││
│ │ ✓ Loaded        │ │ └──────────────────────────────┘ │ │                ││
│ └─────────────────┘ │                                   │ │                ││
│                     │ Controls: Zoom: 100% 🔍+ 🔍- 🔄  │ │  SELECT *      ││
│ ┌─────────────────┐ │                                   │ │  FROM users    ││
│ │ ⋮⋮ Customers ▼  │ │    ┌──────────────────┐         │ │                ││
│ │  ⋮⋮ customer_id │ │    │  Customers       │         │ │  [Copy] [💾]   ││
│ │  ⋮⋮ first_name  │ │    │ ──────────────── │         │ │                ││
│ │  ⋮⋮ email       │ │    │ 🔑 customer_id  │         │ │                ││
│ └─────────────────┘ │    │ first_name      │         │ │                ││
│                     │    │ email           │         │ │                ││
│ ┌─────────────────┐ │    └─────────┬────────┘         │ │                ││
│ │ ⋮⋮ Orders    ▼  │ │              │                   │ │                ││
│ │  ⋮⋮ order_id    │ │              │ customer_id → customer_id
│ │  ⋮⋮ customer_id │ │              ↓                   │ │                ││
│ │  ⋮⋮ status      │ │    ┌──────────────────┐         │ │                ││
│ └─────────────────┘ │    │  Orders          │         │ │                ││
│                     │    │ ──────────────── │         │ │                ││
│ 💡 Drag tables and  │    │ 🔑 order_id      │         │ │                ││
│    columns to canvas│    │ customer_id     │         │ │                ││
│                     │    │ status          │         │ │                ││
│                     │    └──────────────────┘         │ │                ││
│                     │                                   │ │                ││
│                     │ Legend: 🟨 PK  ─→ FK  3 Tables  │ │                ││
└─────────────────────┴───────────────────────────────────┴────────────────┘
```

## Key Visual Elements

### Tables

Each table is displayed as a card with:

- **Blue Header**: Table name in white text
- **Columns**: Listed with name and type
- **Primary Keys**: Yellow background with 🔑 icon
- **Click to Select**: Blue border appears when selected

### Relationships

- **Connecting Lines**: Gray curved lines (Bezier curves)
- **Arrow Heads**: Point to referenced table
- **Labels**: Show column mappings (e.g., "user_id → id")

### Controls

Located at the top of the ERD panel:

- **Zoom Display**: "Zoom: 100%"
- **🔍+**: Zoom in button
- **🔍-**: Zoom out button
- **🔄 Reset**: Reset zoom and pan
- **💾 Export**: Download as SVG

### Legend

Located at the bottom:

- 🟨 Yellow box = Primary Key indicator
- → Line = Foreign Key relationship
- "X Tables • Y Relationships" counter

## Interaction Examples

### Zooming

1. **Mouse Wheel**: Scroll up to zoom in, down to zoom out
2. **Buttons**: Click 🔍+ or 🔍- to adjust zoom in 10% increments
3. **Range**: 30% to 200% zoom levels supported

### Panning

1. **Click & Drag**: Click on empty canvas area and drag to move
2. **Cursor**: Changes to "grab" hand icon over canvas
3. **While Dragging**: Cursor becomes "grabbing" hand

### Table Selection

1. **Click Table**: Click any table card to select it
2. **Visual Feedback**: Selected table gets blue border (3px)
3. **Click Again**: Click selected table to deselect

### Exporting

1. **Click Export**: Click "💾 Export" button in controls
2. **Download**: Browser downloads "erd-diagram.svg"
3. **Usage**: Open in browser, edit in vector editor, or embed in docs

## Color Scheme

- **Background**: Light gray (#fafafa)
- **Tables**: White (#ffffff)
- **Table Headers**: Blue (#007bff)
- **Primary Keys**: Yellow (#fff3cd)
- **Relationships**: Gray (#6c757d)
- **Selected Border**: Blue (#007bff)
- **Export Button**: Green (#28a745)

## Layout Algorithm

Tables are arranged in a **grid pattern**:

- Grid columns: √(number of tables) rounded up
- Spacing: 300px horizontally and vertically
- Starting position: 50px from top-left
- Automatic arrangement based on index

Example for 6 tables:

```
Table1  Table2  Table3
Table4  Table5  Table6
```

## Best Practices

1. **Start Zoomed Out**: View entire schema first
2. **Zoom for Details**: Zoom in to read column types
3. **Follow Relationships**: Trace lines to understand data flow
4. **Export Early**: Save diagrams for reference
5. **Click Tables**: Select to focus on specific entities

## Responsive Behavior

- **Canvas**: Fills available space in middle panel
- **SVG**: Scales proportionally with zoom
- **ViewBox**: Dynamically adjusted for zoom/pan
- **Performance**: Smooth rendering up to ~50 tables
