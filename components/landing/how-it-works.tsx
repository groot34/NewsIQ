import { Calendar, Rss, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Rss,
    title: "Connect Your RSS Feeds",
    description:
      "Add your favorite RSS feeds from our curated collection or enter custom URLs. We'll automatically fetch and organize content from all your sources.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Calendar,
    title: "Choose Timeframe & Add Context",
    description:
      "Select your newsletter timeframe (weekly, monthly, or custom dates) and add any personal context or notes for the AI.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Get AI-Generated Content",
    description:
      "Instantly receive 5 title options, 5 subject lines, a complete newsletter body, and top 5 announcements. Copy and paste into any email platform.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 bg-[#0d1220] relative"
    >
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Create professional newsletters in three simple steps
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-slate-700 to-transparent lg:block" />
                  )}

                  <div className="relative flex flex-col items-center text-center">
                    {/* Number badge */}
                    <div className={`mb-4 flex size-24 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} text-2xl font-bold text-white shadow-lg shadow-${step.gradient.split('-')[1]}-500/25`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-4 flex size-16 items-center justify-center rounded-lg glass-card">
                      <Icon className="size-8 text-blue-400" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
