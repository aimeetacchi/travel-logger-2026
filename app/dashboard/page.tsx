import { getUserPlaces } from "@/data/places"
import { PlaceLog } from "@/components/place-log"

export default async function DashboardPage() {
  const places = await getUserPlaces()

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Travel Log
      </h1>
      <PlaceLog places={places} />
    </div>
  )
}
