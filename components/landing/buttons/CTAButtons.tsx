import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function CTAButtons() {
  const { userId } = await auth();

  return (
    <>
      {/* Signed out users */}
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
          >
            Get Started <ArrowRight className="ml-2 size-4" />
          </Button>
        </SignInButton>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full sm:w-auto border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600"
        >
          <Link href="#how-it-works">Learn More</Link>
        </Button>
      </SignedOut>

      {/* Signed in users */}
      <SignedIn>
        <Button 
          size="lg" 
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30" 
          asChild
        >
          <Link
            href="/dashboard"
            className="flex items-center justify-center"
          >
            Go to Dashboard <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </SignedIn>
    </>
  );
}

export default CTAButtons;
