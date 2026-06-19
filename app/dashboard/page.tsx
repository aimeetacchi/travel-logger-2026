import { getUserPlaces } from "@/data/places"
import { PlaceLog } from "@/components/place-log"
import { Card, CardContent } from "@/components/ui/card"
import { MapPinIcon } from "lucide-react"

export default async function DashboardPage() {
  const places = await getUserPlaces()

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-8">
      <Card className="relative overflow-hidden border-0 bg-primary text-primary-foreground">
        <CardContent className="flex items-center gap-6 p-8">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10">
            <MapPinIcon className="size-7" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Travel Log</h1>
            <p className="mt-1 text-sm text-primary-foreground/70">
              {places.length === 0
                ? "No places logged yet. Add your first one."
                : `${places.length} place${places.length === 1 ? "" : "s"} logged across your travels.`}
            </p>
          </div>
        </CardContent>
        <div className="pointer-events-none absolute -right-8 -top-8 size-48 rounded-full bg-primary-foreground/5" />
        <div className="pointer-events-none absolute -bottom-10 right-16 size-32 rounded-full bg-primary-foreground/5" />
      </Card>

      <PlaceLog places={places} />
    </div>
  )
}
