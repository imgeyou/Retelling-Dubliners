import { supabase } from '@/lib/supabase'
import LocationsPage from '@/components/locations/LocationPage'

export const metadata = {
  title: 'Locations | Retellings Dubliners',
  description: "Explore the real Dublin streets and landmarks from James Joyce's Dubliners.",
}

export default async function LocationsRoute() {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      id,
      name,
      description,
      maps_url,
      lat,
      lng,
      categories ( name, slug ),
      location_stories ( stories ( title ) )
    `)
    .order('name')

  if (error) {
    console.error('Supabase error:', error)
    return (
      <main style={{ padding: '4rem', textAlign: 'center', color: '#2A2419' }}>
        <h1>Could not load locations</h1>
        <p>Please try again later.</p>
      </main>
    )
  }

  // Flatten the relational shape into something easy to consume client-side
  const locations = data.map((loc) => ({
    id: loc.id,
    name: loc.name,
    slug: loc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: loc.description,
    maps_url: loc.maps_url,
    lat: loc.lat,
    lng: loc.lng,
    category: loc.categories,
    stories: loc.location_stories
      .map((ls) => ls.stories?.title)
      .filter(Boolean),
  }))

  return <LocationsPage locations={locations} />
}
