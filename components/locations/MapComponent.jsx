'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Category → marker colour mapping
const CATEGORY_COLOURS = {
  street:           '#8B7355',
  waterway:         '#4A8FA4',
  bridge:           '#5B8A5B',
  park:             '#6A9955',
  'pub-restaurant': '#B85C2C',
  'shop-market':    '#C19A3A',
  church:           '#8B6B8B',
  institution:      '#4A6B8C',
  transport:        '#7A6B9C',
  'civic-industrial': '#6B7A5B',
}

function makeIcon(categorySlug, isSelected) {
  const colour = CATEGORY_COLOURS[categorySlug] || '#8B7355'
  const size   = isSelected ? 18 : 12
  const border = isSelected ? '3px' : '2px'
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${colour};
      border:${border} solid #FDFBF7;
      border-radius:50%;
      box-shadow:0 1px 5px rgba(0,0,0,.45);
      transition:width .15s,height .15s;
    "></div>`,
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}

// Inner component — calls useMap() which requires being inside <MapContainer>
function MapController({ selectedId, locations, onMarkerClick, onAddToTour }) {
  const map         = useMap()
  const markerRefs  = useRef({})

  // Fly to + open popup when a card is selected
  useEffect(() => {
    if (!selectedId) return
    const loc = locations.find((l) => l.id === selectedId)
    if (!loc?.lat || !loc?.lng) return
    map.flyTo([loc.lat, loc.lng], 16, { duration: 1.2 })
    const marker = markerRefs.current[selectedId]
    if (marker) setTimeout(() => marker.openPopup(), 1300)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {locations.map((loc) => {
        if (!loc.lat || !loc.lng) return null
        const isSelected = selectedId === loc.id
        return (
          <Marker
            key={`${loc.id}-${isSelected}`}
            position={[loc.lat, loc.lng]}
            icon={makeIcon(loc.category?.slug, isSelected)}
            ref={(el) => { markerRefs.current[loc.id] = el }}
            eventHandlers={{ click: () => onMarkerClick(loc.id) }}
          >
            <Popup className="dubliners-popup" minWidth={220} maxWidth={260}>
              <div className="popup-inner">

                {loc.category?.name && (
                  <span className="popup-cat">#{loc.category.name}</span>
                )}

                <strong className="popup-name">{loc.name}</strong>

                {loc.stories.length > 0 && (
                  <em className="popup-stories">{loc.stories.join(' · ')}</em>
                )}

                <div className="popup-actions">
                  {/* View Location — links to the individual page (page not built yet) */}
                  <Link
                    href={`/locations/${loc.slug}`}
                    className="popup-btn popup-btn--view"
                  >
                    View Location →
                  </Link>

                  {/* Add to Tour — wired up when walking tour is built */}
                  <button
                    className="popup-btn popup-btn--tour"
                    onClick={() => onAddToTour?.(loc)}
                  >
                    + Tour
                  </button>
                </div>

              </div>
            </Popup>
          </Marker>
        )
      })}
    </>
  )
}

export default function MapComponent({ locations, selectedId, onMarkerClick, onAddToTour }) {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={[53.3479, -6.2603]}
        zoom={13}
        className="leaflet-map"
        scrollWheelZoom
        zoomControl
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <MapController
          selectedId={selectedId}
          locations={locations}
          onMarkerClick={onMarkerClick}
          onAddToTour={onAddToTour}
        />
      </MapContainer>
    </div>
  )
}
