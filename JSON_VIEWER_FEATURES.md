# JSON Viewer Features Documentation

## 🎯 **Feature Overview**

The JSON Viewer now includes **10 powerful modes** with smart UI behavior:

### 📋 **Processing Modes**

| Feature | Process Button | Input Panel | Behavior |
|---------|----------------|-------------|----------|
| **Pretty Print** | ✅ Required | ✅ Visible | Click "Process" to format |
| **Minify** | ✅ Required | ✅ Visible | Click "Process" to compress |
| **Tree View** | ✅ Required | ✅ Visible | Click "Process" to generate tree |
| **Validate** | ⚡ Real-time | ✅ Visible | Auto-validates as you type (500ms delay) |
| **Schema Generator** | 🔄 Automatic | ✅ Visible | Processes automatically when JSON changes |
| **JSONPath Evaluator** | 🔄 Automatic | ✅ Visible | Processes automatically when JSON/path changes |
| **Statistics & Analysis** | 🔄 Automatic | ✅ Visible | Processes automatically when JSON changes |
| **JSON Flattener** | 🔄 Automatic | ✅ Visible | Processes automatically when JSON/options change |
| **JSON Diff/Compare** | 🚫 Self-contained | ❌ Hidden | Has its own dual input interface |
| **Data Visualizer** | 🚫 Self-contained | ❌ Hidden | Has its own input + visualization interface |

### 🎨 **UI Behavior**

#### **Traditional Modes** (Pretty Print, Minify, Tree View)
- Show input panel with Process button
- Require manual processing
- Use 2-column layout (input | output)

#### **Real-time Mode** (Validate)
- Show input panel with "Real-time validation" indicator
- Auto-process with 500ms debounce
- Use 2-column layout

#### **Auto-processing Modes** (Schema, JSONPath, Stats, Flattener)
- Show input panel with "Processes automatically" indicator
- No Process button needed
- Use 2-column layout (input | output)

#### **Self-contained Modes** (Diff, Visualizer)
- Hide main input panel entirely
- Use full-width layout
- Have their own integrated interfaces

### 🚀 **Enhanced Features**

#### **Schema Generator**
- Generates JSON Schema Draft 7
- Options for required fields, additional properties
- Copy/download schema output
- Load examples to see it in action

#### **JSONPath Evaluator**
- Real-time expression evaluation
- Built-in examples and suggestions
- Highlighted results with paths
- Support for complex queries

#### **Statistics & Analysis**
- JSON structure metrics (depth, nodes, arrays)
- Data type distribution
- Property frequency analysis  
- Memory estimation and complexity scores
- Performance indicators

#### **JSON Diff/Compare**
- Side-by-side input editors
- Unified and split diff views
- Color-coded changes (add/remove/modify)
- Export diff results in multiple formats
- Similarity scoring

#### **JSON Flattener**
- Flatten nested JSON to dot notation
- Unflatten flat JSON back to nested
- Custom separator options
- Array notation choices
- CSV export capability

#### **Data Visualizer**
- Interactive tree/graph visualization
- Multiple layout algorithms (tree, graph)
- Zoom, pan, and search capabilities
- Color-coded by data type/depth/value
- Export as SVG/PNG
- Node selection and details

### 💡 **Usage Tips**

1. **For quick formatting**: Use Pretty Print or Minify with the Process button
2. **For validation**: Just paste JSON and get instant feedback in Validate mode
3. **For analysis**: Use Schema, Stats, or JSONPath modes - they work automatically
4. **For comparison**: Use Diff mode with its dual-input interface
5. **For exploration**: Use Visualizer mode to see JSON structure graphically

### 🔧 **Examples Included**

Each mode includes relevant examples:
- **E-commerce products** for Schema generation
- **Store inventory** for JSONPath queries  
- **API responses** for Statistics analysis
- **Configuration files** for Flattening
- **Organization charts** for Visualization

All features are **production-ready** with proper error handling, responsive design, and TypeScript type safety! 🎯