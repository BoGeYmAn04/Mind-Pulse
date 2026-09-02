import { Link } from "react-router-dom";
import { ArrowUpRight, Moon, Dumbbell, Clock3, Smartphone, BookOpen, Gauge as GaugeIcon, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Gauge } from "@/components/Gauge";
import { ThemeToggle } from "@/components/ThemeToggle";

const INPUTS = [
  { icon: Smartphone, label: "Screen time", detail: "Daily usage and phone unlock patterns." },
  { icon: BookOpen, label: "Study load", detail: "The amount of time spent on coursework." },
  { icon: Dumbbell, label: "Movement", detail: "Physical activity built into your routine." },
  { icon: Moon, label: "Sleep", detail: "Your average nightly recovery time." },
  { icon: Clock3, label: "Stress", detail: "How intense your day-to-day feels." },
];

const STEPS = [
  ["01", "Answer a few questions", "Share the daily habits and context you already know."],
  ["02", "See the pattern", "The prediction model considers your inputs together rather than relying on one answer."],
  ["03", "Reflect on your score", "Get a 0–10 mental-health score as an informational wellness indicator, not a diagnosis."],
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,hsl(var(--primary)/.13),transparent_30%),radial-gradient(circle_at_85%_15%,hsl(var(--brand-sage)/.13),transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[28rem] -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight">
          Mind Pulse<span className="text-primary">.</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/analysis"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start analysis
          </Link>
        </div>
      </nav>

      <header className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-10 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Student wellness analytics
          </div>
          <h1 className="font-display text-5xl leading-[.98] tracking-tight sm:text-7xl">
            Understand your <span className="italic text-primary">rhythm.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Screen time, sleep, study load, movement, and stress can interact. Mind Pulse turns those everyday inputs
            into a simple prediction you can use as a moment of reflection.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/analysis"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span>Start analysis</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <span className="text-sm text-muted-foreground">~1 minute · no sign-up</span>
          </div>
        </div>

        <Card className="relative overflow-hidden border-primary/10 bg-card/80 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl sm:p-10">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative flex flex-col items-center text-center">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">Sample score</span>
            <Gauge value={7.4} size={250} />
            <div className="-mt-3 flex items-baseline gap-1">
              <span className="font-mono-brand text-5xl font-bold">7.4</span>
              <span className="font-mono-brand text-sm text-muted-foreground">/10</span>
            </div>
            <p className="mt-2 font-display text-xl italic text-primary">Good mental well-being</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
              Your actual result is calculated from the answers you enter.
            </p>
          </div>
        </Card>
      </header>

      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <div className="max-w-2xl">
            <p className="font-mono-brand text-xs uppercase tracking-[.2em] text-primary">What we look at</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight">Small signals. One picture.</h2>
            <p className="mt-3 text-muted-foreground">A balanced view of the habits that shape your everyday rhythm.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INPUTS.map(({ icon: Icon, label, detail }) => (
              <Card key={label} className="group border-border/70 bg-card/70 p-5 transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <p className="font-mono-brand text-xs uppercase tracking-[.2em] text-primary">The process</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight">How it works</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {STEPS.map(([n, title, body]) => (
            <div key={n} className="border-t border-border pt-5">
              <span className="font-mono-brand text-xs text-primary">{n}</span>
              <h3 className="mt-4 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-8">
        <Card className="relative overflow-hidden border-0 bg-primary p-8 text-primary-foreground shadow-2xl shadow-primary/20 sm:p-12">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <GaugeIcon className="h-7 w-7 opacity-80" />
              <h2 className="mt-4 max-w-md font-display text-3xl leading-tight">Curious what your week adds up to?</h2>
            </div>
            <Link
              to="/analysis"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-secondary px-7 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Read my score
            </Link>
          </div>
        </Card>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-muted-foreground sm:px-8">
        Informational wellness tool only — not a clinical assessment or diagnosis.
      </footer>
    </div>
  );
}
