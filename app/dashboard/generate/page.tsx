import { Suspense } from "react";
import { NewsletterGenerationPage } from "@/components/dashboard/newsletter-generation-page";
import { NewsletterLoadingCard } from "@/components/dashboard/newsletter-loading-card";

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-950">
          <div className="container mx-auto py-12 px-6 lg:px-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Newsletter Generation
              </h1>
            </div>
            <NewsletterLoadingCard />
          </div>
        </div>
      }
    >
      <NewsletterGenerationPage />
    </Suspense>
  );
}
