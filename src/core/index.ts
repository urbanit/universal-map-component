/**
 * Core API exports
 */

// Main class
export { UniversalMap, createMap } from './UniversalMap';

// Types
export type {
  Coordinates,
  Coordinates3D,
  BoundingBox,
  ZoomLevel,
  MapProvider,
  ProjectionType,
  LayerType,
  DataSourceType,
  ViewState,
  MapConfig,
  LayerStyle,
  DataSource,
  LayerConfig,
  MapEventType,
  MapEvent,
  MapEventHandler,
  CameraOptions,
  FeatureProperties,
  ProviderCapabilities,
} from './types';

export { MapError } from './types';

// Provider interfaces
export type { IMapProvider } from './provider';
export { BaseMapProvider } from './provider';

// Layer interfaces
export type { ILayer } from './layer';
export { BaseLayer, LayerFactory, LayerManager } from './layer';

// Data source interfaces
export type { IDataSource } from './data-source';
export {
  BaseDataSource,
  GeoJSONDataSource,
  URLDataSource,
  TileDataSource,
  ThreeDTilesDataSource,
  MockDataSource,
  DataSourceFactory,
  DataSourceManager,
} from './data-source';

// Events
export { EventEmitter, createMapEvent } from './events';

// Configuration
export {
  DEFAULT_MAP_CONFIG,
  DEFAULT_VIEW_STATE,
  DEFAULT_LAYER_STYLE,
  ZOOM_LEVELS,
  PROJECTIONS,
  mergeConfig,
  mergeViewState,
  mergeLayerStyle,
  validateZoom,
  validateOpacity,
  validateBearing,
  validatePitch,
  MapConfigBuilder,
  configBuilder,
} from './config';
