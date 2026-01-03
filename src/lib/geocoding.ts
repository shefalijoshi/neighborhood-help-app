// src/lib/geocoding.ts

export interface Coords {
    lat: number;
    lng: number;
  }
  
  /**
   * Fetches coordinates from Mapbox for a given address string.
   */
  export async function getCoordsFromAddress(address: string): Promise<Coords | null> {
    if (address.length < 5) return null;
  
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;
      if (!token) throw new Error("Mapbox token is missing");
  
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${token}&limit=1`;
  
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
  
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
      
      return null;
    } catch (error) {
      console.error("Geocoding helper error:", error);
      return null;
    }
  }