/**
 * Data source utilities and handlers
 */

import type { GeoJSON } from 'geojson';
import type { DataSource, DataSourceType } from './types';

/**
 * Data source interface
 */
export interface IDataSource {
  /** Source type */
  readonly type: DataSourceType;

  /** Source configuration */
  config: DataSource;

  /**
   * Load and return the data
   */
  load(): Promise<unknown>;

  /**
   * Check if source is loaded
   */
  isLoaded(): boolean;

  /**
   * Destroy and clean up resources
   */
  destroy(): void;
}

/**
 * Abstract base data source
 */
export abstract class BaseDataSource implements IDataSource {
  readonly type: DataSourceType;
  config: DataSource;
  protected loaded: boolean = false;
  protected data: unknown = null;

  constructor(config: DataSource) {
    this.type = config.type;
    this.config = config;
  }

  abstract load(): Promise<unknown>;

  isLoaded(): boolean {
    return this.loaded;
  }

  destroy(): void {
    this.data = null;
    this.loaded = false;
  }
}

/**
 * GeoJSON data source
 */
export class GeoJSONDataSource extends BaseDataSource {
  constructor(config: DataSource) {
    super(config);
    if (config.type !== 'geojson') {
      throw new Error('Invalid data source type for GeoJSONDataSource');
    }
  }

  async load(): Promise<GeoJSON> {
    if (this.loaded && this.data) {
      return this.data as GeoJSON;
    }

    if (typeof this.config.data === 'string') {
      // Load from URL
      const response = await fetch(this.config.data);
      if (!response.ok) {
        throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
      }
      this.data = await response.json();
    } else if (this.config.data) {
      // Use inline data
      this.data = this.config.data;
    } else {
      throw new Error('GeoJSON data or URL is required');
    }

    this.loaded = true;
    return this.data as GeoJSON;
  }
}

/**
 * URL data source (generic)
 */
export class URLDataSource extends BaseDataSource {
  constructor(config: DataSource) {
    super(config);
    if (config.type !== 'url') {
      throw new Error('Invalid data source type for URLDataSource');
    }
  }

  async load(): Promise<unknown> {
    if (this.loaded && this.data) {
      return this.data;
    }

    if (!this.config.url) {
      throw new Error('URL is required for URLDataSource');
    }

    const response = await fetch(this.config.url);
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }

    this.data = await response.json();
    this.loaded = true;
    return this.data;
  }
}

/**
 * Tile data source (for raster/vector tiles)
 */
export class TileDataSource extends BaseDataSource {
  constructor(config: DataSource) {
    super(config);
    if (config.type !== 'tiles') {
      throw new Error('Invalid data source type for TileDataSource');
    }
  }

  async load(): Promise<string> {
    if (!this.config.url) {
      throw new Error('Tile URL template is required');
    }

    // For tile sources, we just validate and return the URL template
    // Actual tile loading is handled by the map provider
    this.loaded = true;
    this.data = this.config.url;
    return this.config.url;
  }
}

/**
 * 3D Tiles data source
 */
export class ThreeDTilesDataSource extends BaseDataSource {
  constructor(config: DataSource) {
    super(config);
    if (config.type !== '3d-tiles') {
      throw new Error('Invalid data source type for ThreeDTilesDataSource');
    }
  }

  async load(): Promise<string> {
    if (!this.config.url) {
      throw new Error('3D Tiles tileset URL is required');
    }

    // Validate tileset URL (basic check)
    if (!this.config.url.endsWith('.json') && !this.config.url.includes('tileset')) {
      console.warn('3D Tiles URL should typically point to a tileset.json file');
    }

    this.loaded = true;
    this.data = this.config.url;
    return this.config.url;
  }
}

/**
 * Mock data source (for development/testing)
 */
export class MockDataSource extends BaseDataSource {
  constructor(config: DataSource) {
    super(config);
    if (config.type !== 'mock') {
      throw new Error('Invalid data source type for MockDataSource');
    }
  }

  async load(): Promise<unknown> {
    // Mock data is provided inline
    this.data = this.config.data || { type: 'FeatureCollection', features: [] };
    this.loaded = true;
    return this.data;
  }
}

/**
 * Data source factory
 */
export class DataSourceFactory {
  /**
   * Create appropriate data source instance based on type
   */
  static createDataSource(config: DataSource): IDataSource {
    switch (config.type) {
      case 'geojson':
        return new GeoJSONDataSource(config);
      case 'url':
        return new URLDataSource(config);
      case 'tiles':
        return new TileDataSource(config);
      case '3d-tiles':
        return new ThreeDTilesDataSource(config);
      case 'mock':
        return new MockDataSource(config);
      default:
        throw new Error(`Unsupported data source type: ${config.type}`);
    }
  }

  /**
   * Normalize source input to DataSource config
   */
  static normalizeSource(source: DataSource | string | GeoJSON): DataSource {
    if (typeof source === 'string') {
      // String can be URL or mock source
      if (source.startsWith('mock://')) {
        return {
          type: 'mock',
          data: source,
        };
      }
      // Assume it's a URL
      return {
        type: 'url',
        url: source,
      };
    }

    if ('type' in source && source.type) {
      // Already a DataSource config
      return source as DataSource;
    }

    // Assume it's inline GeoJSON
    return {
      type: 'geojson',
      data: source,
    };
  }
}

/**
 * Data source manager
 */
export class DataSourceManager {
  private sources: Map<string, IDataSource> = new Map();

  /**
   * Register a data source
   */
  registerSource(id: string, config: DataSource): IDataSource {
    const source = DataSourceFactory.createDataSource(config);
    this.sources.set(id, source);
    return source;
  }

  /**
   * Get a data source
   */
  getSource(id: string): IDataSource | undefined {
    return this.sources.get(id);
  }

  /**
   * Remove a data source
   */
  removeSource(id: string): void {
    const source = this.sources.get(id);
    if (source) {
      source.destroy();
      this.sources.delete(id);
    }
  }

  /**
   * Clear all data sources
   */
  clear(): void {
    this.sources.forEach((source) => source.destroy());
    this.sources.clear();
  }

  /**
   * Load a data source
   */
  async loadSource(id: string): Promise<unknown> {
    const source = this.sources.get(id);
    if (!source) {
      throw new Error(`Data source "${id}" not found`);
    }
    return source.load();
  }
}
