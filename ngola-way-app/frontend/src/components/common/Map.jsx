import { useEffect, useRef } from 'react'
import { useMap } from '../../context/MapContext'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function Map({ 
  className = '',
  onMapLoad = () => {},
  markers = [],
  popups = [],
  initialCenter = null,
  initialZoom = 12,
  showRoute = false,
  routeStart = null,
  routeEnd = null
}) {
  const mapContainer = useRef(null)
  const markersRef = useRef([])
  const popupsRef = useRef([])
  const { initializeMap, map, userLocation, drawRoute } = useMap()

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return

    const mapInstance = initializeMap(mapContainer.current)
    mapInstance.on('load', () => {
      onMapLoad(mapInstance)
    })

    return () => {
      mapInstance.remove()
    }
  }, [initializeMap, onMapLoad])

  // Handle markers
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach(({ coordinates, options }) => {
      const marker = new mapboxgl.Marker(options)
        .setLngLat(coordinates)
        .addTo(map)
      markersRef.current.push(marker)
    })

    return () => {
      markersRef.current.forEach(marker => marker.remove())
    }
  }, [map, markers])

  // Handle popups
  useEffect(() => {
    if (!map) return

    // Clear existing popups
    popupsRef.current.forEach(popup => popup.remove())
    popupsRef.current = []

    // Add new popups
    popups.forEach(({ coordinates, content }) => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setLngLat(coordinates)
        .setHTML(content)
        .addTo(map)
      popupsRef.current.push(popup)
    })

    return () => {
      popupsRef.current.forEach(popup => popup.remove())
    }
  }, [map, popups])

  // Handle center change
  useEffect(() => {
    if (!map) return

    const center = initialCenter || userLocation || [-0.127758, 51.507351] // Default to London
    map.setCenter(center)
    map.setZoom(initialZoom)
  }, [map, initialCenter, userLocation, initialZoom])

  // Handle route drawing
  useEffect(() => {
    if (!map || !showRoute || !routeStart || !routeEnd) return

    drawRoute(routeStart, routeEnd)

    // Clean up route layer when component unmounts
    return () => {
      if (map.getLayer('route')) {
        map.removeLayer('route')
        map.removeSource('route')
      }
    }
  }, [map, showRoute, routeStart, routeEnd, drawRoute])

  return (
    <div 
      ref={mapContainer} 
      className={`w-full h-full min-h-[400px] rounded-lg ${className}`}
    />
  )
}
