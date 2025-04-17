import { useState, useEffect } from 'react'
import { useProtectedRoute } from '../../hooks/useProtectedRoute'
import { useMap } from '../../context/MapContext'
import Map from '../../components/common/Map'
import { supabase } from '../../utils/supabaseClient'

export default function BookRide() {
  useProtectedRoute('client')
  const { userLocation } = useMap()
  
  const [pickup, setPickup] = useState(null)
  const [destination, setDestination] = useState(null)
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [estimatedPrice, setEstimatedPrice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch nearby drivers
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    const fetchNearbyDrivers = async () => {
      if (!userLocation) return;
      
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .eq('status', 'available');
        
        if (error) throw error;

        if (isMounted) {
          setDrivers(data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching drivers:', error);
        
        if (isMounted) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(fetchNearbyDrivers, RETRY_DELAY);
          } else {
            setError('Failed to fetch nearby drivers. Please try again.');
            setLoading(false);
          }
        }
      }
    };

    fetchNearbyDrivers();

    return () => {
      isMounted = false;
    };
  }, [userLocation]);

  // Calculate markers for the map
  const markers = [
    ...(pickup ? [{ coordinates: pickup, options: { color: '#3b82f6' } }] : []),
    ...(destination ? [{ coordinates: destination, options: { color: '#f59e0b' } }] : []),
    ...drivers.map(driver => ({
      coordinates: [driver.longitude, driver.latitude],
      options: { color: '#10b981' }
    }))
  ]

  // Calculate popups for the map
  const popups = drivers.map(driver => ({
    coordinates: [driver.longitude, driver.latitude],
    content: `
      <div class="p-2">
        <h3 class="font-semibold">${driver.name}</h3>
        <p class="text-sm text-gray-600">${driver.vehicle_type}</p>
        <p class="text-sm text-gray-600">Rating: ${driver.rating}⭐</p>
      </div>
    `
  }))

  const handleMapClick = (e) => {
    const [lng, lat] = e.lngLat.toArray()
    
    if (!pickup) {
      setPickup([lng, lat])
    } else if (!destination) {
      setDestination([lng, lat])
    }
  }

  const calculatePrice = () => {
    if (!pickup || !destination) return

    // In a real app, this would be a more complex calculation
    // For now, we'll just use a simple distance-based calculation
    const distance = calculateDistance(pickup, destination)
    const basePrice = 5
    const pricePerKm = 2
    const estimated = basePrice + (distance * pricePerKm)
    setEstimatedPrice(Math.round(estimated * 100) / 100)
  }

  const calculateDistance = (point1, point2) => {
    // Simple distance calculation (in km)
    const R = 6371 // Earth's radius in km
    const dLat = toRad(point2[1] - point1[1])
    const dLon = toRad(point2[0] - point1[0])
    const lat1 = toRad(point1[1])
    const lat2 = toRad(point2[1])

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const toRad = (value) => {
    return value * Math.PI / 180
  }

  const handleBookRide = async () => {
    if (!pickup || !destination || !selectedDriver) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('rides')
        .insert([
          {
            pickup_longitude: pickup[0],
            pickup_latitude: pickup[1],
            destination_longitude: destination[0],
            destination_latitude: destination[1],
            driver_id: selectedDriver.id,
            estimated_price: estimatedPrice,
            status: 'pending'
          }
        ])

      if (error) throw error

      // Navigate to ride tracking page
      // navigate(`/rides/${data[0].id}`)
    } catch (error) {
      console.error('Error booking ride:', error)
      setError('Failed to book ride. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Map Section */}
      <div className="flex-1">
        <Map
          markers={markers}
          popups={popups}
          initialCenter={userLocation}
          showRoute={pickup && destination}
          routeStart={pickup}
          routeEnd={destination}
          onMapClick={handleMapClick}
          className="h-[600px]"
        />
      </div>

      {/* Booking Section */}
      <div className="w-full md:w-96 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Book a Ride</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Location Details */}
          <div>
            <h3 className="font-semibold mb-2">Pickup & Destination</h3>
            <div className="space-y-2 text-sm">
              <p>
                Pickup: {pickup ? `${pickup[0].toFixed(4)}, ${pickup[1].toFixed(4)}` : 'Click map to set'}
              </p>
              <p>
                Destination: {destination ? `${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}` : 'Click map to set'}
              </p>
            </div>
          </div>

          {/* Driver Selection */}
          {drivers.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Available Drivers</h3>
              <div className="space-y-2">
                {drivers.map(driver => (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`w-full p-3 rounded-lg border text-left ${
                      selectedDriver?.id === driver.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{driver.name}</div>
                    <div className="text-sm text-gray-600">
                      {driver.vehicle_type} • Rating: {driver.rating}⭐
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Estimate */}
          {pickup && destination && (
            <div>
              <h3 className="font-semibold mb-2">Estimated Price</h3>
              <div className="text-2xl font-bold text-primary">
                ${estimatedPrice || '---'}
              </div>
            </div>
          )}

          {/* Book Button */}
          <button
            onClick={handleBookRide}
            disabled={!pickup || !destination || !selectedDriver || loading}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {loading ? 'Booking...' : 'Book Ride'}
          </button>
        </div>
      </div>
    </div>
  )
}
