/**
 * Google Maps Layer Manager
 * Handles layer rendering on Google Maps using deck.gl and native overlays
 */

import type { LayerConfig, DataSource } from '../../core/types';
import { DataSourceFactory } from '../../core/data-source';

/**
 * Layer manager for Google Maps
 */
export class GoogleMapsLayerManager {
  private map: google.maps.Map;
  private layers: Map<string, any> = new Map();
  private dataLayers: Map<string, google.maps.Data> = new Map();
  private markers: Map<string, google.maps.marker.AdvancedMarkerElement[]> = new Map();

  constructor(map: google.maps.Map) {
    this.map = map;
  }

  /**
   * Add a layer to the map
   */
  async addLayer(config: LayerConfig): Promise<void> {
    if (this.layers.has(config.id)) {
      console.warn(`Layer ${config.id} already exists, updating instead`);
      await this.updateLayer(config.id, config);
      return;
    }

    switch (config.type) {
      case 'geojson':
        await this.addGeoJSONLayer(config);
        break;
      case 'markers':
      case 'points':
        await this.addMarkersLayer(config);
        break;
      case 'heatmap':
        await this.addHeatmapLayer(config);
        break;
      case 'polygons':
        await this.addPolygonLayer(config);
        break;
      default:
        console.warn(`Layer type ${config.type} not yet implemented for Google Maps`);
    }

    this.layers.set(config.id, config);
  }

  /**
   * Remove a layer from the map
   */
  removeLayer(layerId: string): void {
    const dataLayer = this.dataLayers.get(layerId);
    if (dataLayer) {
      dataLayer.setMap(null);
      this.dataLayers.delete(layerId);
    }

    const markers = this.markers.get(layerId);
    if (markers) {
      markers.forEach(marker => marker.setMap(null));
      this.markers.delete(layerId);
    }

    this.layers.delete(layerId);
  }

  /**
   * Update a layer
   */
  async updateLayer(layerId: string, config: LayerConfig): Promise<void> {
    this.removeLayer(layerId);
    await this.addLayer(config);
  }

  /**
   * Set layer visibility
   */
  setLayerVisibility(layerId: string, visible: boolean): void {
    const dataLayer = this.dataLayers.get(layerId);
    if (dataLayer) {
      dataLayer.setMap(visible ? this.map : null);
    }

    const markers = this.markers.get(layerId);
    if (markers) {
      markers.forEach(marker => marker.map = visible ? this.map : null);
    }
  }

  /**
   * Destroy all layers
   */
  destroy(): void {
    this.dataLayers.forEach(layer => layer.setMap(null));
    this.markers.forEach(markerArray =>
      markerArray.forEach(marker => marker.map = null)
    );
    this.dataLayers.clear();
    this.markers.clear();
    this.layers.clear();
  }

  /**
   * Add GeoJSON layer
   */
  private async addGeoJSONLayer(config: LayerConfig): Promise<void> {
    const dataLayer = new google.maps.Data({ map: this.map });

    // Load data
    const source = DataSourceFactory.normalizeSource(config.source);
    const dataSource = DataSourceFactory.createDataSource(source);
    const geoJSON = await dataSource.load();

    // Add features
    dataLayer.addGeoJson(geoJSON as any);

    // Apply styling
    if (config.style) {
      dataLayer.setStyle({
        fillColor: config.style.fillColor || '#3388ff',
        strokeColor: config.style.strokeColor || '#ffffff',
        strokeWeight: config.style.strokeWidth || 1,
        fillOpacity: config.style.opacity || 0.6,
      });
    }

    this.dataLayers.set(config.id, dataLayer);
  }

  /**
   * Add markers layer
   */
  private async addMarkersLayer(config: LayerConfig): Promise<void> {
    const source = DataSourceFactory.normalizeSource(config.source);
    const dataSource = DataSourceFactory.createDataSource(source);
    const geoJSON = await dataSource.load() as any;

    const markers: google.maps.marker.AdvancedMarkerElement[] = [];

    if (geoJSON.type === 'FeatureCollection') {
      geoJSON.features.forEach((feature: any) => {
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat, lng },
            map: this.map,
            title: feature.properties?.name || feature.properties?.title,
          });
          markers.push(marker);
        }
      });
    }

    this.markers.set(config.id, markers);
  }

  /**
   * Add heatmap layer
   */
  private async addHeatmapLayer(config: LayerConfig): Promise<void> {
    console.warn('Heatmap layer requires visualization library - not yet fully implemented');

    // For now, render as markers
    // In production, you would use google.maps.visualization.HeatmapLayer
    await this.addMarkersLayer(config);
  }

  /**
   * Add polygon layer
   */
  private async addPolygonLayer(config: LayerConfig): Promise<void> {
    // Use Data layer for polygons
    await this.addGeoJSONLayer(config);
  }
}
