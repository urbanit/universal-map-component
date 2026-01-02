/**
 * Layer interface and base implementations
 */

import type { LayerConfig, LayerType, DataSource, LayerStyle } from './types';

/**
 * Layer interface
 */
export interface ILayer {
  /** Unique layer ID */
  readonly id: string;

  /** Layer type */
  readonly type: LayerType;

  /** Layer configuration */
  config: LayerConfig;

  /**
   * Update layer style
   */
  setStyle(style: Partial<LayerStyle>): void;

  /**
   * Set layer visibility
   */
  setVisible(visible: boolean): void;

  /**
   * Set layer opacity
   */
  setOpacity(opacity: number): void;

  /**
   * Get layer data source
   */
  getSource(): DataSource | string;

  /**
   * Update layer data source
   */
  setSource(source: DataSource | string): void;

  /**
   * Destroy the layer and clean up resources
   */
  destroy(): void;
}

/**
 * Abstract base layer implementation
 */
export abstract class BaseLayer implements ILayer {
  readonly id: string;
  readonly type: LayerType;
  config: LayerConfig;

  constructor(config: LayerConfig) {
    this.id = config.id;
    this.type = config.type;
    this.config = config;
    this.validateConfig();
  }

  /**
   * Validate layer configuration
   */
  protected validateConfig(): void {
    if (!this.config.id) {
      throw new Error('Layer ID is required');
    }
    if (!this.config.type) {
      throw new Error('Layer type is required');
    }
    if (!this.config.source) {
      throw new Error('Layer source is required');
    }
  }

  /**
   * Update layer style
   */
  setStyle(style: Partial<LayerStyle>): void {
    this.config.style = {
      ...this.config.style,
      ...style,
    };
  }

  /**
   * Set layer visibility
   */
  setVisible(visible: boolean): void {
    this.config.visible = visible;
  }

  /**
   * Set layer opacity
   */
  setOpacity(opacity: number): void {
    if (opacity < 0 || opacity > 1) {
      throw new Error('Opacity must be between 0 and 1');
    }
    this.config.opacity = opacity;
  }

  /**
   * Get layer data source
   */
  getSource(): DataSource | string {
    return this.config.source;
  }

  /**
   * Update layer data source
   */
  setSource(source: DataSource | string): void {
    this.config.source = source;
  }

  /**
   * Destroy the layer
   */
  abstract destroy(): void;
}

/**
 * Layer factory to create appropriate layer instances
 */
export class LayerFactory {
  /**
   * Create a layer instance based on layer type
   */
  static createLayer(config: LayerConfig): ILayer {
    // For now, return a generic layer
    // In the future, this will create type-specific layers
    return new GenericLayer(config);
  }

  /**
   * Validate layer configuration
   */
  static validateLayerConfig(config: LayerConfig): void {
    if (!config.id) {
      throw new Error('Layer ID is required');
    }
    if (!config.type) {
      throw new Error('Layer type is required');
    }
    if (!config.source) {
      throw new Error('Layer source is required');
    }
  }
}

/**
 * Generic layer implementation
 */
class GenericLayer extends BaseLayer {
  destroy(): void {
    // Clean up resources
  }
}

/**
 * Layer manager to handle multiple layers
 */
export class LayerManager {
  private layers: Map<string, ILayer> = new Map();

  /**
   * Add a layer
   */
  addLayer(config: LayerConfig): ILayer {
    if (this.layers.has(config.id)) {
      throw new Error(`Layer with id "${config.id}" already exists`);
    }

    const layer = LayerFactory.createLayer(config);
    this.layers.set(config.id, layer);
    return layer;
  }

  /**
   * Remove a layer
   */
  removeLayer(layerId: string): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      layer.destroy();
      this.layers.delete(layerId);
    }
  }

  /**
   * Get a layer by ID
   */
  getLayer(layerId: string): ILayer | undefined {
    return this.layers.get(layerId);
  }

  /**
   * Get all layers
   */
  getAllLayers(): ILayer[] {
    return Array.from(this.layers.values());
  }

  /**
   * Update a layer
   */
  updateLayer(layerId: string, updates: Partial<LayerConfig>): void {
    const layer = this.layers.get(layerId);
    if (!layer) {
      throw new Error(`Layer with id "${layerId}" not found`);
    }

    if (updates.style) {
      layer.setStyle(updates.style);
    }
    if (updates.visible !== undefined) {
      layer.setVisible(updates.visible);
    }
    if (updates.opacity !== undefined) {
      layer.setOpacity(updates.opacity);
    }
    if (updates.source) {
      layer.setSource(updates.source);
    }

    // Update other properties
    layer.config = {
      ...layer.config,
      ...updates,
    };
  }

  /**
   * Clear all layers
   */
  clear(): void {
    this.layers.forEach((layer) => layer.destroy());
    this.layers.clear();
  }

  /**
   * Check if a layer exists
   */
  hasLayer(layerId: string): boolean {
    return this.layers.has(layerId);
  }

  /**
   * Get layer count
   */
  getLayerCount(): number {
    return this.layers.size;
  }
}
