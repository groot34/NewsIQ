import { Check } from "lucide-react";
import CTAButtons from "./buttons/CTAButtons";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-[#0a0f1a] py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent" />
        <div className="absolute inset-0 grid-pattern" />
      </div>
      
      {/* Ambient orbs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-600/30 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to Save Hours{" "}
            <span className="premium-gradient-text">Every Week?</span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-400">
            Join thousands of newsletter creators who are already using AI to
            streamline their content creation.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButtons />
          </div>

          {/* Trust signals */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="size-5 text-emerald-400" />
              <span className="text-sm">Free to get started</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="size-5 text-emerald-400" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-300">
              <Check className="size-5 text-emerald-400" />
              <span className="text-sm">AI-powered generation</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
    </section>
  );
}
