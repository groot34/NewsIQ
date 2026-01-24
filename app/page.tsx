import {Hero} from "@/components/landing/hero";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black">
      <h1>Hello World</h1>

            <Hero />
      {/* <Features />
      <HowItWorks /> */}

      <SignedIn>
        <div className="fixed top-4 right-4">
          <UserButton />
        </div>
      </SignedIn>

      {/* <Pricing />
      <CTA /> */}
    </main>
  );
}
