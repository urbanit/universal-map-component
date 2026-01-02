/**
 * UniversalMap - Main entry point for the map component
 */

import type {
  MapConfig,
  ViewState,
  LayerConfig,
  MapEventType,
  MapEventHandler,
  CameraOptions,
  BoundingBox,
  Coordinates,
} from './types';
import type { IMapProvider } from './provider';
import { EventEmitter } from './events';
import { MapError } from './types';

/**
 * Main UniversalMap class
 * Provides a unified interface for working with different map providers
 */
export class UniversalMap {
  private provider?: IMapProvider;
  private config: MapConfig;
  private eventEmitter: EventEmitter;
  private initialized: boolean = false;

  constructor(config: MapConfig) {
    this.config = config;
    this.eventEmitter = new EventEmitter();
    this.validateConfig(config);
  }

  /**
   * Initialize the map
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('Map is already initialized');
      return;
    }

    try {
      this.provider = await this.createProvider(this.config.provider);
      await this.provider.initialize(this.config);
      this.initialized = true;

      // Forward provider events to our event emitter
      this.setupEventForwarding();

      this.eventEmitter.emit('load', {
        type: 'load',
        target: this,
      });
    } catch (error) {
      throw new MapError(
        `Failed to initialize map: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'INIT_ERROR',
        error
      );
    }
  }

  /**
   * Destroy the map and clean up resources
   */
  destroy(): void {
    if (this.provider) {
      this.provider.destroy();
      this.provider = undefined;
    }
    this.eventEmitter.removeAllListeners();
    this.initialized = false;
  }

  /**
   * Get the current view state
   */
  getViewState(): ViewState {
    this.ensureInitialized();
    return this.provider!.getViewState();
  }

  /**
   * Set the view state
   */
  setViewState(viewState: Partial<ViewState>, options?: CameraOptions): void {
    this.ensureInitialized();
    this.provider!.setViewState(viewState, options);
  }

  /**
   * Set the map center
   */
  setCenter(center: Coordinates, options?: CameraOptions): void {
    this.setViewState({ center }, options);
  }

  /**
   * Set the zoom level
   */
  setZoom(zoom: number, options?: CameraOptions): void {
    this.setViewState({ zoom }, options);
  }

  /**
   * Get the current bounding box
   */
  getBounds(): BoundingBox {
    this.ensureInitialized();
    return this.provider!.getBounds();
  }

  /**
   * Fit the map to the given bounds
   */
  fitBounds(bounds: BoundingBox, options?: CameraOptions): void {
    this.ensureInitialized();
    this.provider!.fitBounds(bounds, options);
  }

  /**
   * Add a layer to the map
   */
  addLayer(layer: LayerConfig): void {
    this.ensureInitialized();
    this.provider!.addLayer(layer);
  }

  /**
   * Remove a layer from the map
   */
  removeLayer(layerId: string): void {
    this.ensureInitialized();
    this.provider!.removeLayer(layerId);
  }

  /**
   * Update a layer
   */
  updateLayer(layerId: string, updates: Partial<LayerConfig>): void {
    this.ensureInitialized();
    this.provider!.updateLayer(layerId, updates);
  }

  /**
   * Get a layer by ID
   */
  getLayer(layerId: string): LayerConfig | undefined {
    this.ensureInitialized();
    return this.provider!.getLayer(layerId);
  }

  /**
   * Get all layers
   */
  getLayers(): LayerConfig[] {
    this.ensureInitialized();
    return this.provider!.getLayers();
  }

  /**
   * Set layer visibility
   */
  setLayerVisibility(layerId: string, visible: boolean): void {
    this.ensureInitialized();
    this.provider!.setLayerVisibility(layerId, visible);
  }

  /**
   * Set layer opacity
   */
  setLayerOpacity(layerId: string, opacity: number): void {
    this.ensureInitialized();
    this.provider!.setLayerOpacity(layerId, opacity);
  }

  /**
   * Add an event listener
   */
  on(eventType: MapEventType, handler: MapEventHandler): void {
    this.eventEmitter.on(eventType, handler);
    if (this.provider) {
      this.provider.on(eventType, handler);
    }
  }

  /**
   * Remove an event listener
   */
  off(eventType: MapEventType, handler: MapEventHandler): void {
    this.eventEmitter.off(eventType, handler);
    if (this.provider) {
      this.provider.off(eventType, handler);
    }
  }

  /**
   * Add a one-time event listener
   */
  once(eventType: MapEventType, handler: MapEventHandler): void {
    this.eventEmitter.once(eventType, handler);
  }

  /**
   * Trigger a resize event
   */
  resize(): void {
    if (this.provider) {
      this.provider.resize();
    }
  }

  /**
   * Get the underlying map provider instance
   * Use with caution - breaks abstraction
   */
  getProvider(): IMapProvider | undefined {
    return this.provider;
  }

  /**
   * Get the underlying provider-specific map instance
   * Use with caution - breaks abstraction
   */
  getMapInstance(): unknown {
    this.ensureInitialized();
    return this.provider!.getMapInstance();
  }

  /**
   * Check if the map is initialized and ready
   */
  isReady(): boolean {
    return this.initialized && this.provider !== undefined && this.provider.isReady();
  }

  /**
   * Get map configuration
   */
  getConfig(): MapConfig {
    return { ...this.config };
  }

  /**
   * Validate configuration
   */
  private validateConfig(config: MapConfig): void {
    if (!config.provider) {
      throw new MapError('Provider is required', 'CONFIG_ERROR');
    }

    if (!config.container) {
      throw new MapError('Container is required', 'CONFIG_ERROR');
    }

    // Ensure we have initial position
    if (!config.viewState && (!config.center || config.zoom === undefined)) {
      console.warn('No initial position specified, using default (0, 0, zoom: 2)');
      config.center = [0, 0];
      config.zoom = 2;
    }
  }

  /**
   * Create the appropriate provider instance
   */
  private async createProvider(providerName: string): Promise<IMapProvider> {
    // Dynamic import of providers
    // For now, we'll throw an error - providers will be implemented next
    throw new MapError(
      `Provider "${providerName}" not yet implemented. Available providers will be added in the next phase.`,
      'PROVIDER_NOT_FOUND'
    );
  }

  /**
   * Ensure the map is initialized before operations
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.provider) {
      throw new MapError(
        'Map not initialized. Call initialize() first.',
        'NOT_INITIALIZED'
      );
    }
  }

  /**
   * Forward provider events to our event emitter
   */
  private setupEventForwarding(): void {
    if (!this.provider) return;

    const eventTypes: MapEventType[] = [
      'click',
      'dblclick',
      'mousemove',
      'mouseenter',
      'mouseleave',
      'contextmenu',
      'zoom',
      'move',
      'movestart',
      'moveend',
      'zoomstart',
      'zoomend',
      'rotate',
      'pitch',
      'error',
    ];

    eventTypes.forEach((eventType) => {
      this.provider!.on(eventType, (event) => {
        this.eventEmitter.emit(eventType, event);
      });
    });
  }
}

/**
 * Factory function to create and initialize a UniversalMap instance
 */
export async function createMap(config: MapConfig): Promise<UniversalMap> {
  const map = new UniversalMap(config);
  await map.initialize();
  return map;
}
