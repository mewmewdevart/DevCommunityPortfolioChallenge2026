import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Reports Web Vitals metrics to a callback function.
 * 
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift): < 0.1 good, < 0.25 needs improvement, > 0.25 poor
 * - INP (Interaction to Next Paint): < 200ms good, < 500ms needs improvement, > 500ms poor
 * - FCP (First Contentful Paint): < 1.8s good, < 3s needs improvement, > 3s poor
 * - LCP (Largest Contentful Paint): < 2.5s good, < 4s needs improvement, > 4s poor
 * - TTFB (Time to First Byte): < 800ms good, < 1800ms needs improvement, > 1800ms poor
 * 
 * @param onPerfEntry - Callback function to receive metric data
 * 
 * @example
 * ```typescript
 * reportWebVitals((metric) => {
 *   console.log(metric.name, metric.value);
 *   // Send to analytics
 *   analytics.send({
 *     name: metric.name,
 *     value: metric.value,
 *     rating: metric.rating,
 *   });
 * });
 * ```
 */
export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        onCLS(onPerfEntry);
        onINP(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
    }
};

/**
 * Format Web Vitals metric for console logging with color coding based on rating.
 * 
 * @param metric - Web Vitals metric object
 */
export const formatMetricForConsole = (metric: Metric): void => {
    const { name, value, rating } = metric;

    const colorMap = {
        good: 'color: #0cce6b; font-weight: bold',
        'needs-improvement': 'color: #ffa400; font-weight: bold',
        poor: 'color: #ff4e42; font-weight: bold',
    };

    const color = colorMap[rating] || 'color: #000';

    let formattedValue: string;
    if (name === 'CLS') {
        formattedValue = value.toFixed(3);
    } else {
        formattedValue = `${Math.round(value)}ms`;
    }

    console.log(
        `%c[Web Vitals] ${name}: ${formattedValue} (${rating})`,
        color
    );
};
