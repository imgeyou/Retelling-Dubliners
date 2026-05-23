'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TourTray({ stops, onRemove, onClear }) {
  const [open, setOpen] = useState(false)

  // Auto-open the tray when the first stop is added
  useEffect(() => {
    if (stops.length === 1) setOpen(true)
  }, [stops.length])

  return (
    <div className={`tour-tray${open ? ' tour-tray--open' : ''}`}>

      {/* ── Expandable panel ── */}
      {open && (
        <div className="tour-tray__panel">
          {stops.length === 0 ? (
            <p className="tour-tray__empty">
              No stops yet — click <strong>+ Tour</strong> on any location.
            </p>
          ) : (
            <>
              <ol className="tour-tray__list">
                {stops.map((loc) => (
                  <li key={loc.id} className="tour-tray__stop">
                    <span className="tour-tray__stop-name">{loc.name}</span>
                    <button
                      className="tour-tray__remove"
                      onClick={() => onRemove(loc.id)}
                      aria-label={`Remove ${loc.name} from tour`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ol>

              <div className="tour-tray__footer">
                <button className="tour-tray__clear" onClick={onClear}>
                  Clear all
                </button>
                <Link href="/walking-tour" className="tour-tray__view">
                  View Full Tour →
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Toggle tab ── */}
      <button
        className="tour-tray__tab"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="tour-tray__tab-icon">🗺</span>
        <span className="tour-tray__tab-label">My Tour</span>
        {stops.length > 0 && (
          <span className="tour-tray__tab-count">{stops.length}</span>
        )}
        <span className="tour-tray__tab-chevron">{open ? '▼' : '▲'}</span>
      </button>

    </div>
  )
}
