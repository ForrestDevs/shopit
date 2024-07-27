import Link from "next/link";
import { api, HydrateClient } from "@/lib/trpc/server";
import { ImageUploader } from "@/components/image-upload";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-neutral-50 to-neutral-400">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="mb-8 flex flex-col items-center justify-center">
            <h1 className="mb-2 text-3xl font-bold text-primary">Shop-It</h1>
            <p className="text-muted-foreground">
              Upload an image to detect fashion items
            </p>
          </div>

          <ImageUploader />
        </div>
      </main>
    </HydrateClient>
  );
}
