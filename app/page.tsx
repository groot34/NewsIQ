import { SignedIn, UserButton } from "@clerk/nextjs";
import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      <Hero />
      <Features />
      <HowItWorks />

      <SignedIn>
        <div className="fixed top-4 right-4 z-50">
          <UserButton />
        </div>
      </SignedIn>

      <CTA />
      
      {/* Footer */}
      <footer className="bg-[#0a0f1a] border-t border-slate-800 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold premium-gradient-text">NewsIQ</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} NewsIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
