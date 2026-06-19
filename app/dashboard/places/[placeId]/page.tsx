import { notFound } from "next/navigation";
import { getPlaceById } from "@/data/places";
import { EditPlaceForm } from "@/components/edit-place-form";

interface EditPlacePageProps {
  params: Promise<{ placeId: string }>;
}

export default async function EditPlacePage({ params }: EditPlacePageProps) {
  const { placeId } = await params;
  const place = await getPlaceById(placeId);

  if (!place) notFound();

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight">
          Edit place
        </h1>
        <EditPlaceForm place={place} />
      </div>
    </div>
  );
}
