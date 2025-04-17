import { useState, useEffect } from 'react'
import { useProtectedRoute } from '../../hooks/useProtectedRoute'
import { useMap } from '../../context/MapContext'
import Map from '../../components/common/Map'
import { supabase } from '../../utils/supabaseClient'

export default function FindStay() {
  useProtectedRoute('client')
  const { userLocation } = useMap()
  
  const [stays, setStays] = useState([])
  const [selectedStay, setSelectedStay] = useState(null)
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    type: 'all',
    amenities: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchLocation, setSearchLocation] = useState(null)

  // Fetch available stays
  useEffect(() => {
    const fetchStays = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('stays')
          .select('*')
          .eq('status', 'available')
          // Add more filters based on user selection
          
        if (error) throw error

        setStays(data || [])
      } catch (error) {
        console.error('Error fetching stays:', error)
        setError('Failed to fetch available stays')
      } finally {
        setLoading(false)
      }
    }

    fetchStays()
  }, [filters])

  // Calculate markers for the map
  const markers = stays.map(stay => ({
    coordinates: [stay.longitude, stay.latitude],
    options: { color: '#f59e0b' }
  }))

  // Calculate popups for the map
  const popups = stays.map(stay => ({
    coordinates: [stay.longitude, stay.latitude],
    content: `
      <div class="p-2">
        <h3 class="font-semibold">${stay.name}</h3>
        <p class="text-sm text-gray-600">$${stay.price_per_night}/night</p>
        <p class="text-sm text-gray-600">Rating: ${stay.rating}⭐</p>
      </div>
    `
  }))

  const handleStaySelect = (stay) => {
    setSelectedStay(stay)
    setSearchLocation([stay.longitude, stay.latitude])
  }

  const handleBookStay = async (stay) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            stay_id: stay.id,
            status: 'pending',
            // Add more booking details
          }
        ])

      if (error) throw error

      // Navigate to booking confirmation page
      // navigate(`/bookings/${data[0].id}`)
    } catch (error) {
      console.error('Error booking stay:', error)
      setError('Failed to book stay. Please try again.')
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
          initialCenter={searchLocation || userLocation}
          className="h-[600px]"
        />
      </div>

      {/* Stays List Section */}
      <div className="w-full md:w-96">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Find a Stay</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (per night)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full"
                />
                <span className="text-sm text-gray-600">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  type: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Private Room</option>
              </select>
            </div>
          </div>

          {/* Stays List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : stays.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No stays available matching your criteria
              </p>
            ) : (
              stays.map(stay => (
                <div
                  key={stay.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedStay?.id === stay.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => handleStaySelect(stay)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{stay.name}</h3>
                      <p className="text-sm text-gray-600">{stay.type}</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-600">
                          Rating: {stay.rating}
                        </span>
                        <span className="text-yellow-400 ml-1">⭐</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-primary">
                        ${stay.price_per_night}
                      </div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  </div>

                  {selectedStay?.id === stay.id && (
                    <div className="mt-4">
                      <button
                        onClick={() => handleBookStay(stay)}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Booking...' : 'Book Now'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
