// monitoring/metrics.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private metrics: Map<string, number> = new Map();
  private timings: Map<string, number[]> = new Map();

  increment(metric: string, value = 1) {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current + value);
  }

  decrement(metric: string, value = 1) {
    const current = this.metrics.get(metric) || 0;
    this.metrics.set(metric, current - value);
  }

  gauge(metric: string, value: number) {
    this.metrics.set(metric, value);
  }

  timing(metric: string, duration: number) {
    if (!this.timings.has(metric)) {
      this.timings.set(metric, []);
    }
    this.timings.get(metric).push(duration);
  }

  getMetric(metric: string): number {
    return this.metrics.get(metric) || 0;
  }

  getTimings(metric: string): number[] {
    return this.timings.get(metric) || [];
  }

  getAverageTiming(metric: string): number {
    const timings = this.getTimings(metric);
    if (timings.length === 0) return 0;
    return timings.reduce((a, b) => a + b, 0) / timings.length;
  }

  getAllMetrics() {
    return {
      counters: Object.fromEntries(this.metrics),
      timings: Object.fromEntries(
        Array.from(this.timings.entries()).map(([key, values]) => [
          key,
          {
            count: values.length,
            average: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
          },
        ]),
      ),
    };
  }

  reset() {
    this.metrics.clear();
    this.timings.clear();
  }
}
