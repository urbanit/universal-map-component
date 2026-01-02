/**
 * Configuration utilities and constants
 */

import type { MapConfig, ViewState, LayerStyle } from './types';

/**
 * Default map configuration
 */
export const DEFAULT_MAP_CONFIG: Partial<MapConfig> = {
  zoom: 2,
  center: [0, 0],
  projection: 'mercator',
  enable3D: false,
};

/**
 * Default view state
 */
export const DEFAULT_VIEW_STATE: ViewState = {
  center: [0, 0],
  zoom: 2,
  bearing: 0,
  pitch: 0,
};

/**
 * Default layer style
 */
export const DEFAULT_LAYER_STYLE: LayerStyle = {
  fillColor: '#3388ff',
  strokeColor: '#ffffff',
  strokeWidth: 1,
  opacity: 1,
  radius: 5,
};

/**
 * Zoom level constants
 */
export const ZOOM_LEVELS = {
  WORLD: 2,
  CONTINENT: 4,
  COUNTRY: 6,
  REGION: 8,
  CITY: 10,
  DISTRICT: 12,
  STREET: 14,
  BUILDING: 16,
  MAX: 22,
  MIN: 0,
} as const;

/**
 * Common map projections
 */
export const PROJECTIONS = {
  MERCATOR: 'mercator',
  GLOBE: 'globe',
  EQUIRECTANGULAR: 'equirectangular',
} as const;

/**
 * Merge configurations with defaults
 */
export function mergeConfig(
  userConfig: MapConfig,
  defaults: Partial<MapConfig> = DEFAULT_MAP_CONFIG
): MapConfig {
  return {
    ...defaults,
    ...userConfig,
  };
}

/**
 * Merge view states
 */
export function mergeViewState(
  userViewState: Partial<ViewState>,
  defaults: ViewState = DEFAULT_VIEW_STATE
): ViewState {
  return {
    ...defaults,
    ...userViewState,
  };
}

/**
 * Merge layer styles
 */
export function mergeLayerStyle(
  userStyle: LayerStyle = {},
  defaults: LayerStyle = DEFAULT_LAYER_STYLE
): LayerStyle {
  return {
    ...defaults,
    ...userStyle,
  };
}

/**
 * Validate zoom level
 */
export function validateZoom(zoom: number): number {
  return Math.max(ZOOM_LEVELS.MIN, Math.min(ZOOM_LEVELS.MAX, zoom));
}

/**
 * Validate opacity
 */
export function validateOpacity(opacity: number): number {
  return Math.max(0, Math.min(1, opacity));
}

/**
 * Validate bearing (0-360)
 */
export function validateBearing(bearing: number): number {
  return ((bearing % 360) + 360) % 360;
}

/**
 * Validate pitch (0-60)
 */
export function validatePitch(pitch: number): number {
  return Math.max(0, Math.min(60, pitch));
}

/**
 * Configuration builder for fluent API
 */
export class MapConfigBuilder {
  private config: Partial<MapConfig> = {};

  provider(provider: MapConfig['provider']): this {
    this.config.provider = provider;
    return this;
  }

  container(container: string | HTMLElement): this {
    this.config.container = container;
    return this;
  }

  center(lat: number, lng: number): this {
    this.config.center = [lat, lng];
    return this;
  }

  zoom(zoom: number): this {
    this.config.zoom = validateZoom(zoom);
    return this;
  }

  apiKey(apiKey: string): this {
    this.config.apiKey = apiKey;
    return this;
  }

  projection(projection: MapConfig['projection']): this {
    this.config.projection = projection;
    return this;
  }

  enable3D(enable: boolean = true): this {
    this.config.enable3D = enable;
    return this;
  }

  mockData(preset: string): this {
    this.config.mockData = preset;
    return this;
  }

  providerOptions(options: Record<string, unknown>): this {
    this.config.providerOptions = options;
    return this;
  }

  build(): MapConfig {
    if (!this.config.provider) {
      throw new Error('Provider is required');
    }
    if (!this.config.container) {
      throw new Error('Container is required');
    }
    return mergeConfig(this.config as MapConfig);
  }
}

/**
 * Create a map configuration builder
 */
export function configBuilder(): MapConfigBuilder {
  return new MapConfigBuilder();
}
