"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
let MetricsService = class MetricsService {
    constructor() {
        this.metrics = new Map();
        this.timings = new Map();
    }
    increment(metric, value = 1) {
        const current = this.metrics.get(metric) || 0;
        this.metrics.set(metric, current + value);
    }
    decrement(metric, value = 1) {
        const current = this.metrics.get(metric) || 0;
        this.metrics.set(metric, current - value);
    }
    gauge(metric, value) {
        this.metrics.set(metric, value);
    }
    timing(metric, duration) {
        if (!this.timings.has(metric)) {
            this.timings.set(metric, []);
        }
        this.timings.get(metric).push(duration);
    }
    getMetric(metric) {
        return this.metrics.get(metric) || 0;
    }
    getTimings(metric) {
        return this.timings.get(metric) || [];
    }
    getAverageTiming(metric) {
        const timings = this.getTimings(metric);
        if (timings.length === 0)
            return 0;
        return timings.reduce((a, b) => a + b, 0) / timings.length;
    }
    getAllMetrics() {
        return {
            counters: Object.fromEntries(this.metrics),
            timings: Object.fromEntries(Array.from(this.timings.entries()).map(([key, values]) => [
                key,
                {
                    count: values.length,
                    average: values.reduce((a, b) => a + b, 0) / values.length,
                    min: Math.min(...values),
                    max: Math.max(...values),
                },
            ])),
        };
    }
    reset() {
        this.metrics.clear();
        this.timings.clear();
    }
};
MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
exports.MetricsService = MetricsService;
//# sourceMappingURL=metrics.service.js.map