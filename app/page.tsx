import { SignedIn, UserButton } from "@clerk/nextjs";
import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <h1 className="bg-red-500 text-white text-3xl">hello World !!</h1>
      <Hero />
      <Features />
      <HowItWorks />

      <SignedIn>
        <div className="fixed top-4 right-4">
          <UserButton />
        </div>
      </SignedIn>

      <Pricing />
      <CTA />
    </main>
  );
}
