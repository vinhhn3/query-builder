# ERD Table Dragging Feature

## ✨ New Feature: Drag and Rearrange Tables

You can now **drag tables** in the ERD to arrange them exactly how you want for better visualization!

## 🎯 How It Works

### Dragging Tables

1. **Click and Hold**: Click on any table card
2. **Drag**: Move your mouse while holding the button
3. **Release**: Drop the table at the new position
4. **Positioning**: Tables stay where you put them

### Visual Feedback

- **Cursor**: Changes to "move" cursor when hovering over tables
- **While Dragging**:
  - Cursor becomes "grabbing" hand
  - Table becomes slightly transparent (70% opacity)
  - Relationships update in real-time
- **Smooth Movement**: Tables follow your mouse precisely

### Separate Panning

- **Canvas Panning**: Click and drag on **empty space** (not on tables)
- **Table Dragging**: Click and drag on **table cards**
- The system automatically detects which action you want

## 🎨 Features

### Persistent Positions

- **Custom Layout**: Your table arrangement is remembered
- **New Tables**: Automatically placed in grid layout
- **Existing Tables**: Stay where you positioned them
- **Per-Session**: Positions reset when you reload the page

### Reset Options

- **Reset View** (🔄): Returns zoom and pan to default
- **Reset Layout** (↺): Returns all tables to grid layout
- Two separate controls for flexibility

### Smart Relationship Lines

- **Dynamic Updates**: Lines redraw automatically as you move tables
- **Connection Points**:
  - Lines connect from bottom of source table
  - Lines connect to top of target table
- **Curved Paths**: Bezier curves adjust to new positions

## 📊 Use Cases

### Organize by Module

Group related tables together (e.g., user tables, order tables, product tables)

### Minimize Line Crossings

Arrange tables to reduce relationship line intersections for clarity

### Hierarchical Layout

Place parent tables above child tables to show data flow

### Custom Workflows

Arrange based on your specific data flow or business logic

## 🎮 Controls Summary

| Action           | Method                                    |
| ---------------- | ----------------------------------------- |
| **Pan Canvas**   | Click & drag empty space                  |
| **Drag Table**   | Click & drag table card                   |
| **Zoom**         | Mouse wheel or +/- buttons                |
| **Select Table** | Click table (highlights with blue border) |
| **Reset View**   | Click "🔄 Reset View" button              |
| **Reset Layout** | Click "↺ Reset Layout" button             |

## 💡 Tips

1. **Start with Reset Layout**: If tables are messy, click "↺ Reset Layout"
2. **Zoom Out First**: Zoom out to see all tables before rearranging
3. **Group Related Tables**: Move related tables close together
4. **Use Grid as Base**: Start with grid layout, then make adjustments
5. **Clear Relationships**: Arrange to minimize crossing lines

## 🔧 Technical Details

### Position Storage

- Positions stored in component state (`tablePositions`)
- Format: `{ tableName: { x, y } }`
- Coordinates in SVG space (affected by zoom/pan)

### Coordinate System

- **SVG Coordinates**: Calculated from mouse position
- **Zoom Aware**: Positions adjust for current zoom level
- **Pan Aware**: Accounts for canvas panning offset

### Event Handling

- `onMouseDown` on table: Starts table drag
- `onMouseMove` on canvas: Updates position during drag
- `onMouseUp`: Ends drag operation
- `stopPropagation`: Prevents canvas pan when dragging table

### Performance

- Smooth dragging with React state updates
- Efficient re-rendering of relationships
- No lag even with many tables

## 🎨 Visual Indicators

### Normal State

```
Cursor: move (four-way arrow)
Opacity: 100%
Border: Gray or Blue (if selected)
```

### Dragging State

```
Cursor: grabbing (closed hand)
Opacity: 70%
Border: Same as normal
Relationships: Update in real-time
```

### Canvas Pan State

```
Cursor: grab (open hand) or grabbing
Tables: Not affected
```

## 🚀 Example Workflow

1. **Open ERD**: Click "📊 ERD Diagram" tab
2. **View Default Layout**: Tables in automatic grid
3. **Identify Relationships**: See which tables are connected
4. **Drag to Organize**: Move tables to clarify relationships
5. **Fine-tune**: Adjust positions for optimal clarity
6. **Export**: Save the organized diagram

## ⚡ Keyboard Shortcuts (Future Enhancement)

- `Ctrl + Z`: Undo last table move (planned)
- `Ctrl + R`: Reset all positions (planned)
- Arrow keys: Nudge selected table (planned)

---

This feature makes the ERD much more flexible and useful for understanding complex database schemas! 🎉
