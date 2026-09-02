export type StressLevel = "Low" | "Medium" | "High" | "Very High";

export interface StudentData {
  age: number;
  gender: string;
  country: string;
  academic_level: string;
  most_used_platform: string;
  purpose_of_use: string;
  avg_daily_usage_hours: number;
  daily_unlocks: number;
  study_hours: number;
  physical_activity_hours: number;
  sleep_hours_per_night: number;
  stress_level: StressLevel | "";
}

export const EMPTY_STUDENT_DATA: StudentData = {
  age: NaN,
  gender: "",
  country: "",
  academic_level: "",
  most_used_platform: "",
  purpose_of_use: "",
  avg_daily_usage_hours: NaN,
  daily_unlocks: NaN,
  study_hours: NaN,
  physical_activity_hours: NaN,
  sleep_hours_per_night: NaN,
  stress_level: "",
};

export interface PredictionResponse {
  predicted_mental_health_score: number;
}

export interface FieldError {
  field: keyof StudentData | "stress_level";
  message: string;
}
