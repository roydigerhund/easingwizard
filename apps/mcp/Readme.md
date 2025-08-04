# Easing Wizard MCP Server

A Model Context Protocol (MCP) server for the [Easing Wizard](https://easingwizard.com). This server enables AI assistants to generate various CSS easing curves: Bézier, Spring, Bounce, Wiggle, and Overshoot.

## Features

- **Preset curves**: Access predefined easing curves filtered by type
- **Bézier curves**: Create custom cubic Bézier curves with control points
- **Spring curves**: Physics-based spring animations with mass, stiffness, and damping
- **Bounce curves**: Bouncing animations with configurable bounces and damping
- **Wiggle curves**: Oscillating animations with configurable wiggles and damping
- **Overshoot curves**: Curves that overshoot the target before settling

## Setup

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "easingwizard": {
      "command": "npx",
      "args": ["@easingwizard/mcp-server"]
    }
  }
}
```

### VS Code

Add to your MCP configuration `.vscode/mcp.json`:

```json
{
  "servers": {
    "easingwizard": {
      "command": "npx",
      "args": ["@easingwizard/mcp-server"]
    }
  }
}
```

### Other MCP Clients

For other MCP-compatible applications, use the standard configuration format:

```json
{
  "mcpServers": {
    "easingwizard": {
      "command": "npx",
      "args": ["@easingwizard/mcp-server"]
    }
  }
}
```

## Available Tools

The MCP server provides the following tools for AI assistants:

### `getPresets`
Retrieves available preset easing curves, optionally filtered by type.

**Parameters:**
- `type` (optional): Filter by easing type (`BEZIER`, `SPRING`, `BOUNCE`, `WIGGLE`, `OVERSHOOT`)

**Example:**
```json
{
  "name": "getPresets",
  "arguments": {
    "type": "BEZIER"
  }
}
```

### `getCurveById`
Retrieves a specific easing curve by its unique ID.

**Parameters:**
- `id` (required): The unique ID of the easing curve

**Example:**
```json
{
  "name": "getCurveById",
  "arguments": {
    "id": "0a0d.25e.1f.75g.914"
  }
}
```

### `createBezierCurve`
Creates a custom cubic Bézier easing curve.

**Parameters:**
- `x1` (0-1): First control point X coordinate
- `y1` (-1 to 2): First control point Y coordinate  
- `x2` (0-1): Second control point X coordinate
- `y2` (-1 to 2): Second control point Y coordinate

**Example:**
```json
{
  "name": "createBezierCurve",
  "arguments": {
    "x1": 0.25,
    "y1": 0.1,
    "x2": 0.75,
    "y2": 0.9
  }
}
```

### `createSpringCurve`
Creates a spring-based easing curve with physics parameters.

**Parameters:**
- `mass` (1-5): Mass of the spring system
- `stiffness` (0-100): Spring stiffness
- `damping` (0-100): Damping force
- `accuracy` (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`): Calculation precision

**Example:**
```json
{
  "name": "createSpringCurve",
  "arguments": {
    "mass": 2.5,
    "stiffness": 50,
    "damping": 50,
    "accuracy": "HIGH"
  }
}
```

### `createBounceCurve`
Creates a bouncing easing curve.

**Parameters:**
- `bounces` (1-10): Number of bounces
- `damping` (0-100): Bounce damping
- `accuracy` (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`): Calculation precision

### `createWiggleCurve`
Creates an oscillating wiggle curve.

**Parameters:**
- `wiggles` (1-10): Number of oscillations
- `damping` (0-100): Oscillation damping
- `accuracy` (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`): Calculation precision

### `createOvershootCurve`
Creates an overshoot easing curve.

**Parameters:**
- `style` (`IN`, `OUT`, `IN_OUT`): Animation style
- `mass` (1-5): Mass parameter
- `damping` (0-100): Damping force
- `accuracy` (`LOW`, `MEDIUM`, `HIGH`, `ULTRA`): Calculation precision

## Output Formats

All easing curve tools return comprehensive data including:

- **CSS Functions**: Ready-to-use `cubic-bezier()` or `linear()` functions
- **Tailwind CSS**: Compatible easing class names
- **SVG Paths**: Vector graphics for curve visualization
- **Metadata**: Unique IDs, timestamps, and reference links

## Development

If you want to contribute or modify the server:

```bash
# Clone the repository
git clone https://github.com/roydigerhund/easingwizard.git
cd easingwizard/apps/mcp

# Install dependencies
pnpm install

# Build the server
pnpm build

# Test the server
pnpm watch

# Inspect the MCP tool
pnpm inspect
```

## Error Handling

The server provides detailed error messages for:

- Invalid parameter ranges or types
- Malformed curve configurations  
- MCP protocol errors
- Internal processing failures

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Website**: [Easing Wizard](https://easingwizard.com)
- **Repository**: [GitHub](https://github.com/roydigerhund/easingwizard)
- **Issues**: [Report bugs](https://github.com/roydigerhund/easingwizard/issues)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)