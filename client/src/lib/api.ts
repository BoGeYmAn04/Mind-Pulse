import type { FieldError, PredictionResponse, StudentData } from "./types";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export class ApiError extends Error {
  status?: number;
  fieldErrors?: FieldError[];
  constructor(message: string, status?: number, fieldErrors?: FieldError[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function parseValidationDetail(detail: unknown): FieldError[] {
  if (!Array.isArray(detail)) return [];

  const apiToForm: Record<string, keyof StudentData> = {
    Age: "age",
    Gender: "gender",
    Country: "country",
    Academic_Level: "academic_level",
    Most_Used_Platform: "most_used_platform",
    Purpose_Of_Use: "purpose_of_use",
    Avg_Daily_Usage_Hours: "avg_daily_usage_hours",
    Daily_Unlocks: "daily_unlocks",
    Study_Hours: "study_hours",
    Physical_Activity_Hours: "physical_activity_hours",
    Sleep_Hours_Per_Night: "sleep_hours_per_night",
    Stress_Level: "stress_level",
  };

  return detail
    .map((err) => {
      const loc = Array.isArray((err as any)?.loc) ? (err as any).loc : [];
      const apiField = String(loc[loc.length - 1] ?? "");
      const field = apiToForm[apiField];
      if (!field) return null;
      return {
        field,
        message: (err as any)?.msg ?? "Invalid value.",
      } as FieldError;
    })
    .filter((e): e is FieldError => Boolean(e));
}

function buildApiPayload(data: StudentData) {
  return {
    Age: data.age,
    Gender: data.gender,
    Country: data.country,
    Academic_Level: data.academic_level,
    Most_Used_Platform: data.most_used_platform,
    Purpose_Of_Use: data.purpose_of_use,
    Avg_Daily_Usage_Hours: data.avg_daily_usage_hours,
    Daily_Unlocks: data.daily_unlocks,
    Study_Hours: data.study_hours,
    Physical_Activity_Hours: data.physical_activity_hours,
    Sleep_Hours_Per_Night: data.sleep_hours_per_night,
    Stress_Level: data.stress_level,
  };
}

function extractScore(data: any): number | null {
  const candidates = [
    data?.predicted_mental_health_score,
    data?.prediction,
    data?.predicted_score,
    data?.score,
    data?.result?.predicted_mental_health_score,
    data?.result?.prediction,
    data?.result?.score,
  ];
  for (const value of candidates) {
    const n = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
    if (Number.isFinite(n)) return n;
  }
  return null;
}

export async function predictScore(payload: StudentData): Promise<PredictionResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildApiPayload(payload)),
    });
  } catch {
    throw new ApiError(
      `Cannot reach the prediction server at ${API_BASE}. Start FastAPI with “uvicorn main:app --port 8000 --reload” and check CORS if the server is running.`
    );
  }

  const body = await res.json().catch(() => null);

  if (res.status === 422) {
    const fieldErrors = parseValidationDetail(body?.detail);
    throw new ApiError(
      fieldErrors.length ? "The API rejected some fields. Check the highlighted inputs." : "The API rejected this submission.",
      422,
      fieldErrors
    );
  }

  if (!res.ok) {
    const detail = typeof body?.detail === "string" ? body.detail : `Prediction API returned HTTP ${res.status}.`;
    throw new ApiError(detail, res.status);
  }

  const score = extractScore(body);
  if (score === null) {
    throw new ApiError(
      "The API responded successfully, but no prediction score was found. Expected a score field such as “predicted_mental_health_score”, “prediction”, or “score”."
    );
  }

  return { predicted_mental_health_score: score };
}
