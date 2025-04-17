import { createContext, useContext, useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibWlndWVsLWxvcGVzIiwiYSI6ImNsd3FweGhsMjA1NDAyanNhajV1YWNjcHEifQ.1CAh2fdXiJ9FlWcyqwNf8w'

const MapContext = createContext({})

export const useMap = () => {
  return useContext(MapContext)
}

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null)
  const [userLocation, setUserLocation] = useState(null)

  const defaultLocation = [-0.127758, 51.507351]; // Default to London

  // Initialize map with default location
  const initializeMap = (container) => {
    if (map) return map; // Return existing map if already initialized

    const mapInstance = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: defaultLocation,
      zoom: 12
    });

    mapInstance.addControl(new mapboxgl.NavigationControl());
    mapInstance.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    setMap(mapInstance);
    return mapInstance;
  };

  // Get user's location
  useEffect(() => {
    let isMounted = true;

    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isMounted) {
              const { longitude, latitude } = position.coords;
              setUserLocation([longitude, latitude]);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            if (isMounted) {
              setUserLocation(defaultLocation);
            }
          }
        );
      } else {
        if (isMounted) {
          setUserLocation(defaultLocation);
        }
      }
    };

    getUserLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update map center when user location changes
  useEffect(() => {
    if (map && userLocation) {
      map.flyTo({
        center: userLocation,
        zoom: 12,
        essential: true
      });
    }
  }, [map, userLocation]);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  // Add a marker to the map
  const addMarker = (coordinates, options = {}) => {
    if (!map) return null

    const marker = new mapboxgl.Marker(options)
      .setLngLat(coordinates)
      .addTo(map)

    return marker
  }

  // Add a popup to the map
  const addPopup = (coordinates, content) => {
    if (!map) return null

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setLngLat(coordinates)
      .setHTML(content)
      .addTo(map)

    return popup
  }

  // Fly to a location
  const flyTo = (coordinates, zoom = 14) => {
    if (!map) return

    map.flyTo({
      center: coordinates,
      zoom,
      essential: true
    })
  }

  // Draw a route between two points
  const drawRoute = async (start, end) => {
    if (!map) return

    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
      )
      const json = await query.json()
      const data = json.routes[0]
      const route = data.geometry.coordinates

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      }

      if (map.getSource('route')) {
        map.getSource('route').setData(geojson)
      } else {
        map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.75
          }
        })
      }

      return data
    } catch (error) {
      console.error('Error drawing route:', error)
      return null
    }
  }

  const value = {
    map,
    initializeMap,
    userLocation,
    addMarker,
    addPopup,
    flyTo,
    drawRoute
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}
