'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import LocationCard from './LocationCard'
import TourTray from './TourTray'
import './LocationPage.css'

// Leaflet must never run on the server
const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false })

// Category display order
const CATEGORY_ORDER = [
  'street', 'bridge', 'waterway', 'park',
  'pub-restaurant', 'shop-market',
  'church', 'institution', 'transport', 'civic-industrial',
]

export default function LocationsPage({ locations }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId,   setSelectedId]   = useState(null)
  const [tourStops,    setTourStops]    = useState([])
  const cardRefs = useRef({})
  const tourSynced = useRef(false)

  // Load from localStorage after hydration (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dubliners-tour') || '[]')
      setTourStops(saved)
    } catch {}
  }, [])

  // Keep localStorage in sync — skip the very first run so we don't overwrite before loading
  useEffect(() => {
    if (!tourSynced.current) { tourSynced.current = true; return }
    localStorage.setItem('dubliners-tour', JSON.stringify(tourStops))
  }, [tourStops])

  // Build sorted unique category list from actual data
  const categories = CATEGORY_ORDER
    .map((slug) => {
      const match = locations.find((l) => l.category?.slug === slug)
      return match ? { slug, name: match.category.name } : null
    })
    .filter(Boolean)

  const filtered =
    activeFilter === 'all'
      ? locations
      : locations.filter((l) => l.category?.slug === activeFilter)

  const handleFilterChange = (slug) => {
    setActiveFilter(slug)
    setSelectedId(null)
  }

  // Card clicked → tell map to fly there
  const handleCardClick = useCallback((id) => {
    setSelectedId(id)
  }, [])

  // Marker clicked → open popup on map only, no page scroll
  const handleMarkerClick = useCallback((id) => {
    setSelectedId(id)
  }, [])

  // Tour handlers
  const handleAddToTour = useCallback((loc) => {
    setTourStops(prev =>
      prev.find(s => s.id === loc.id)
        ? prev   // already added — do nothing
        : [...prev, { id: loc.id, name: loc.name, slug: loc.slug, lat: loc.lat, lng: loc.lng }]
    )
  }, [])

  const handleRemoveFromTour = useCallback((id) => {
    setTourStops(prev => prev.filter(s => s.id !== id))
  }, [])

  const handleClearTour = useCallback(() => {
    setTourStops([])
  }, [])

  return (
    <div className="locations-page">

      {/* ── Header ── */}
      <section className="locations-header">
        <h1 className="locations-header__title">Following the Dubliners</h1>
        <p className="locations-header__lead">
          Trace the streets, bridges, and landmarks that Joyce wove into his stories.
          Select a location to find it on the map, or click any marker to learn more.
        </p>
      </section>

      {/* ── Filter bar ── */}
      <div className="filter-bar" role="navigation" aria-label="Filter by category">
        <button
          className={`filter-btn${activeFilter === 'all' ? ' filter-btn--active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All&nbsp;
          <span className="filter-btn__count">{locations.length}</span>
        </button>

        {categories.map((cat) => {
          const count = locations.filter((l) => l.category?.slug === cat.slug).length
          return (
            <button
              key={cat.slug}
              className={`filter-btn${activeFilter === cat.slug ? ' filter-btn--active' : ''}`}
              onClick={() => handleFilterChange(cat.slug)}
            >
              {cat.name}&nbsp;
              <span className="filter-btn__count">{count}</span>
            </button>
          )
        })}
      </div>

      {/* ── Interactive map ── */}
      <MapComponent
        locations={filtered}
        selectedId={selectedId}
        onMarkerClick={handleMarkerClick}
        onAddToTour={handleAddToTour}
      />

      {/* ── Cards grid ── */}
      <section className="locations-grid" aria-label="Location cards">
        {filtered.length === 0 && (
          <p className="locations-empty">No locations in this category yet.</p>
        )}
        {filtered.map((loc) => (
          <div
            key={loc.id}
            ref={(el) => { cardRefs.current[loc.id] = el }}
          >
            <LocationCard
              location={loc}
              isSelected={selectedId === loc.id}
              isInTour={tourStops.some(s => s.id === loc.id)}
              onClick={() => handleCardClick(loc.id)}
              onAddToTour={handleAddToTour}
            />
          </div>
        ))}
      </section>

      {/* ── Floating tour tray ── */}
      <TourTray
        stops={tourStops}
        onRemove={handleRemoveFromTour}
        onClear={handleClearTour}
      />

    </div>
  )
}
