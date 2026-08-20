import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import type { OsmRestaurant } from '../data/restaurantsOsm'

// Vite bundles Leaflet's default marker icons at hashed URLs; point Leaflet at them
// directly instead of its baked-in (broken-under-bundlers) relative paths.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const US_CENTER: [number, number] = [39.5, -98.35]
const US_ZOOM = 4

export function RestaurantMap({ restaurants }: { restaurants: OsmRestaurant[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current).setView(US_CENTER, US_ZOOM)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    clusterRef.current = L.markerClusterGroup()
    map.addLayer(clusterRef.current)

    return () => {
      map.remove()
      mapRef.current = null
      clusterRef.current = null
    }
  }, [])

  useEffect(() => {
    const cluster = clusterRef.current
    const map = mapRef.current
    if (!cluster || !map) return

    cluster.clearLayers()

    const markers = restaurants.map((r) => {
      const popupHtml = `
        <strong>${escapeHtml(r.name)}</strong><br/>
        ${r.address ? `${escapeHtml(r.address)}<br/>` : ''}
        ${r.city || r.state ? `${escapeHtml([r.city, r.state].filter(Boolean).join(', '))}<br/>` : ''}
        ${r.phone ? `${escapeHtml(r.phone)}<br/>` : ''}
        ${r.website ? `<a href="${escapeHtml(r.website)}" target="_blank" rel="noreferrer">${escapeHtml(r.website)}</a>` : ''}
      `
      return L.marker([r.lat, r.lon]).bindPopup(popupHtml)
    })

    cluster.addLayers(markers)

    if (restaurants.length > 0) {
      const bounds = L.latLngBounds(restaurants.map((r) => [r.lat, r.lon] as [number, number]))
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 })
    } else {
      map.setView(US_CENTER, US_ZOOM)
    }
  }, [restaurants])

  return <div ref={containerRef} className="h-[420px] w-full border-2 border-obang-black" />
}

function escapeHtml(str: string) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}
