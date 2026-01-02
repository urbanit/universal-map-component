# Google Maps Setup Guide

This guide explains how to set up Google Maps API credentials for the Universal Map Component.

## Prerequisites

- A Google Cloud Platform account
- A project in Google Cloud Console

## Step 1: Enable Google Maps JavaScript API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for "Maps JavaScript API"
5. Click **Enable**

## Step 2: Create an API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API key**
3. Your API key will be created
4. **(Recommended)** Click **RESTRICT KEY** to add security restrictions:
   - **Application restrictions**: Choose "HTTP referrers (web sites)"
   - Add your domain (e.g., `localhost:3000/*` for development)
   - **API restrictions**: Select "Restrict key" and choose "Maps JavaScript API"
5. Click **Save**
6. Copy your API key

## Step 3: Create a Map ID (Required for Advanced Markers)

Advanced Markers and some 3D features require a Map ID. Here's how to create one:

### Creating a Map ID

1. Go to [Google Maps Platform - Map Management](https://console.cloud.google.com/google/maps-apis/studio/maps)
2. Click **+ CREATE MAP ID**
3. Fill in the details:
   - **Map name**: Give it a descriptive name (e.g., "Universal Map Component")
   - **Map type**: Choose **JavaScript**
   - **Description**: (Optional) Add a description
4. Click **Next**
5. Choose map style:
   - **Vector** (recommended - smaller file size, better performance)
   - **Raster** (traditional tile-based maps)
6. Click **Save**
7. Your Map ID will be created (format: `xxxxxxxxxxxxxxxx`)
8. Copy the Map ID

### Why Do I Need a Map ID?

Map IDs are required for:
- ✅ **Advanced Markers** (AdvancedMarkerElement) - Improved performance and features
- ✅ **Vector maps** - Smaller, faster map tiles
- ✅ **Cloud-based styling** - Customize map appearance in Google Cloud Console
- ✅ **3D features** - Enhanced 3D building rendering

Without a Map ID:
- ⚠️ You'll see a console warning about Advanced Markers
- ⚠️ Some features won't work
- ✅ Basic maps will still function (using older APIs)

## Step 4: Add Credentials to Your Project

### Add to .env file

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   VITE_GOOGLE_MAPS_MAP_ID=your_actual_map_id_here
   ```

3. **Important**: Never commit the `.env` file to version control!

### Verify in Your Application

```typescript
import { UniversalMap } from 'universal-map-component';

const map = new UniversalMap({
  provider: 'google',
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  container: 'map-container',
  center: [40.7128, -74.0060],
  zoom: 12,
  providerOptions: {
    mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID  // For Advanced Markers
  }
});

await map.initialize();
```

## Troubleshooting

### "The map is initialized without a valid Map ID"

**Cause**: No Map ID provided or invalid Map ID.

**Solution**:
1. Create a Map ID following Step 3 above
2. Add it to your `.env` file
3. Restart your dev server (`npm run examples`)
4. Hard refresh your browser (`Ctrl+Shift+R`)

### "This API project is not authorized to use this API"

**Cause**: Maps JavaScript API is not enabled for your project.

**Solution**:
1. Go to [APIs & Services → Library](https://console.cloud.google.com/apis/library)
2. Search for "Maps JavaScript API"
3. Click **Enable**

### "API key not valid"

**Cause**: Invalid API key or API restrictions preventing access.

**Solution**:
1. Check that the API key is correct in `.env`
2. Verify API key restrictions in Google Cloud Console
3. Make sure your domain/localhost is allowed
4. Ensure "Maps JavaScript API" is selected in API restrictions

### "RefererNotAllowedMapError"

**Cause**: Your website URL is not authorized to use the API key.

**Solution**:
1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click on your API key
3. Under "Application restrictions", add your domain:
   - Development: `localhost:3000/*`
   - Production: `yourdomain.com/*`
4. Click **Save**

## Security Best Practices

### For Development
- Use unrestricted API key on localhost
- Or add `localhost:*/*` to HTTP referrers

### For Production
1. **Use HTTP referrer restrictions**:
   - Add only your production domains
   - Use wildcards carefully: `*.yourdomain.com/*`

2. **Use API restrictions**:
   - Select only "Maps JavaScript API"
   - Don't enable unnecessary APIs

3. **Monitor usage**:
   - Set up billing alerts in Google Cloud Console
   - Monitor API usage to detect unusual activity

4. **Rotate keys regularly**:
   - Create new API keys periodically
   - Delete old keys after migration

5. **Never expose keys**:
   - Don't commit `.env` files
   - Use environment variables on server-side
   - Consider using a backend proxy for API requests

## Cost Management

Google Maps Platform offers:
- **$200 free monthly credit**
- Pay-as-you-go pricing after that

To manage costs:
1. Set up billing alerts
2. Use quotas to limit requests
3. Implement caching where possible
4. Use Map IDs to enable vector maps (more efficient)

## Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
- [Advanced Markers Guide](https://developers.google.com/maps/documentation/javascript/advanced-markers)
- [Map IDs Documentation](https://developers.google.com/maps/documentation/javascript/mapid)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
