import { NewPlaceForm } from "@/components/new-place-form";

export default function NewPlacePage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          Log a place
        </h1>
        <NewPlaceForm />
      </div>
    </div>
  );
}
