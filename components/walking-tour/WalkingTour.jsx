'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import './walking-tour.css'

/* ─────────────────────────────────────────────
   Distance helpers
───────────────────────────────────────────── */
function haversine(lat1, lng1, lat2, lng2) {
  const R     = 6371
  const toRad = (d) => (d * Math.PI) / 180
  const dLat  = toRad(lat2 - lat1)
  const dLng  = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

function nearestNeighbour(stops) {
  if (stops.length <= 1) return stops
  const result    = [stops[0]]
  const remaining = [...stops.slice(1)]
  while (remaining.length > 0) {
    const last = result[result.length - 1]
    let nearestIdx  = 0
    let nearestDist = Infinity
    remaining.forEach((s, i) => {
      const d = haversine(last.lat, last.lng, s.lat, s.lng)
      if (d < nearestDist) { nearestDist = d; nearestIdx = i }
    })
    result.push(remaining[nearestIdx])
    remaining.splice(nearestIdx, 1)
  }
  return result
}

function buildMapsUrl(stops) {
  const waypoints = stops.slice(0, 25).map((s) => `${s.lat},${s.lng}`).join('/')
  return `https://www.google.com/maps/dir/${waypoints}?travelmode=walking`
}

function fmtKm(km) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function WalkingTour() {
  const [stops,   setStops]   = useState([])
  const [visited, setVisited] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const saved = JSON.parse(localStorage.getItem('dubliners-tour') || '[]')
      if (!saved.length) { setLoading(false); return }

      const { data } = await supabase
        .from('locations')
        .select(`
          id, name, description, maps_url, lat, lng,
          categories ( name, slug ),
          location_stories ( stories ( title ) )
        `)
        .in('id', saved.map((s) => s.id))

      if (data) {
        const shaped = data.map((loc) => ({
          id:          loc.id,
          name:        loc.name,
          slug:        loc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: loc.description,
          maps_url:    loc.maps_url,
          lat:         loc.lat,
          lng:         loc.lng,
          category:    loc.categories,
          stories:     loc.location_stories.map((ls) => ls.stories?.title).filter(Boolean),
        }))
        setStops(nearestNeighbour(shaped))
      }

      setVisited(JSON.parse(localStorage.getItem('dubliners-visited') || '{}'))
      setLoading(false)
    }
    load()
  }, [])

  function toggleVisited(id) {
    setVisited((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem('dubliners-visited', JSON.stringify(next))
      return next
    })
  }

  /* Stats */
  const totalKm = stops.reduce((sum, s, i) => {
    if (i === 0) return 0
    return sum + haversine(stops[i - 1].lat, stops[i - 1].lng, s.lat, s.lng)
  }, 0)
  const walkingMins  = Math.round(totalKm * 12)   // ~5 km/h → 12 min/km
  const visitedCount = Object.values(visited).filter(Boolean).length

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="wt-loading">
        <p>Preparing your tour…</p>
      </div>
    )
  }

  /* ── Empty state ── */
  if (!stops.length) {
    return (
      <div className="wt-empty">
        <h1 className="wt-empty__title">Your tour is empty</h1>
        <p className="wt-empty__lead">
          Head back to the Locations page and press <strong>+</strong> on the
          places you want to visit.
        </p>
        <Link href="/locations" className="wt-empty__link">
          ← Browse Locations
        </Link>
      </div>
    )
  }

  /* ── Tour ── */
  return (
    <div className="wt">

      {/* ── Header ── */}
      <header className="wt-header">
        <p className="wt-header__eyebrow">Retellings Dubliners</p>
        <h1 className="wt-header__title">Your Walking Tour</h1>
        <p className="wt-header__stats">
          {stops.length} stop{stops.length !== 1 ? 's' : ''}
          &ensp;·&ensp;{fmtKm(totalKm)} total
          &ensp;·&ensp;~{walkingMins} min walking
          {visitedCount > 0 && (
            <span className="wt-header__progress">
              &ensp;·&ensp;{visitedCount} of {stops.length} visited
            </span>
          )}
        </p>

        {/* ── Actions (hidden on print) ── */}
        <div className="wt-header__actions no-print">
          <a
            className="wt-btn wt-btn--primary"
            href={buildMapsUrl(stops)}
            target="_blank"
            rel="noopener noreferrer"
          >
            🗺 Open in Google Maps
          </a>
          <button
            className="wt-btn wt-btn--secondary"
            onClick={() => window.print()}
          >
            🖨 Print Guide
          </button>
          <Link href="/locations" className="wt-btn wt-btn--ghost">
            ← Edit Stops
          </Link>
        </div>
      </header>

      {/* ── Stop list ── */}
      <ol className="wt-list">
        {stops.map((stop, i) => {
          const isVisited   = !!visited[stop.id]
          const distToNext  = i < stops.length - 1
            ? haversine(stop.lat, stop.lng, stops[i + 1].lat, stops[i + 1].lng)
            : null
          const imgSrc = `https://placehold.co/800x450/EDE8D5/AC9D73?text=${encodeURIComponent(stop.name)}`

          return (
            <li
              key={stop.id}
              className={`wt-stop${isVisited ? ' wt-stop--visited' : ''}`}
            >
              {/* ── Stop header ── */}
              <div className="wt-stop__header">
                <label className="wt-stop__check no-print">
                  <input
                    type="checkbox"
                    checked={isVisited}
                    onChange={() => toggleVisited(stop.id)}
                  />
                  <span className="wt-stop__checkmark" />
                </label>

                <div className="wt-stop__num">{String(i + 1).padStart(2, '0')}</div>

                <div className="wt-stop__title-group">
                  {stop.category?.name && (
                    <span className="wt-stop__category">#{stop.category.name}</span>
                  )}
                  <h2 className="wt-stop__name">{stop.name}</h2>
                  {stop.stories.length > 0 && (
                    <p className="wt-stop__stories">{stop.stories.join(' · ')}</p>
                  )}
                </div>

                {stop.maps_url && (
                  <a
                    className="wt-stop__ext no-print"
                    href={stop.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open in Google Maps"
                  >
                    ↗
                  </a>
                )}
              </div>

              {/* ── Image ── */}
              <img
                className="wt-stop__img"
                src={imgSrc}
                alt={stop.name}
                loading="lazy"
              />

              {/* ── Description ── */}
              {stop.description && (
                <p className="wt-stop__desc">{stop.description}</p>
              )}

              {/* ── Distance connector ── */}
              {distToNext !== null && (
                <div className="wt-stop__connector no-print">
                  <span className="wt-stop__connector-line" />
                  <span className="wt-stop__connector-label">
                    {fmtKm(distToNext)} to next stop
                  </span>
                  <span className="wt-stop__connector-line" />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      {/* ── Footer ── */}
      <footer className="wt-footer no-print">
        <Link href="/locations" className="wt-btn wt-btn--ghost">
          ← Back to Locations
        </Link>
      </footer>

    </div>
  )
}
