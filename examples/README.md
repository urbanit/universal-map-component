# Universal Map Component - Examples

This directory contains interactive examples demonstrating the Universal Map Component with different providers and features.

## Running Examples

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in the project root:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your API keys:
     ```env
     VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```
   - **Note:** The `VITE_` prefix is required for Vite to expose variables to client-side code

### Start the Dev Server

```bash
npm run examples
```

This will start a Vite development server at `http://localhost:3000`

## Available Examples

### Google Maps Basic
**File:** `google-maps-basic.html`
**URL:** http://localhost:3000/google-maps-basic.html

A comprehensive example demonstrating:
- Basic map initialization with Google Maps provider
- Interactive controls (center, zoom)
- Quick navigation to major cities
- Event handling (click, zoom, pan)
- GeoJSON marker layer
- Real-time event logging
- 3D mode support

**Features:**
- ✅ Map controls sidebar
- ✅ Quick location buttons
- ✅ Event log viewer
- ✅ Status indicators
- ✅ Responsive layout

## Example Structure

Each example is a standalone HTML file that:
1. Imports the Universal Map Component from source
2. Initializes a map with specific provider and configuration
3. Demonstrates various features and capabilities
4. Provides interactive UI for testing

## Development

The examples use Vite for development, which provides:
- TypeScript support
- Hot module replacement
- Fast refresh
- Automatic dependency resolution

You can modify the source code in `src/` and see changes reflected immediately in the examples.

## Adding New Examples

To add a new example:

1. Create a new HTML file in this directory
2. Follow the structure of existing examples
3. Import and use the Universal Map Component
4. Document the example in this README

## Security

### API Key Management
- **Never commit `.env` files** - They are automatically excluded by `.gitignore`
- Use `.env.example` as a template to document required variables
- API keys with `VITE_` prefix are exposed to client-side code
- For production, consider:
  - Using server-side proxy for API requests
  - Implementing API key restrictions (domain, IP, rate limiting)
  - Using environment-specific keys

## Troubleshooting

### Map doesn't load
- Check that your API key is valid and has the necessary permissions
- Verify `.env` file exists and contains the correct key with `VITE_` prefix
- Restart the dev server after changing `.env` file
- Check browser console for errors

### TypeScript errors
- Ensure all dependencies are installed: `npm install`
- Check that source files in `src/` are valid

### Dev server issues
- Make sure port 3000 is available
- Try restarting the dev server
- Check for error messages in the terminal
