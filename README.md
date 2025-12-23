# Universal Map Component

An open-source, framework-agnostic map component that provides a unified interface for rendering 2D and 3D geospatial data across multiple map providers and rendering engines.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Features

- **Multi-Provider Support** - Switch seamlessly between Google Maps, OpenStreetMap, Mapbox, and more
- **3D Visualization** - Built-in support for Cesium, Google 3D Buildings, and OSM 3D data
- **Unified API** - Same interface for GeoJSON, 3D tiles, heatmaps, and vector layers
- **Powered by deck.gl** - High-performance WebGL rendering for large datasets
- **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- **Mock Data Included** - Start developing immediately with built-in sample datasets (no API keys required)
- **TypeScript First** - Full type definitions included
- **Open Source** - MIT licensed

## Quick Start

### Installation

```bash
npm install universal-map-component
# or
yarn add universal-map-component
```

### Basic Usage (with Mock Data - No API Keys Required!)

```typescript
import { UniversalMap } from 'universal-map-component';

// Create a map with mock provider and sample data
const map = new UniversalMap({
  provider: 'mock',
  container: 'map-container',
  mockData: 'cities-sample',
  center: [40.7128, -74.0060], // NYC
  zoom: 10
});

// Add a heatmap layer
map.addLayer({
  id: 'population-density',
  type: 'heatmap',
  source: MockDatasets.populationDensity
});
```

### Usage with Real Providers

```typescript
// Google Maps
const map = new UniversalMap({
  provider: 'google',
  apiKey: 'YOUR_API_KEY',
  container: 'map-container',
  center: [40.7128, -74.0060],
  zoom: 10
});

// Add 3D buildings
map.addLayer({
  id: 'buildings-3d',
  type: '3d-tiles',
  source: 'google://3d-buildings'
});
```

### Framework Integration

#### React

```tsx
import { UniversalMap } from 'universal-map-component/react';

function App() {
  return (
    <UniversalMap
      provider="mock"
      mockData="cities-sample"
      layers={[
        { id: 'heatmap', type: 'heatmap', source: MockDatasets.traffic }
      ]}
    />
  );
}
```

#### Vue

```vue
<template>
  <universal-map
    provider="mock"
    :mockData="'cities-sample'"
    :layers="layers"
  />
</template>

<script>
import { UniversalMap } from 'universal-map-component/vue';

export default {
  components: { UniversalMap },
  data() {
    return {
      layers: [
        { id: 'heatmap', type: 'heatmap', source: MockDatasets.traffic }
      ]
    };
  }
};
</script>
```

## Architecture

```
┌─────────────────────────────────────────────┐
│      Unified Map Component API               │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼─────────┐
│  Base Map      │    │  Visualization   │
│  Providers     │    │  (deck.gl)       │
│                │    │                  │
│ - Google Maps  │    │ - GeoJSON        │
│ - OSM          │    │ - 3D Tiles       │
│ - Mapbox       │    │ - Heatmaps       │
│ - Mock/Demo    │    │ - Vector Layers  │
└────────────────┘    └──────────────────┘
```

## Sample Data

The component includes built-in mock services and sample datasets:

- **GeoJSON**: World cities, country boundaries, flight routes, POIs
- **3D Tiles**: Building datasets (NYC, SF, Tokyo), terrain data
- **Heatmaps**: Population density, weather, traffic patterns
- **Vector Tiles**: Multi-zoom level samples

Perfect for:
- Development without API keys
- Testing and prototyping
- Offline development
- Demo applications

## Documentation

- [Getting Started Guide](docs/getting-started.md)
- [API Reference](docs/api-reference.md)
- [Examples](examples/)
- [Migration Guides](docs/migration/)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run linter
npm run lint
```

## Project Structure

```
universal-map-component/
├── src/
│   ├── core/           # Core API and types
│   ├── providers/      # Map provider implementations
│   ├── layers/         # Data layer adapters
│   └── mock/           # Mock services and sample data
├── examples/           # Example applications
├── docs/              # Documentation
├── tests/             # Test suites
└── spec.md            # Project specification
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Requirements**: WebGL 2.0 support

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) file for details

## Roadmap

### Current (v0.1)
- Core API and provider abstraction
- Mock provider with sample data
- Google Maps and OSM support
- Basic deck.gl integration

### v0.2
- Mapbox provider
- Cesium 3D support
- React/Vue/Angular wrappers
- Comprehensive examples

### v0.3
- Advanced 3D features
- Custom tile server support
- Performance optimizations
- Extended documentation

## Support

- [GitHub Issues](https://github.com/yourusername/universal-map-component/issues)
- [Discussions](https://github.com/yourusername/universal-map-component/discussions)
- [Documentation](https://universal-map-component.dev)

---

Made with ❤️ by the Universal Map Component team
