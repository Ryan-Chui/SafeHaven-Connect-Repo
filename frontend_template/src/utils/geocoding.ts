// Geocoding utilities for converting addresses to coordinates
// Uses OpenStreetMap Nominatim API (free, no API key required)

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayAddress: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  if (!address.trim()) {
    throw new Error('Address is required');
  }

  try {
    // Use Nominatim API (OpenStreetMap's geocoding service)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SafeHaven-Connect-Emergency-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Address not found. Please check the address and try again.');
    }

    const result = data[0];
    
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayAddress: result.display_name || address
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to geocode address. Please try again.');
  }
}

// Reverse geocoding - convert coordinates to address
export async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SafeHaven-Connect-Emergency-App'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Reverse geocoding service unavailable');
    }

    const data = await response.json();
    
    if (!data || !data.display_name) {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    return data.display_name;
  } catch (error) {
    // Fallback to coordinates if reverse geocoding fails
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

// Validate coordinates
export function isValidCoordinate(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}