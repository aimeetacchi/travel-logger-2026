import Link from "next/link"
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { MapPinIcon } from "lucide-react"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 text-center">
      <div className="flex flex-col items-center gap-6 max-w-lg">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <MapPinIcon className="size-8" />
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Travel Logger
          </h1>
          <p className="text-lg text-muted-foreground">
            Keep a personal record of every place you visit. Browse your travels
            by date and relive the memories.
          </p>
        </div>

        <div className="flex gap-3">
          <Show when="signed-in">
            <Button asChild size="lg">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </Show>
          <Show when="signed-out">
            <SignUpButton mode="modal">
              <Button size="lg">Get started</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">Sign in</Button>
            </SignInButton>
          </Show>
        </div>
      </div>
    </main>
  )
}
