'use client'

import { useState } from 'react'

const DESC_LIMIT = 160   // chars before "Read more" appears

export default function LocationCard({ location, isSelected, isInTour, onClick, onAddToTour }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = (location.description?.length ?? 0) > DESC_LIMIT

  // Placeholder until real images are added
  const imgSrc = `https://placehold.co/400x225/EDE8D5/AC9D73?text=${encodeURIComponent(location.name)}`

  return (
    <article
      className={`location-card${isSelected ? ' location-card--selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-pressed={isSelected}
    >
      {/* ── Image ── */}
      <img
        className="location-card__img"
        src={imgSrc}
        alt={location.name}
        loading="lazy"
      />

      {/* ── Body ── */}
      <div className="location-card__body">

        {location.category?.name && (
          <p className="location-card__category">#{location.category.name}</p>
        )}

        <h2 className="location-card__name">{location.name}</h2>

        {location.stories.length > 0 && (
          <p className="location-card__stories">
            {location.stories.join(' · ')}
          </p>
        )}

        {/* Description — clamped until expanded */}
        <div className={`location-card__desc-wrap${isLong && !expanded ? ' location-card__desc-wrap--clamped' : ''}`}>
          <p className="location-card__desc">{location.description}</p>
        </div>

        {isLong && (
          <button
            className="location-card__readmore"
            onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
          >
            {expanded ? 'Read less ↑' : 'Read more ↓'}
          </button>
        )}

        {/* Action row — always at bottom */}
        <div className="location-card__actions">
          {location.maps_url && (
            <a
              className="location-card__map-btn"
              href={location.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              Map It Out
            </a>
          )}
          <button
            className={`location-card__tour-btn${isInTour ? ' location-card__tour-btn--added' : ''}`}
            onClick={(e) => { e.stopPropagation(); onAddToTour?.(location) }}
            aria-label={isInTour ? 'Already in tour' : 'Add to tour'}
          >
            {isInTour ? '✓' : '+'}
          </button>
        </div>

      </div>
    </article>
  )
}
