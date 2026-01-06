export declare class MetricsService {
    private metrics;
    private timings;
    increment(metric: string, value?: number): void;
    decrement(metric: string, value?: number): void;
    gauge(metric: string, value: number): void;
    timing(metric: string, duration: number): void;
    getMetric(metric: string): number;
    getTimings(metric: string): number[];
    getAverageTiming(metric: string): number;
    getAllMetrics(): {
        counters: {
            [k: string]: number;
        };
        timings: {
            [k: string]: {
                count: number;
                average: number;
                min: number;
                max: number;
            };
        };
    };
    reset(): void;
}
