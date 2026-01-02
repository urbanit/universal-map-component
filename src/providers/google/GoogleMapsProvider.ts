/**
 * Google Maps Provider
 * Implementation of IMapProvider for Google Maps
 */

import { BaseMapProvider } from '../../core/provider';
import type {
  MapConfig,
  ViewState,
  LayerConfig,
  CameraOptions,
  BoundingBox,
  ProviderCapabilities,
  MapEvent,
} from '../../core/types';
import { loadGoogleMapsAPI } from './loader';
import { GoogleMapsEventMapper } from './events';
import { GoogleMapsLayerManager } from './layers';

/**
 * Google Maps Provider implementation
 */
export class GoogleMapsProvider extends BaseMapProvider {
  readonly name = 'google';
  readonly capabilities: ProviderCapabilities = {
    supports3D: true,
    supportsVectorTiles: true,
    supports3DTiles: true,
    supportsCustomProjections: false,
    supportsTerrain: true,
    requiresApiKey: true,
  };

  private map?: google.maps.Map;
  private eventMapper?: GoogleMapsEventMapper;
  private layerManager?: GoogleMapsLayerManager;

  /**
   * Initialize the Google Maps provider
   */
  async initialize(config: MapConfig): Promise<void> {
    this.validateConfig(config);
    this.config = config;

    // Load Google Maps API
    await loadGoogleMapsAPI({
      apiKey: config.apiKey!,
      libraries: ['places', 'geometry', 'drawing'],
    });

    // Resolve container
    this.container = this.resolveContainer(config.container);

    // Create map instance
    const mapOptions: google.maps.MapOptions = {
      center: this.configToGoogleLatLng(
        config.center || config.viewState?.center || [0, 0]
      ),
      zoom: config.zoom || config.viewState?.zoom || 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: config.providerOptions?.mapId as string | undefined,
      ...(config.enable3D && {
        tilt: 45,
        heading: 0,
      }),
    };

    this.map = new google.maps.Map(this.container, mapOptions);

    // Initialize layer manager
    this.layerManager = new GoogleMapsLayerManager(this.map);

    // Set up event mapping
    this.eventMapper = new GoogleMapsEventMapper(this.map, (event) => {
      this.emit(event.type, event);
    });

    this.ready = true;
  }

  /**
   * Destroy the map instance
   */
  destroy(): void {
    if (this.eventMapper) {
      this.eventMapper.destroy();
    }
    if (this.layerManager) {
      this.layerManager.destroy();
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.map = undefined;
    this.ready = false;
  }

  /**
   * Get current view state
   */
  getViewState(): ViewState {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const center = this.map.getCenter();
    const zoom = this.map.getZoom();
    const heading = this.map.getHeading();
    const tilt = this.map.getTilt();

    return {
      center: center ? [center.lat(), center.lng()] : [0, 0],
      zoom: zoom || 0,
      bearing: heading || 0,
      pitch: tilt || 0,
    };
  }

  /**
   * Set view state
   */
  setViewState(viewState: Partial<ViewState>, options?: CameraOptions): void {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const cameraOptions: google.maps.CameraOptions = {};

    if (viewState.center) {
      cameraOptions.center = this.configToGoogleLatLng(viewState.center);
    }
    if (viewState.zoom !== undefined) {
      cameraOptions.zoom = viewState.zoom;
    }
    if (viewState.bearing !== undefined) {
      cameraOptions.heading = viewState.bearing;
    }
    if (viewState.pitch !== undefined) {
      cameraOptions.tilt = viewState.pitch;
    }

    if (options?.duration) {
      // Animated transition
      this.map.moveCamera({
        ...cameraOptions,
        duration: options.duration,
      });
    } else {
      // Immediate transition
      this.map.moveCamera(cameraOptions);
    }
  }

  /**
   * Get current bounds
   */
  getBounds(): BoundingBox {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const bounds = this.map.getBounds();
    if (!bounds) {
      throw new Error('Bounds not available');
    }

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    return [sw.lng(), sw.lat(), ne.lng(), ne.lat()];
  }

  /**
   * Fit map to bounds
   */
  fitBounds(bounds: BoundingBox, options?: CameraOptions): void {
    if (!this.map) {
      throw new Error('Map not initialized');
    }

    const [west, south, east, north] = bounds;
    const googleBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(south, west),
      new google.maps.LatLng(north, east)
    );

    this.map.fitBounds(googleBounds, {
      ...(options?.duration && { duration: options.duration }),
    });
  }

  /**
   * Add a layer
   */
  addLayer(layer: LayerConfig): void {
    if (!this.layerManager) {
      throw new Error('Layer manager not initialized');
    }

    this.layerManager.addLayer(layer);
    this.layers.set(layer.id, layer);
  }

  /**
   * Remove a layer
   */
  removeLayer(layerId: string): void {
    if (!this.layerManager) {
      throw new Error('Layer manager not initialized');
    }

    this.layerManager.removeLayer(layerId);
    this.layers.delete(layerId);
  }

  /**
   * Update a layer
   */
  updateLayer(layerId: string, updates: Partial<LayerConfig>): void {
    if (!this.layerManager) {
      throw new Error('Layer manager not initialized');
    }

    const layer = this.layers.get(layerId);
    if (!layer) {
      throw new Error(`Layer ${layerId} not found`);
    }

    const updatedLayer = { ...layer, ...updates };
    this.layerManager.updateLayer(layerId, updatedLayer);
    this.layers.set(layerId, updatedLayer);
  }

  /**
   * Resize the map
   */
  resize(): void {
    if (this.map) {
      google.maps.event.trigger(this.map, 'resize');
    }
  }

  /**
   * Get the underlying Google Maps instance
   */
  getMapInstance(): google.maps.Map | undefined {
    return this.map;
  }

  /**
   * Convert config coordinates to Google LatLng
   */
  private configToGoogleLatLng(coords: [number, number]): google.maps.LatLng {
    return new google.maps.LatLng(coords[0], coords[1]);
  }
}
