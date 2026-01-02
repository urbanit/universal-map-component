/**
 * Google Maps Event Mapper
 * Maps Google Maps events to Universal Map Component events
 */

import type { MapEvent, MapEventType, Coordinates } from '../../core/types';
import { createMapEvent } from '../../core/events';

/**
 * Event mapper for Google Maps
 */
export class GoogleMapsEventMapper {
  private map: google.maps.Map;
  private listeners: google.maps.MapsEventListener[] = [];
  private eventCallback: (event: MapEvent) => void;

  constructor(map: google.maps.Map, eventCallback: (event: MapEvent) => void) {
    this.map = map;
    this.eventCallback = eventCallback;
    this.setupEventListeners();
  }

  /**
   * Set up all event listeners
   */
  private setupEventListeners(): void {
    // Click events
    this.addListener('click', (e: google.maps.MapMouseEvent) => {
      this.eventCallback(
        createMapEvent('click', this.map, {
          lngLat: this.googleLatLngToCoords(e.latLng),
          originalEvent: e.domEvent,
        })
      );
    });

    this.addListener('dblclick', (e: google.maps.MapMouseEvent) => {
      this.eventCallback(
        createMapEvent('dblclick', this.map, {
          lngLat: this.googleLatLngToCoords(e.latLng),
          originalEvent: e.domEvent,
        })
      );
    });

    this.addListener('rightclick', (e: google.maps.MapMouseEvent) => {
      this.eventCallback(
        createMapEvent('contextmenu', this.map, {
          lngLat: this.googleLatLngToCoords(e.latLng),
          originalEvent: e.domEvent,
        })
      );
    });

    // Mouse events
    this.addListener('mousemove', (e: google.maps.MapMouseEvent) => {
      this.eventCallback(
        createMapEvent('mousemove', this.map, {
          lngLat: this.googleLatLngToCoords(e.latLng),
          originalEvent: e.domEvent,
        })
      );
    });

    // Zoom events
    this.addListener('zoom_changed', () => {
      this.eventCallback(
        createMapEvent('zoom', this.map, {
          lngLat: this.getCenterCoords(),
        })
      );
    });

    // Movement events
    this.addListener('center_changed', () => {
      this.eventCallback(
        createMapEvent('move', this.map, {
          lngLat: this.getCenterCoords(),
        })
      );
    });

    this.addListener('dragstart', () => {
      this.eventCallback(createMapEvent('movestart', this.map));
    });

    this.addListener('dragend', () => {
      this.eventCallback(
        createMapEvent('moveend', this.map, {
          lngLat: this.getCenterCoords(),
        })
      );
    });

    // Rotation and tilt events
    this.addListener('heading_changed', () => {
      this.eventCallback(createMapEvent('rotate', this.map));
    });

    this.addListener('tilt_changed', () => {
      this.eventCallback(createMapEvent('pitch', this.map));
    });

    // Map loaded event
    this.addListener('tilesloaded', () => {
      this.eventCallback(createMapEvent('load', this.map));
    });
  }

  /**
   * Add a listener and track it for cleanup
   */
  private addListener(
    eventName: string,
    handler: (...args: any[]) => void
  ): void {
    const listener = google.maps.event.addListener(this.map, eventName, handler);
    this.listeners.push(listener);
  }

  /**
   * Convert Google LatLng to our Coordinates format
   */
  private googleLatLngToCoords(
    latLng: google.maps.LatLng | null | undefined
  ): Coordinates | undefined {
    if (!latLng) return undefined;
    return [latLng.lat(), latLng.lng()];
  }

  /**
   * Get current map center as coordinates
   */
  private getCenterCoords(): Coordinates | undefined {
    const center = this.map.getCenter();
    return this.googleLatLngToCoords(center);
  }

  /**
   * Clean up all event listeners
   */
  destroy(): void {
    this.listeners.forEach((listener) => {
      google.maps.event.removeListener(listener);
    });
    this.listeners = [];
  }
}
