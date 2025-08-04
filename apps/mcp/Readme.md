# Easing Wizard MCP Server

A Model Context Protocol (MCP) server for the [Easing Wizard API](https://easingwizard.com). This server enables the generation of various CSS easing curves: Bézier, Spring, Bounce, Wiggle, and Overshoot.

## Features

- **Fetch preset curves**: Filter predefined easing curves by type
- **Bézier curves**: Create cubic Bézier curves with custom control points
- **Spring curves**: Physics-based spring curves with mass, stiffness, and damping
- **Bounce curves**: Animations with customizable bounce effects
- **Wiggle curves**: Oscillating motions with configurable intensity
- **Overshoot curves**: Curves that overshoot the target
- **Health Check**: Check API status

## Installation

```bash
# Clone the repository or create files
mkdir easing-wizard-mcp
cd easing-wizard-mcp

# Install dependencies
npm install

# Compile TypeScript
npm run build
```

## Setup

### 1. Project Structure

```
easing-wizard-mcp/
├── src/
│   └── index.ts          # Main server code
├── dist/                 # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md
```

### 2. Compile and Start

```bash
# Compile TypeScript
npm run build

# Start server
npm start

# Or use tsx directly for development
npm run dev
```

### 3. MCP Client Configuration

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "easing-wizard": {
      "command": "node",
      "args": ["/path/to/easing-wizard-mcp/dist/index.js"]
    }
  }
}
```

## Available Tools

### `get_presets`
Fetches available preset easing curves.

**Parameters:**
- `type` (optional): Filter by easing type (`BEZIER`, `SPRING`, `BOUNCE`, `WIGGLE`, `OVERSHOOT`)

**Example:**
```json
{
  "name": "get_presets",
  "arguments": {
    "type": "BEZIER"
  }
}
```

### `get_curve_by_id`
Fetches a specific easing curve by its ID.

**Parameters:**
- `id` (required): The ID of the easing curve

**Example:**
```json
{
  "name": "get_curve_by_id",
  "arguments": {
    "id": "0a0d.25e.1f.75g.914"
  }
}
```

### `create_bezier_curve`
Creates a custom Bézier curve.

**Parameters:**
- `x1` (0-1): First control point X coordinate
- `y1` (-1 to 2): First control point Y coordinate  
- `x2` (0-1): Second control point X coordinate
- `y2` (-1 to 2): Second control point Y coordinate

**Example:**
```json
{
  "name": "create_bezier_curve",
  "arguments": {
    "x1": 0.25,
    "y1": 0.1,
    "x2": 0.75,
    "y2": 0.9
  }
}
```

### `create_spring_curve`
Creates a spring curve with physical parameters.

**Parameters:**
- `mass` (1-5): Mass
- `stiffness` (0-100): Stiffness
- `damping` (0-100): Damping
- `accuracy`: Accuracy (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`)

**Example:**
```json
{
  "name": "create_spring_curve",
  "arguments": {
    "mass": 2.5,
    "stiffness": 50,
    "damping": 50,
    "accuracy": "HIGH"
  }
}
```

### `create_bounce_curve`
Creates a bounce curve.

**Parameters:**
- `bounces` (1-10): Number of bounces
- `damping` (0-100): Damping
- `accuracy`: Accuracy (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`)

### `create_wiggle_curve`
Creates a wiggle curve.

**Parameters:**
- `wiggles` (1-10): Number of oscillations
- `damping` (0-100): Damping
- `accuracy`: Accuracy (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`)

### `create_overshoot_curve`
Creates an overshoot curve.

**Parameters:**
- `style`: Animation style (`IN`, `OUT`, `IN_OUT`)
- `mass` (1-5): Mass
- `damping` (0-100): Damping
- `accuracy`: Accuracy (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`)

### `health_check`
Checks the status of the Easing Wizard API.

## Output Formats

All curve generation tools return structured data, including CSS and SVG outputs:

- **CSS**: `cubic-bezier()` or `linear()` functions
- **Tailwind CSS**: Compatible easing functions
- **SVG**: Paths or polylines for visualization
- **Metadata**: IDs, timestamps, links

## Error Handling

The server validates all input parameters and returns meaningful error messages:

- Parameter validation for ranges and types
- API errors with HTTP status codes
- MCP-compliant error responses

## Development

```bash
# Install dependencies
npm install

# Start development server (with auto-reload)
npm run dev

# Compile TypeScript
npm run build

# Start production server
npm start
```

## License

MIT

## Links

- [Easing Wizard Website](https://easingwizard.com)
- [Easing Wizard API](https://api.easingwizard.com/openapi)