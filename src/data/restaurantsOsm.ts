import raw from './restaurants-osm.json'

export type OsmRestaurant = {
  osmId: string
  name: string
  lat: number
  lon: number
  address?: string
  city?: string
  state?: string
  phone?: string
  website?: string
}

// Sourced from OpenStreetMap via the Overpass API (amenity=restaurant, cuisine=korean).
// ODbL-licensed: free to store and reuse indefinitely, with attribution.
export const osmRestaurants: OsmRestaurant[] = raw as OsmRestaurant[]
