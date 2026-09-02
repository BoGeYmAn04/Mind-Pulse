import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2, Moon, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { Gauge } from "@/components/Gauge";
import { StressLevelSelect } from "@/components/StressLevelSelect";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ApiError, predictScore } from "@/lib/api";
import { EMPTY_STUDENT_DATA, type StudentData } from "@/lib/types";

type UiState = "idle" | "loading" | "result" | "error";

const COUNTRIES = ["India", "USA", "Canada", "Australia", "UK", "Germany", "Mexico", "Turkey", "France"];
const PLATFORMS = ["Facebook", "Instagram", "Snapchat", "Twitter", "YouTube", "TikTok", "LinkedIn", "LINE", "KakaoTalk", "VKontakte", "WhatsApp", "WeChat"];
const ACADEMIC_LEVELS = ["High School", "Undergraduate", "Graduate"];
const PURPOSES = ["Networking", "Education", "Entertainment", "News"];

const NUMERIC_BOUNDS: Partial<Record<keyof StudentData, [number, number]>> = {
  age: [10, 100],
  avg_daily_usage_hours: [0, 24],
  daily_unlocks: [0, Infinity],
  study_hours: [0, 24],
  physical_activity_hours: [0, 24],
  sleep_hours_per_night: [0, 24],
};

function bandFor(score: number) {
  if (score >= 7) return { label: "Good mental well-being", context: "Your prediction indicates a positive mental-health profile. Keep maintaining the routines, relationships, sleep, movement, and habits that help you feel balanced.", icon: "✓" };
  if (score >= 4) return { label: "Moderate mental well-being", context: "Your prediction sits in the middle range. Paying attention to rest, movement, study balance, sleep, and screen time may help support your well-being.", icon: "•" };
  return { label: "Needs attention", context: "Your prediction suggests that some areas of mental well-being may need more attention. Consider talking with someone you trust or a qualified professional if concerns are affecting daily life.", icon: "!" };
}

export default function AnalysisPage() {
  const [form, setForm] = useState<StudentData>(EMPTY_STUDENT_DATA);
  const [errors, setErrors] = useState<Partial<Record<keyof StudentData, string>>>({});
  const [uiState, setUiState] = useState<UiState>("idle");
  const [score, setScore] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  function update<K extends keyof StudentData>(key: K, value: StudentData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (uiState === "error") setUiState("idle");
  }

  function validate(payload: StudentData) {
    const next: Partial<Record<keyof StudentData, string>> = {};
    (Object.keys(NUMERIC_BOUNDS) as (keyof StudentData)[]).forEach((key) => {
      const [min, max] = NUMERIC_BOUNDS[key]!;
      const val = payload[key] as number;
      if (Number.isNaN(val) || val === undefined || val === null) next[key] = "Required";
      else if (val < min || val > max) next[key] = `Enter a value from ${min} to ${max === Infinity ? "∞" : max}`;
    });
    (["gender", "country", "academic_level", "most_used_platform", "purpose_of_use"] as (keyof StudentData)[]).forEach((key) => {
      if (!payload[key] || String(payload[key]).trim() === "") next[key] = "Required";
    });
    if (!payload.stress_level) next.stress_level = "Choose a stress level";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setUiState("loading");
    try {
      const data = await predictScore(form);
      const predicted = Number(data.predicted_mental_health_score);
      if (!Number.isFinite(predicted)) throw new ApiError("The server returned an invalid prediction.");
      setScore(Math.max(0, Math.min(10, predicted)));
      setUiState("result");
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError("Something unexpected happened. Please try again.");
      if (apiErr.fieldErrors?.length) {
        const fromApi: Partial<Record<keyof StudentData, string>> = {};
        apiErr.fieldErrors.forEach((fe) => (fromApi[fe.field as keyof StudentData] = fe.message));
        setErrors(fromApi);
      }
      setErrorMessage(apiErr.message);
      setUiState("error");
    }
  }

  function resetResult() {
    setScore(null);
    setErrorMessage("");
    setUiState("idle");
  }

  const err = (key: keyof StudentData) => errors[key];
  const resultBand = score === null ? null : bandFor(score);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#0b0d16]">
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_88%_8%,rgba(99,102,241,.14),transparent_30%),radial-gradient(circle_at_12%_42%,rgba(168,85,247,.08),transparent_28%)] dark:bg-[radial-gradient(circle_at_88%_8%,rgba(129,140,248,.14),transparent_30%),radial-gradient(circle_at_12%_42%,rgba(192,132,252,.07),transparent_28%)]" />
      <div className="relative z-10">

      <header className="mx-auto max-w-6xl px-6 pb-8 pt-6 sm:px-8">
        <nav className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">Mind Pulse<span className="text-primary">.</span></Link>
          <ThemeToggle />
        </nav>
        <Link to="/" className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <div className="mt-7 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Personalized analysis
          </span>
          <h1 className="mt-5 font-display text-4xl leading-none tracking-tight sm:text-6xl">
            Your mental health <span className="italic text-primary">pulse.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Answer the questions below. Your responses are sent to the prediction API and the returned score appears instantly in the result card.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 sm:px-8 lg:grid-cols-[1.45fr_.85fr] lg:items-start">
        <Card className="border-border/70 bg-card/85 p-6 shadow-xl shadow-primary/5 backdrop-blur-xl sm:p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            <fieldset className="space-y-5 border-b border-border pb-8">
              <Legend index="01" title="About you" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Age" error={err("age")}><Input type="number" min={10} max={100} placeholder="21" value={Number.isNaN(form.age) ? "" : form.age} onChange={(e) => update("age", e.target.value === "" ? NaN : parseInt(e.target.value, 10))} aria-invalid={!!err("age")} /><Hint>10–100 years</Hint></Field>
                <Field label="Gender" error={err("gender")}><Select value={form.gender} onValueChange={(v) => update("gender", v)}><SelectTrigger aria-invalid={!!err("gender")}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></Field>
                <Field label="Country" error={err("country")}>
                  <Select value={form.country} onValueChange={(v) => update("country", v)}>
                    <SelectTrigger aria-invalid={!!err("country")}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </fieldset>

            <fieldset className="space-y-5 border-b border-border pb-8">
              <Legend index="02" title="Academic & digital habits" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Academic level" error={err("academic_level")}><Select value={form.academic_level} onValueChange={(v) => update("academic_level", v)}><SelectTrigger aria-invalid={!!err("academic_level")}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{ACADEMIC_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></Field>
                <Field label="Most-used platform" error={err("most_used_platform")}><Select value={form.most_used_platform} onValueChange={(v) => update("most_used_platform", v)}><SelectTrigger aria-invalid={!!err("most_used_platform")}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></Field>
                <Field label="Primary purpose" error={err("purpose_of_use")}><Select value={form.purpose_of_use} onValueChange={(v) => update("purpose_of_use", v)}><SelectTrigger aria-invalid={!!err("purpose_of_use")}><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></Field>
                <Field label="Daily screen time" error={err("avg_daily_usage_hours")} unit="hrs"><Input type="number" step={0.1} min={0} max={24} placeholder="4.5" value={Number.isNaN(form.avg_daily_usage_hours) ? "" : form.avg_daily_usage_hours} onChange={(e) => update("avg_daily_usage_hours", e.target.value === "" ? NaN : parseFloat(e.target.value))} aria-invalid={!!err("avg_daily_usage_hours")} /></Field>
                <Field label="Daily phone unlocks" error={err("daily_unlocks")} unit="times"><Input type="number" min={0} placeholder="60" value={Number.isNaN(form.daily_unlocks) ? "" : form.daily_unlocks} onChange={(e) => update("daily_unlocks", e.target.value === "" ? NaN : parseInt(e.target.value, 10))} aria-invalid={!!err("daily_unlocks")} /></Field>
              </div>
            </fieldset>

            <fieldset className="space-y-5">
              <Legend index="03" title="Lifestyle & stress" />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Study hours / day" error={err("study_hours")} unit="hrs"><Input type="number" step={0.1} min={0} max={24} placeholder="6" value={Number.isNaN(form.study_hours) ? "" : form.study_hours} onChange={(e) => update("study_hours", e.target.value === "" ? NaN : parseFloat(e.target.value))} aria-invalid={!!err("study_hours")} /></Field>
                <Field label="Physical activity / day" error={err("physical_activity_hours")} unit="hrs"><Input type="number" step={0.1} min={0} max={24} placeholder="1" value={Number.isNaN(form.physical_activity_hours) ? "" : form.physical_activity_hours} onChange={(e) => update("physical_activity_hours", e.target.value === "" ? NaN : parseFloat(e.target.value))} aria-invalid={!!err("physical_activity_hours")} /></Field>
                <Field label="Sleep / night" error={err("sleep_hours_per_night")} unit="hrs"><Input type="number" step={0.1} min={0} max={24} placeholder="7.5" value={Number.isNaN(form.sleep_hours_per_night) ? "" : form.sleep_hours_per_night} onChange={(e) => update("sleep_hours_per_night", e.target.value === "" ? NaN : parseFloat(e.target.value))} aria-invalid={!!err("sleep_hours_per_night")} /></Field>
                <div className="space-y-2 sm:col-span-3">
                  <Label>Perceived stress level</Label>
                  <StressLevelSelect value={form.stress_level} onChange={(v) => update("stress_level", v)} hasError={!!err("stress_level")} />
                  {err("stress_level") && <p className="text-xs text-destructive">{err("stress_level")}</p>}
                </div>
              </div>
            </fieldset>

            <Button type="submit" size="lg" disabled={uiState === "loading"} className="w-full rounded-xl sm:w-auto">
              {uiState === "loading" ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating prediction…</> : "Generate prediction"}
            </Button>
          </form>
        </Card>

        <Card className="overflow-hidden border-border/70 bg-card/85 shadow-xl shadow-primary/5 backdrop-blur-xl lg:sticky lg:top-6">
          <div className="border-b border-border px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Analysis result</p>
          </div>
          <div className="flex min-h-[470px] flex-col items-center justify-center p-8 text-center">
            {uiState === "idle" && (
              <>
                <div className="mb-2 rounded-full bg-primary/10 p-3 text-primary"><Moon className="h-5 w-5" /></div>
                <Gauge />
                <h2 className="font-display text-xl italic">Your result will appear here</h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Complete all fields and click “Generate prediction” to get the score returned by your model.</p>
              </>
            )}
            {uiState === "loading" && (
              <>
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary"><Loader2 className="h-9 w-9 animate-spin" /></div>
                <h2 className="font-display text-xl italic">Reading your signal…</h2>
                <p className="mt-2 text-sm text-muted-foreground">Sending your answers to the prediction model.</p>
              </>
            )}
            {uiState === "result" && score !== null && resultBand && (
              <>
                <div className="mb-1 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><CheckCircle2 className="h-3.5 w-3.5" /> Prediction ready</div>
                <Gauge value={score} size={250} trackClassName="stroke-muted" needleHubClassName="fill-foreground" />
                <div className="-mt-3 flex items-baseline gap-1"><span className="font-mono-brand text-5xl font-bold">{score.toFixed(2)}</span><span className="font-mono-brand text-sm text-muted-foreground">/10</span></div>
                <p className="mt-2 font-display text-xl italic text-primary">{resultBand.label}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{resultBand.context}</p>
                <Button variant="outline" className="mt-6 rounded-xl" onClick={resetResult}><RefreshCw className="mr-2 h-4 w-4" /> Run another analysis</Button>
              </>
            )}
            {uiState === "error" && (
              <>
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"><TriangleAlert className="h-6 w-6" /></div>
                <h2 className="font-display text-xl">Prediction failed</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{errorMessage}</p>
                <Button variant="outline" className="mt-6 rounded-xl" onClick={() => setUiState("idle")}>Try again</Button>
              </>
            )}
          </div>
          <div className="border-t border-border bg-secondary/30 px-6 py-4 text-xs leading-5 text-muted-foreground">
            This score is an informational model output, not a medical diagnosis.
          </div>
        </Card>
      </main>

      </div>
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-muted-foreground sm:px-8">
        If you are struggling, consider talking with someone you trust or a qualified professional.
      </footer>
    </div>
  );
}

function Legend({ index, title }: { index: string; title: string }) {
  return <legend className="flex items-center gap-2.5 text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 font-mono-brand text-[10px] text-primary">{index}</span>{title}</legend>;
}
function Hint({ children }: { children: React.ReactNode }) { return <span className="text-[11px] text-muted-foreground">{children}</span>; }
function Field({ label, error, unit, children }: { label: string; error?: string; unit?: string; children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-col gap-1.5"><Label className={cn(error && "text-destructive")}>{label}</Label><div className="relative">{children}{unit && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono-brand text-[10px] text-muted-foreground">{unit}</span>}</div>{error && <p className="text-xs text-destructive">{error}</p>}</div>;
}
