/**
 * Core type definitions for Universal Map Component
 */

import type { GeoJSON } from 'geojson';

/**
 * Geographic coordinates [latitude, longitude]
 */
export type Coordinates = [number, number];

/**
 * Geographic coordinates with optional altitude [latitude, longitude, altitude?]
 */
export type Coordinates3D = [number, number, number?];

/**
 * Bounding box [west, south, east, north]
 */
export type BoundingBox = [number, number, number, number];

/**
 * Zoom level (0-22 typical range)
 */
export type ZoomLevel = number;

/**
 * Supported map providers
 */
export type MapProvider = 'google' | 'osm' | 'mapbox' | 'cesium' | 'mock';

/**
 * Map projection types
 */
export type ProjectionType = 'mercator' | 'globe' | 'equirectangular';

/**
 * Layer types supported by the component
 */
export type LayerType =
  | 'geojson'
  | 'heatmap'
  | '3d-tiles'
  | 'vector-tiles'
  | 'raster-tiles'
  | 'points'
  | 'lines'
  | 'polygons'
  | 'markers'
  | 'custom';

/**
 * Data source types
 */
export type DataSourceType =
  | 'geojson'
  | 'url'
  | 'tiles'
  | '3d-tiles'
  | 'mock'
  | 'custom';

/**
 * Map view state
 */
export interface ViewState {
  /** Center coordinates [lat, lng] */
  center: Coordinates;
  /** Zoom level */
  zoom: ZoomLevel;
  /** Bearing/rotation in degrees (0-360) */
  bearing?: number;
  /** Pitch/tilt in degrees (0-60) */
  pitch?: number;
}

/**
 * Map configuration options
 */
export interface MapConfig {
  /** Map provider to use */
  provider: MapProvider;
  /** Container element ID or HTMLElement */
  container: string | HTMLElement;
  /** Initial view state */
  viewState?: ViewState;
  /** Initial center (alternative to viewState) */
  center?: Coordinates;
  /** Initial zoom (alternative to viewState) */
  zoom?: ZoomLevel;
  /** API key for the provider (if required) */
  apiKey?: string;
  /** Projection type */
  projection?: ProjectionType;
  /** Enable 3D mode */
  enable3D?: boolean;
  /** Mock data preset (for mock provider) */
  mockData?: string;
  /** Custom options for specific providers */
  providerOptions?: Record<string, unknown>;
}

/**
 * Layer style configuration
 */
export interface LayerStyle {
  /** Fill color (hex, rgb, rgba) */
  fillColor?: string;
  /** Stroke/border color */
  strokeColor?: string;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Point radius in pixels */
  radius?: number;
  /** Extrusion height for 3D */
  extrusionHeight?: number;
  /** Custom style properties */
  [key: string]: unknown;
}

/**
 * Data source definition
 */
export interface DataSource {
  /** Source type */
  type: DataSourceType;
  /** Data URL or inline data */
  data?: string | GeoJSON | unknown;
  /** Tile URL template (for tile sources) */
  url?: string;
  /** Additional source options */
  options?: Record<string, unknown>;
}

/**
 * Layer configuration
 */
export interface LayerConfig {
  /** Unique layer ID */
  id: string;
  /** Layer type */
  type: LayerType;
  /** Data source */
  source: DataSource | string | GeoJSON;
  /** Layer style */
  style?: LayerStyle;
  /** Layer visibility */
  visible?: boolean;
  /** Layer opacity (0-1) */
  opacity?: number;
  /** Min zoom level for layer visibility */
  minZoom?: number;
  /** Max zoom level for layer visibility */
  maxZoom?: number;
  /** Layer-specific options */
  options?: Record<string, unknown>;
}

/**
 * Map event types
 */
export type MapEventType =
  | 'load'
  | 'click'
  | 'dblclick'
  | 'mousemove'
  | 'mouseenter'
  | 'mouseleave'
  | 'contextmenu'
  | 'zoom'
  | 'move'
  | 'movestart'
  | 'moveend'
  | 'zoomstart'
  | 'zoomend'
  | 'rotate'
  | 'pitch'
  | 'error';

/**
 * Map event data
 */
export interface MapEvent {
  /** Event type */
  type: MapEventType;
  /** Target map instance */
  target: unknown;
  /** Original event */
  originalEvent?: Event;
  /** Geographic coordinates at event location */
  lngLat?: Coordinates;
  /** Screen coordinates */
  point?: [number, number];
  /** Features at event location */
  features?: unknown[];
}

/**
 * Map event handler
 */
export type MapEventHandler = (event: MapEvent) => void;

/**
 * Camera animation options
 */
export interface CameraOptions {
  /** Target center */
  center?: Coordinates;
  /** Target zoom */
  zoom?: ZoomLevel;
  /** Target bearing */
  bearing?: number;
  /** Target pitch */
  pitch?: number;
  /** Animation duration in ms */
  duration?: number;
  /** Easing function */
  easing?: (t: number) => number;
}

/**
 * Feature properties type (for GeoJSON features)
 */
export type FeatureProperties = Record<string, unknown>;

/**
 * Error types
 */
export class MapError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'MapError';
  }
}

/**
 * Provider capabilities
 */
export interface ProviderCapabilities {
  /** Supports 3D rendering */
  supports3D: boolean;
  /** Supports vector tiles */
  supportsVectorTiles: boolean;
  /** Supports 3D tiles */
  supports3DTiles: boolean;
  /** Supports custom projections */
  supportsCustomProjections: boolean;
  /** Supports terrain/elevation */
  supportsTerrain: boolean;
  /** Requires API key */
  requiresApiKey: boolean;
}
