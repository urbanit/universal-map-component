/**
 * Map Provider Interface
 * All map providers must implement this interface
 */

import type {
  MapConfig,
  ViewState,
  LayerConfig,
  MapEventType,
  MapEventHandler,
  CameraOptions,
  BoundingBox,
  ProviderCapabilities,
} from './types';

/**
 * Base interface that all map providers must implement
 */
export interface IMapProvider {
  /**
   * Provider name
   */
  readonly name: string;

  /**
   * Provider capabilities
   */
  readonly capabilities: ProviderCapabilities;

  /**
   * Initialize the map provider
   * @param config Map configuration
   */
  initialize(config: MapConfig): Promise<void>;

  /**
   * Destroy the map instance and clean up resources
   */
  destroy(): void;

  /**
   * Get the current view state
   */
  getViewState(): ViewState;

  /**
   * Set the view state
   * @param viewState New view state
   * @param options Animation options
   */
  setViewState(viewState: Partial<ViewState>, options?: CameraOptions): void;

  /**
   * Get the current bounding box
   */
  getBounds(): BoundingBox;

  /**
   * Fit the map to the given bounds
   * @param bounds Bounding box
   * @param options Animation options
   */
  fitBounds(bounds: BoundingBox, options?: CameraOptions): void;

  /**
   * Add a layer to the map
   * @param layer Layer configuration
   */
  addLayer(layer: LayerConfig): void;

  /**
   * Remove a layer from the map
   * @param layerId Layer ID
   */
  removeLayer(layerId: string): void;

  /**
   * Update a layer
   * @param layerId Layer ID
   * @param updates Partial layer configuration
   */
  updateLayer(layerId: string, updates: Partial<LayerConfig>): void;

  /**
   * Get a layer by ID
   * @param layerId Layer ID
   */
  getLayer(layerId: string): LayerConfig | undefined;

  /**
   * Get all layers
   */
  getLayers(): LayerConfig[];

  /**
   * Set layer visibility
   * @param layerId Layer ID
   * @param visible Visibility state
   */
  setLayerVisibility(layerId: string, visible: boolean): void;

  /**
   * Set layer opacity
   * @param layerId Layer ID
   * @param opacity Opacity value (0-1)
   */
  setLayerOpacity(layerId: string, opacity: number): void;

  /**
   * Add an event listener
   * @param eventType Event type
   * @param handler Event handler
   */
  on(eventType: MapEventType, handler: MapEventHandler): void;

  /**
   * Remove an event listener
   * @param eventType Event type
   * @param handler Event handler
   */
  off(eventType: MapEventType, handler: MapEventHandler): void;

  /**
   * Trigger a resize event (useful when container size changes)
   */
  resize(): void;

  /**
   * Get the underlying map instance (provider-specific)
   * Use with caution - breaks abstraction
   */
  getMapInstance(): unknown;

  /**
   * Check if the provider is ready
   */
  isReady(): boolean;
}

/**
 * Abstract base class for map providers
 * Provides common functionality and enforces interface implementation
 */
export abstract class BaseMapProvider implements IMapProvider {
  abstract readonly name: string;
  abstract readonly capabilities: ProviderCapabilities;

  protected config?: MapConfig;
  protected container?: HTMLElement;
  protected layers: Map<string, LayerConfig> = new Map();
  protected eventHandlers: Map<MapEventType, Set<MapEventHandler>> = new Map();
  protected ready: boolean = false;

  abstract initialize(config: MapConfig): Promise<void>;
  abstract destroy(): void;
  abstract getViewState(): ViewState;
  abstract setViewState(viewState: Partial<ViewState>, options?: CameraOptions): void;
  abstract getBounds(): BoundingBox;
  abstract fitBounds(bounds: BoundingBox, options?: CameraOptions): void;
  abstract addLayer(layer: LayerConfig): void;
  abstract removeLayer(layerId: string): void;
  abstract updateLayer(layerId: string, updates: Partial<LayerConfig>): void;
  abstract resize(): void;
  abstract getMapInstance(): unknown;

  /**
   * Get a layer by ID
   */
  getLayer(layerId: string): LayerConfig | undefined {
    return this.layers.get(layerId);
  }

  /**
   * Get all layers
   */
  getLayers(): LayerConfig[] {
    return Array.from(this.layers.values());
  }

  /**
   * Set layer visibility
   */
  setLayerVisibility(layerId: string, visible: boolean): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      this.updateLayer(layerId, { visible });
    }
  }

  /**
   * Set layer opacity
   */
  setLayerOpacity(layerId: string, opacity: number): void {
    const layer = this.layers.get(layerId);
    if (layer) {
      this.updateLayer(layerId, { opacity });
    }
  }

  /**
   * Add an event listener
   */
  on(eventType: MapEventType, handler: MapEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);
  }

  /**
   * Remove an event listener
   */
  off(eventType: MapEventType, handler: MapEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Emit an event to all registered handlers
   */
  protected emit(eventType: MapEventType, event: unknown): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => handler(event as any));
    }
  }

  /**
   * Check if the provider is ready
   */
  isReady(): boolean {
    return this.ready;
  }

  /**
   * Resolve container element from string or HTMLElement
   */
  protected resolveContainer(container: string | HTMLElement): HTMLElement {
    if (typeof container === 'string') {
      const element = document.getElementById(container);
      if (!element) {
        throw new Error(`Container element with id "${container}" not found`);
      }
      return element;
    }
    return container;
  }

  /**
   * Validate configuration
   */
  protected validateConfig(config: MapConfig): void {
    if (!config.container) {
      throw new Error('Container is required');
    }

    if (this.capabilities.requiresApiKey && !config.apiKey) {
      throw new Error(`API key is required for ${this.name} provider`);
    }

    if (config.enable3D && !this.capabilities.supports3D) {
      console.warn(`3D mode is not supported by ${this.name} provider`);
    }
  }
}
