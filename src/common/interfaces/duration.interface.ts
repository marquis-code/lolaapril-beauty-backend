export interface Duration {
  value: number
  unit: "min" | "h" | "day"
}

export interface TimeDuration {
  hours: number
  minutes: number
}
