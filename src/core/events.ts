/**
 * Event system for map component
 */

import type { MapEvent, MapEventType, MapEventHandler } from './types';

/**
 * Event emitter for map events
 */
export class EventEmitter {
  private listeners: Map<MapEventType, Set<MapEventHandler>> = new Map();

  /**
   * Add an event listener
   */
  on(eventType: MapEventType, handler: MapEventHandler): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);
  }

  /**
   * Remove an event listener
   */
  off(eventType: MapEventType, handler: MapEventHandler): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Add a one-time event listener
   */
  once(eventType: MapEventType, handler: MapEventHandler): void {
    const onceHandler: MapEventHandler = (event) => {
      handler(event);
      this.off(eventType, onceHandler);
    };
    this.on(eventType, onceHandler);
  }

  /**
   * Emit an event to all registered listeners
   */
  emit(eventType: MapEventType, event: MapEvent): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for a specific event type
   */
  removeAllListeners(eventType?: MapEventType): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get the number of listeners for an event type
   */
  listenerCount(eventType: MapEventType): number {
    return this.listeners.get(eventType)?.size || 0;
  }

  /**
   * Get all registered event types
   */
  eventNames(): MapEventType[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Check if there are listeners for an event type
   */
  hasListeners(eventType: MapEventType): boolean {
    return this.listenerCount(eventType) > 0;
  }
}

/**
 * Create a map event object
 */
export function createMapEvent(
  type: MapEventType,
  target: unknown,
  data: Partial<Omit<MapEvent, 'type' | 'target'>> = {}
): MapEvent {
  return {
    type,
    target,
    ...data,
  };
}
