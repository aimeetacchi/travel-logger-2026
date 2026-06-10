"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPinIcon } from "lucide-react"

const MOCK_PLACES: Record<string, { name: string; note: string }[]> = {
  "2026-06-09": [
    { name: "Colosseum", note: "Arrived early, beat the crowds" },
    { name: "Trevi Fountain", note: "Threw a coin, made a wish" },
    { name: "Pantheon", note: "Free entry before 9am" },
  ],
  "2026-06-08": [
    { name: "Vatican Museums", note: "Booked skip-the-line tickets" },
    { name: "St. Peter's Basilica", note: "Climbed to the dome" },
  ],
  "2026-06-10": [
    { name: "Borghese Gallery", note: "Bernini sculptures are incredible" },
  ],
}

function toKey(date: Date) {
  return format(date, "yyyy-MM-dd")
}

export default function DashboardPage() {
  const [selected, setSelected] = useState<Date>(new Date(2026, 5, 9))

  const places = MOCK_PLACES[toKey(selected)] ?? []

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Travel Log
      </h1>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <Card className="w-fit shrink-0">
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={(day) => day && setSelected(day)}
            />
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <h2 className="text-lg font-medium">
            {format(selected, "do MMM yyyy")}
          </h2>

          {places.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No places logged for this day.
            </p>
          ) : (
            places.map((place) => (
              <Card key={place.name}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-1">
                  <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                  <CardTitle className="text-base">{place.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{place.note}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
