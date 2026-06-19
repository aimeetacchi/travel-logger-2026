"use client"

import { useState, useEffect } from "react"
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPinIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { getUserPlaces } from "@/data/places"

type Place = Awaited<ReturnType<typeof getUserPlaces>>[number]

interface PlaceLogProps {
  places: Place[]
}

const START_MONTH = new Date(2000, 0)
const END_YEAR = new Date().getFullYear() + 2

export function PlaceLog({ places }: PlaceLogProps) {
  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { from, to } = range ?? {}

  const filteredPlaces = from
    ? places.filter((p) => {
        const date = parseISO(p.visitedOn)
        if (to) {
          return isWithinInterval(date, {
            start: startOfDay(from),
            end: endOfDay(to),
          })
        }
        return format(date, "yyyy-MM-dd") === format(from, "yyyy-MM-dd")
      })
    : places

  function rangeLabel() {
    if (from && to) {
      return `${format(from, "do MMM yyyy")} – ${format(to, "do MMM yyyy")}`
    }
    if (from) {
      return format(from, "do MMM yyyy")
    }
    return `All places (${places.length})`
  }

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      <Card className="w-fit shrink-0">
        <CardContent className="p-2">
          {mounted && (
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              captionLayout="dropdown"
              startMonth={START_MONTH}
              endMonth={new Date(END_YEAR, 11)}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex-1 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Log a new place</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Record a country, city, and date you visited.
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon className="size-4 mr-1" />
                  Add place
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a new place</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Form coming soon.
                </p>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium">{rangeLabel()}</h2>
          {from && (
            <Button variant="ghost" size="sm" onClick={() => setRange(undefined)}>
              Clear
            </Button>
          )}
        </div>

        {filteredPlaces.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {from ? "No places logged for this period." : "No places logged yet."}
          </p>
        ) : (
          filteredPlaces.map((place) => (
            <Card key={place.id}>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-1">
                <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <CardTitle className="text-base">{place.country}</CardTitle>
                  {place.city && (
                    <p className="text-sm text-muted-foreground">{place.city}</p>
                  )}
                </div>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {format(parseISO(place.visitedOn), "do MMM yyyy")}
                </p>
              </CardHeader>
              {place.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {place.description}
                  </p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
