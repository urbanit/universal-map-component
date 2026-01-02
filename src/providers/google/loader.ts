/**
 * Google Maps API Loader
 * Dynamically loads the Google Maps JavaScript API
 */

export interface GoogleMapsLoaderOptions {
  apiKey: string;
  version?: string;
  libraries?: string[];
  language?: string;
  region?: string;
}

/**
 * Load status
 */
enum LoadStatus {
  NOT_LOADED = 'NOT_LOADED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  FAILED = 'FAILED',
}

/**
 * Google Maps API Loader
 * Ensures the Google Maps API is loaded only once
 */
class GoogleMapsAPILoader {
  private status: LoadStatus = LoadStatus.NOT_LOADED;
  private loadPromise?: Promise<typeof google>;
  private error?: Error;

  /**
   * Load the Google Maps API
   */
  async load(options: GoogleMapsLoaderOptions): Promise<typeof google> {
    // If already loaded, return immediately
    if (this.status === LoadStatus.LOADED && window.google?.maps) {
      return window.google;
    }

    // If currently loading, return the existing promise
    if (this.status === LoadStatus.LOADING && this.loadPromise) {
      return this.loadPromise;
    }

    // If previously failed, throw the error
    if (this.status === LoadStatus.FAILED && this.error) {
      throw this.error;
    }

    // Start loading
    this.status = LoadStatus.LOADING;
    this.loadPromise = this.loadScript(options);

    try {
      const google = await this.loadPromise;
      this.status = LoadStatus.LOADED;
      return google;
    } catch (error) {
      this.status = LoadStatus.FAILED;
      this.error = error instanceof Error ? error : new Error('Failed to load Google Maps API');
      throw this.error;
    }
  }

  /**
   * Load the Google Maps script
   */
  private loadScript(options: GoogleMapsLoaderOptions): Promise<typeof google> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.maps) {
        resolve(window.google);
        return;
      }

      // Build the script URL
      const params = new URLSearchParams({
        key: options.apiKey,
        v: options.version || 'weekly',
        ...(options.libraries && options.libraries.length > 0 && {
          libraries: options.libraries.join(','),
        }),
        ...(options.language && { language: options.language }),
        ...(options.region && { region: options.region }),
      });

      const url = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      // Create script element
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;

      // Handle load
      script.addEventListener('load', () => {
        if (window.google?.maps) {
          resolve(window.google);
        } else {
          reject(new Error('Google Maps API loaded but google.maps not available'));
        }
      });

      // Handle error
      script.addEventListener('error', () => {
        reject(new Error('Failed to load Google Maps API script'));
      });

      // Add to document
      document.head.appendChild(script);
    });
  }

  /**
   * Check if Google Maps API is loaded
   */
  isLoaded(): boolean {
    return this.status === LoadStatus.LOADED && window.google?.maps !== undefined;
  }

  /**
   * Get current status
   */
  getStatus(): LoadStatus {
    return this.status;
  }
}

// Global singleton instance
const loaderInstance = new GoogleMapsAPILoader();

/**
 * Load Google Maps API
 */
export async function loadGoogleMapsAPI(
  options: GoogleMapsLoaderOptions
): Promise<typeof google> {
  return loaderInstance.load(options);
}

/**
 * Check if Google Maps API is loaded
 */
export function isGoogleMapsLoaded(): boolean {
  return loaderInstance.isLoaded();
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    google?: typeof google;
  }
}
