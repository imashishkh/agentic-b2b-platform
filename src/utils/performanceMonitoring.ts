import { toast } from "sonner";

/**
 * Types for performance monitoring
 */
export interface PerformanceMetric {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'network' | 'database' | 'memory';
  description: string;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  currentValue?: number;
  benchmarkValue?: number;
  trending?: 'improving' | 'stable' | 'degrading';
  lastUpdated?: string;
}

export interface PerformanceBenchmark {
  id: string;
  metricId: string;
  value: number;
  date: string;
  environment: 'development' | 'staging' | 'production';
  description?: string;
}

export interface OptimizationRecommendation {
  id: string;
  metricId: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  codeSnippet?: string;
  resources?: string[];
}

/**
 * Standard performance metrics definitions
 */
export const standardMetrics: PerformanceMetric[] = [
  {
    id: 'metric-1',
    name: 'First Contentful Paint',
    category: 'frontend',
    description: 'Time until the browser renders the first bit of content from the DOM',
    unit: 'ms',
    threshold: {
      warning: 1800, // 1.8s
      critical: 3000  // 3s
    }
  },
  {
    id: 'metric-2',
    name: 'Time to Interactive',
    category: 'frontend',
    description: 'Time until the page is fully interactive',
    unit: 'ms',
    threshold: {
      warning: 3500, // 3.5s
      critical: 7500  // 7.5s
    }
  },
  {
    id: 'metric-3',
    name: 'API Response Time',
    category: 'backend',
    description: 'Average time for API endpoints to respond',
    unit: 'ms',
    threshold: {
      warning: 300, // 300ms
      critical: 1000 // 1s
    }
  },
  {
    id: 'metric-4',
    name: 'Database Query Time',
    category: 'database',
    description: 'Average time for database queries to complete',
    unit: 'ms',
    threshold: {
      warning: 100, // 100ms
      critical: 500  // 500ms
    }
  },
  {
    id: 'metric-5',
    name: 'Memory Usage',
    category: 'memory',
    description: 'Application memory consumption',
    unit: 'MB',
    threshold: {
      warning: 100, // 100MB
      critical: 250  // 250MB
    }
  },
  {
    id: 'metric-6',
    name: 'Network Request Size',
    category: 'network',
    description: 'Average size of network requests',
    unit: 'KB',
    threshold: {
      warning: 500, // 500KB
      critical: 1000 // 1MB
    }
  }
];

/**
 * Collects frontend performance metrics using the Web Performance API
 */
export const collectFrontendMetrics = (): Partial<Record<string, number>> => {
  // Use browser Performance API if available
  if (typeof window === 'undefined' || !window.performance) {
    console.warn('Performance API not available');
    return {};
  }

  try {
    const metrics: Partial<Record<string, number>> = {};
    
    // Get navigation timing metrics
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries && navigationEntries.length > 0) {
        const navigationTiming = navigationEntries[0] as PerformanceNavigationTiming;
        
        metrics.domComplete = navigationTiming.domComplete;
        metrics.domInteractive = navigationTiming.domInteractive;
        metrics.loadEventEnd = navigationTiming.loadEventEnd;
        metrics.responseEnd = navigationTiming.responseEnd;
        metrics.responseStart = navigationTiming.responseStart;
      }
    }
    
    // Get paint timing metrics
    if (performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        const paintTiming = entry as PerformancePaintTiming;
        if (paintTiming.name === 'first-paint') {
          metrics.firstPaint = paintTiming.startTime;
        }
        if (paintTiming.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = paintTiming.startTime;
        }
      });
    }
    
    // Add memory info if available
    const memoryInfo = (performance as any).memory;
    if (memoryInfo) {
      metrics.jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit;
      metrics.totalJSHeapSize = memoryInfo.totalJSHeapSize;
      metrics.usedJSHeapSize = memoryInfo.usedJSHeapSize;
    }
    
    return metrics;
  } catch (error) {
    console.error('Error collecting performance metrics:', error);
    return {};
  }
};

/**
 * Maps collected frontend metrics to the standard metrics format
 */
export const mapFrontendMetricsToStandard = (
  collectedMetrics: Partial<Record<string, number>>
): PerformanceMetric[] => {
  const standardMetricsCopy = [...standardMetrics];
  
  // Update First Contentful Paint if available
  if (collectedMetrics.firstContentfulPaint) {
    const fcpMetric = standardMetricsCopy.find(m => m.name === 'First Contentful Paint');
    if (fcpMetric) {
      fcpMetric.currentValue = collectedMetrics.firstContentfulPaint;
      fcpMetric.lastUpdated = new Date().toISOString();
    }
  }
  
  // Update Time to Interactive if available
  if (collectedMetrics.domInteractive) {
    const ttiMetric = standardMetricsCopy.find(m => m.name === 'Time to Interactive');
    if (ttiMetric) {
      ttiMetric.currentValue = collectedMetrics.domInteractive;
      ttiMetric.lastUpdated = new Date().toISOString();
    }
  }
  
  // Update Memory Usage if available
  if (collectedMetrics.usedJSHeapSize) {
    const memoryMetric = standardMetricsCopy.find(m => m.name === 'Memory Usage');
    if (memoryMetric) {
      memoryMetric.currentValue = Math.round(collectedMetrics.usedJSHeapSize / (1024 * 1024)); // Convert to MB
      memoryMetric.lastUpdated = new Date().toISOString();
    }
  }
  
  return standardMetricsCopy;
};

/**
 * Save performance benchmarks
 */
export const saveBenchmark = (
  metric: PerformanceMetric, 
  environment: 'development' | 'staging' | 'production' = 'development',
  description?: string
): PerformanceBenchmark => {
  if (!metric.currentValue) {
    throw new Error('Cannot save benchmark for metric without a current value');
  }
  
  const benchmark: PerformanceBenchmark = {
    id: `benchmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    metricId: metric.id,
    value: metric.currentValue,
    date: new Date().toISOString(),
    environment,
    description
  };
  
  console.log('Saved benchmark:', benchmark);
  toast.success(`Benchmark saved for ${metric.name}`);
  
  return benchmark;
};

/**
 * Compares current metrics against benchmarks and generates recommendations
 */
export const generateOptimizationRecommendations = (
  metrics: PerformanceMetric[]
): OptimizationRecommendation[] => {
  const recommendations: OptimizationRecommendation[] = [];
  
  // Check each metric
  metrics.forEach(metric => {
    if (!metric.currentValue) return;
    
    // Recommendation based on threshold breach
    if (metric.currentValue > metric.threshold.critical) {
      const recommendation = createRecommendationForMetric(metric, 'high');
      if (recommendation) recommendations.push(recommendation);
    } else if (metric.currentValue > metric.threshold.warning) {
      const recommendation = createRecommendationForMetric(metric, 'medium');
      if (recommendation) recommendations.push(recommendation);
    }
    
    // Recommendation based on benchmark comparison
    if (metric.benchmarkValue && metric.currentValue > metric.benchmarkValue * 1.2) { // 20% worse than benchmark
      recommendations.push({
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: `${metric.name} Regression`,
        description: `${metric.name} has regressed by ${Math.round((metric.currentValue / metric.benchmarkValue - 1) * 100)}% compared to the benchmark. Review recent changes that may have impacted this metric.`,
        impact: 'medium',
        effort: 'medium'
      });
    }
  });
  
  return recommendations;
};

/**
 * Create optimization recommendation for a specific metric
 */
const createRecommendationForMetric = (
  metric: PerformanceMetric, 
  impact: 'low' | 'medium' | 'high'
): OptimizationRecommendation | null => {
  switch (metric.name) {
    case 'First Contentful Paint':
      return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: 'Improve Page Load Performance',
        description: 'The First Contentful Paint time is too high. Consider optimizing images, reducing JavaScript bundle size, and implementing code splitting.',
        impact,
        effort: 'medium',
        codeSnippet: `// Example code splitting with React.lazy
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </React.Suspense>
  );
}`,
        resources: [
          'https://web.dev/articles/fcp',
          'https://web.dev/articles/code-splitting-suspense'
        ]
      };
      
    case 'Time to Interactive':
      return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: 'Improve Interactivity',
        description: 'The page takes too long to become interactive. Consider reducing JavaScript execution time, optimizing third-party scripts, and implementing progressive hydration.',
        impact,
        effort: 'high',
        resources: [
          'https://web.dev/articles/tti',
          'https://web.dev/articles/optimize-fid'
        ]
      };
      
    case 'API Response Time':
      return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: 'Optimize API Response Time',
        description: 'API responses are too slow. Consider implementing caching, optimizing database queries, or using serverless functions for critical endpoints.',
        impact,
        effort: 'medium',
        resources: [
          'https://web.dev/articles/performance-http-cache',
          'https://docs.tanstack.com/query/latest/framework/react/guides/query-invalidation'
        ]
      };
      
    case 'Database Query Time':
      return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: 'Optimize Database Performance',
        description: 'Database queries are taking too long. Consider adding indexes, optimizing queries, or implementing a caching layer.',
        impact,
        effort: 'high',
        resources: [
          'https://use-the-index-luke.com/',
          'https://redis.io/docs/data-types/json/'
        ]
      };
      
    case 'Memory Usage':
      return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: 'Reduce Memory Usage',
        description: 'The application is using too much memory. Check for memory leaks, large object allocations, or inefficient data structures.',
        impact,
        effort: 'medium',
        codeSnippet: `// Identify memory leaks with Chrome DevTools
// Open DevTools > Memory > Take heap snapshot
// Look for objects with large retention trees

// Example memory leak fix - clean up event listeners
useEffect(() => {
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);`,
        resources: [
          'https://developer.chrome.com/docs/devtools/memory-problems/'
        ]
      };
      
    case 'Network Request Size':
      return {
        id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        metricId: metric.id,
        title: 'Optimize Network Requests',
        description: 'Network requests are too large. Consider compressing responses, implementing pagination, or using GraphQL to request only needed data.',
        impact,
        effort: 'medium',
        resources: [
          'https://web.dev/articles/reduce-network-payloads-using-text-compression',
          'https://web.dev/articles/optimizing-content-efficiency-optimize-encoding-and-transfer'
        ]
      };
      
    default:
      return null;
  }
};

/**
 * Generate comprehensive performance report
 */
export const generatePerformanceReport = (
  metrics: PerformanceMetric[],
  recommendations: OptimizationRecommendation[]
): string => {
  const report: string[] = [];
  
  // Report header
  report.push("# Performance Monitoring Report\n");
  report.push(`Generated on: ${new Date().toLocaleString()}\n\n`);
  
  // Summary section
  report.push("## Summary\n\n");
  
  const criticalMetrics = metrics.filter(m => m.currentValue && m.currentValue > m.threshold.critical);
  const warningMetrics = metrics.filter(m => 
    m.currentValue && 
    m.currentValue > m.threshold.warning && 
    m.currentValue <= m.threshold.critical
  );
  const healthyMetrics = metrics.filter(m => 
    m.currentValue && 
    m.currentValue <= m.threshold.warning
  );
  
  report.push(`- **Critical Issues:** ${criticalMetrics.length}\n`);
  report.push(`- **Warning Issues:** ${warningMetrics.length}\n`);
  report.push(`- **Healthy Metrics:** ${healthyMetrics.length}\n`);
  report.push(`- **Total Recommendations:** ${recommendations.length}\n\n`);
  
  // Performance Metrics section
  report.push("## Performance Metrics\n\n");
  
  // Group metrics by category
  const metricsByCategory: Record<string, PerformanceMetric[]> = {};
  metrics.forEach(metric => {
    if (!metricsByCategory[metric.category]) {
      metricsByCategory[metric.category] = [];
    }
    metricsByCategory[metric.category].push(metric);
  });
  
  // Display metrics by category
  Object.entries(metricsByCategory).forEach(([category, categoryMetrics]) => {
    report.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)} Metrics\n\n`);
    
    categoryMetrics.forEach(metric => {
      const status = !metric.currentValue ? "Unknown" : 
                     metric.currentValue > metric.threshold.critical ? "Critical" :
                     metric.currentValue > metric.threshold.warning ? "Warning" : "Healthy";
      
      const statusEmoji = !metric.currentValue ? "❓" : 
                          metric.currentValue > metric.threshold.critical ? "🔴" :
                          metric.currentValue > metric.threshold.warning ? "🟠" : "🟢";
      
      report.push(`#### ${statusEmoji} ${metric.name}\n\n`);
      report.push(`- **Description:** ${metric.description}\n`);
      report.push(`- **Current Value:** ${metric.currentValue ? `${metric.currentValue} ${metric.unit}` : "Not measured"}\n`);
      report.push(`- **Threshold:** Warning: ${metric.threshold.warning} ${metric.unit}, Critical: ${metric.threshold.critical} ${metric.unit}\n`);
      
      if (metric.benchmarkValue) {
        const benchmarkComparison = metric.currentValue ? 
          (metric.currentValue - metric.benchmarkValue) / metric.benchmarkValue * 100 : 0;
        
        const comparisonText = benchmarkComparison > 0 ? 
          `${benchmarkComparison.toFixed(2)}% worse than benchmark` : 
          `${Math.abs(benchmarkComparison).toFixed(2)}% better than benchmark`;
        
        report.push(`- **Benchmark:** ${metric.benchmarkValue} ${metric.unit} (${comparisonText})\n`);
      }
      
      if (metric.trending) {
        const trendEmoji = metric.trending === 'improving' ? "📈" : 
                           metric.trending === 'degrading' ? "📉" : "➡️";
        report.push(`- **Trend:** ${trendEmoji} ${metric.trending}\n`);
      }
      
      if (metric.lastUpdated) {
        report.push(`- **Last Updated:** ${new Date(metric.lastUpdated).toLocaleString()}\n`);
      }
      
      report.push("\n");
    });
  });
  
  // Recommendations section
  if (recommendations.length > 0) {
    report.push("## Optimization Recommendations\n\n");
    
    // Group recommendations by impact
    const highImpact = recommendations.filter(r => r.impact === 'high');
    const mediumImpact = recommendations.filter(r => r.impact === 'medium');
    const lowImpact = recommendations.filter(r => r.impact === 'low');
    
    // Display high impact recommendations
    if (highImpact.length > 0) {
      report.push("### High Impact Recommendations\n\n");
      highImpact.forEach(rec => {
        report.push(`#### ${rec.title}\n\n`);
        report.push(`${rec.description}\n\n`);
        report.push(`- **Impact:** High\n`);
        report.push(`- **Effort:** ${rec.effort.charAt(0).toUpperCase() + rec.effort.slice(1)}\n`);
        
        if (rec.codeSnippet) {
          report.push("\n```typescript\n");
          report.push(rec.codeSnippet);
          report.push("\n```\n\n");
        }
        
        if (rec.resources && rec.resources.length > 0) {
          report.push("**Resources:**\n");
          rec.resources.forEach(resource => {
            report.push(`- [${resource.split('/').pop()?.replace(/-/g, ' ') || resource}](${resource})\n`);
          });
          report.push("\n");
        }
      });
    }
    
    // Display medium impact recommendations
    if (mediumImpact.length > 0) {
      report.push("### Medium Impact Recommendations\n\n");
      mediumImpact.forEach(rec => {
        report.push(`#### ${rec.title}\n\n`);
        report.push(`${rec.description}\n\n`);
        report.push(`- **Impact:** Medium\n`);
        report.push(`- **Effort:** ${rec.effort.charAt(0).toUpperCase() + rec.effort.slice(1)}\n\n`);
      });
    }
    
    // Display low impact recommendations
    if (lowImpact.length > 0) {
      report.push("### Low Impact Recommendations\n\n");
      lowImpact.forEach(rec => {
        report.push(`- **${rec.title}:** ${rec.description}\n`);
      });
    }
  }
  
  // Next steps
  report.push("## Next Steps\n\n");
  report.push("1. Address high impact recommendations first\n");
  report.push("2. Establish regular performance monitoring\n");
  report.push("3. Set up alerting for critical performance thresholds\n");
  report.push("4. Create performance budgets for key metrics\n");
  report.push("5. Integrate performance testing into CI/CD pipeline\n");
  
  return report.join("");
};

/**
 * Integration with common monitoring tools
 */
export const monitoringToolIntegrations = {
  // Google Lighthouse integration
  lighthouse: {
    name: "Google Lighthouse",
    description: "Automated tool for improving web page quality",
    setupInstructions: `
# Setting up Lighthouse Integration

## Manual Audit
1. Open Chrome DevTools
2. Go to the Lighthouse tab
3. Select categories to audit
4. Click "Generate report"

## Programmatic Usage
Install the Lighthouse CLI:
\`\`\`
npm install -g lighthouse
lighthouse https://your-site.com --output=json --output-path=./lighthouse-report.json
\`\`\`

## CI Integration
Use Lighthouse CI for continuous monitoring:
\`\`\`
npm install -g @lhci/cli
lhci autorun
\`\`\`
    `,
    metricsMapping: {
      'first-contentful-paint': 'First Contentful Paint',
      'speed-index': 'Speed Index',
      'largest-contentful-paint': 'Largest Contentful Paint',
      'interactive': 'Time to Interactive',
      'total-blocking-time': 'Total Blocking Time',
      'cumulative-layout-shift': 'Cumulative Layout Shift'
    }
  },
  
  // New Relic integration
  newRelic: {
    name: "New Relic",
    description: "Full-stack observability platform",
    setupInstructions: `
# Setting up New Relic Integration

1. Sign up for a New Relic account
2. Install the New Relic Browser agent:

\`\`\`html
<!-- Add this to your index.html -->
<script type="text/javascript">
window.NREUM||(NREUM={}),__nr_require=function(t,e,n){/* New Relic agent code */};
// Rest of the New Relic initialization code
</script>
\`\`\`

3. For backend monitoring, install the appropriate New Relic agent for your server
4. Configure custom metrics as needed
    `,
    metricsMapping: {
      'PageViewTiming': 'Page Load Time',
      'Ajax': 'API Response Time',
      'JS_Errors': 'JavaScript Errors',
      'PageAction': 'User Interactions'
    }
  },
  
  // Datadog integration
  datadog: {
    name: "Datadog",
    description: "Monitoring and security platform for cloud applications",
    setupInstructions: `
# Setting up Datadog Integration

1. Sign up for a Datadog account
2. Install the Datadog agent on your server
3. For Real User Monitoring (RUM), add the Datadog RUM SDK:

\`\`\`javascript
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: '<APP_ID>',
  clientToken: '<CLIENT_TOKEN>',
  site: 'datadoghq.com',
  service: 'your-app-name',
  env: 'production',
  version: '1.0.0',
  sampleRate: 100,
  trackInteractions: true
});
\`\`\`

4. Configure custom metrics and alerts as needed
    `,
    metricsMapping: {
      'rum.performance.domComplete': 'DOM Complete',
      'rum.performance.firstContentfulPaint': 'First Contentful Paint',
      'rum.performance.firstInputDelay': 'First Input Delay',
      'rum.performance.loadEvent': 'Load Event'
    }
  }
};

/**
 * Function to generate a monitoring tool setup document
 */
export const generateMonitoringToolSetupDoc = (toolKey: keyof typeof monitoringToolIntegrations): string => {
  const tool = monitoringToolIntegrations[toolKey];
  if (!tool) {
    return "# Error\n\nMonitoring tool not found.";
  }
  
  return `# ${tool.name} Integration Guide\n\n${tool.description}\n\n${tool.setupInstructions}`;
};
