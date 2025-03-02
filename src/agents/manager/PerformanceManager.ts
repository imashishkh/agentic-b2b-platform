
import { 
  PerformanceMetric, 
  OptimizationRecommendation, 
  standardMetrics,
  generatePerformanceReport,
  monitoringToolIntegrations
} from "@/utils/performanceMonitoring";

/**
 * Get performance metrics based on target
 * 
 * @param target - The target environment or application type
 * @returns Array of performance metrics
 */
export function getPerformanceMetrics(target: string = 'web'): PerformanceMetric[] {
  return [...standardMetrics];
}

/**
 * Generate optimization recommendations based on metrics
 * 
 * @param metrics - The performance metrics to analyze
 * @returns Array of optimization recommendations
 */
export function generateOptimizationRecommendations(metrics: PerformanceMetric[]): OptimizationRecommendation[] {
  const recommendations: OptimizationRecommendation[] = [];
  
  // Filter metrics that are below target
  const underperformingMetrics = metrics.filter(metric => {
    // Check if the metric has a current value and is below target
    return metric.priority === 'high' || metric.priority === 'medium';
  });
  
  // Generate recommendations for each underperforming metric
  underperformingMetrics.forEach(metric => {
    const category = metric.category;
    
    if (category === 'frontend') {
      recommendations.push({
        area: 'frontend',
        title: `Optimize ${metric.name}`,
        description: `Improve ${metric.name} by optimizing the frontend code.`,
        implementationComplexity: 'medium',
        impact: 'high',
        priority: metric.priority
      });
    } else if (category === 'backend') {
      recommendations.push({
        area: 'backend',
        title: `Optimize ${metric.name}`,
        description: `Improve ${metric.name} by optimizing the backend code.`,
        implementationComplexity: 'medium',
        impact: 'high',
        priority: metric.priority
      });
    } else if (category === 'database') {
      recommendations.push({
        area: 'database',
        title: `Optimize ${metric.name}`,
        description: `Improve ${metric.name} by optimizing the database queries or schema.`,
        implementationComplexity: 'high',
        impact: 'high',
        priority: metric.priority
      });
    }
  });
  
  return recommendations;
}

/**
 * Generate a performance monitoring plan
 * 
 * @param applicationName - The name of the application
 * @returns A formatted performance monitoring plan
 */
export function generatePerformanceMonitoringPlan(applicationName: string): string {
  const plan = ["# Performance Monitoring Plan\n\n"];
  
  plan.push(`## Overview\n\nThis performance monitoring plan outlines the strategy for monitoring, measuring, and optimizing the performance of ${applicationName}.\n\n`);
  
  // Key metrics to monitor
  plan.push("## Key Metrics\n\n");
  
  // Frontend metrics
  plan.push("### Frontend Metrics\n\n");
  plan.push("| Metric | Description | Target |\n");
  plan.push("| ------ | ----------- | ------ |\n");
  plan.push("| First Contentful Paint | Time until the browser renders the first bit of content | < 1.8s |\n");
  plan.push("| Time to Interactive | Time until the page is fully interactive | < 3.5s |\n");
  plan.push("| Total Blocking Time | Sum of all time periods between FCP and TTI | < 300ms |\n");
  plan.push("| Cumulative Layout Shift | Measure of layout stability | < 0.1 |\n\n");
  
  // Backend metrics
  plan.push("### Backend Metrics\n\n");
  plan.push("| Metric | Description | Target |\n");
  plan.push("| ------ | ----------- | ------ |\n");
  plan.push("| API Response Time | Average time for API endpoints to respond | < 300ms |\n");
  plan.push("| Error Rate | Percentage of requests that result in errors | < 1% |\n");
  plan.push("| Request Throughput | Number of requests handled per second | Baseline + 20% |\n\n");
  
  // Database metrics
  plan.push("### Database Metrics\n\n");
  plan.push("| Metric | Description | Target |\n");
  plan.push("| ------ | ----------- | ------ |\n");
  plan.push("| Query Execution Time | Average time for database queries to complete | < 100ms |\n");
  plan.push("| Connection Pool Utilization | Percentage of database connections in use | < 80% |\n");
  plan.push("| Index Hit Ratio | Percentage of queries using indexes | > 95% |\n\n");
  
  // Infrastructure metrics
  plan.push("### Infrastructure Metrics\n\n");
  plan.push("| Metric | Description | Target |\n");
  plan.push("| ------ | ----------- | ------ |\n");
  plan.push("| CPU Utilization | Percentage of CPU in use | < 70% |\n");
  plan.push("| Memory Usage | Percentage of memory in use | < 80% |\n");
  plan.push("| Disk I/O | Disk read/write operations per second | Baseline + 20% |\n\n");
  
  // Monitoring tools
  plan.push("## Monitoring Tools\n\n");
  
  Object.entries(monitoringToolIntegrations).forEach(([key, tool]) => {
    plan.push(`### ${tool.name}\n\n`);
    plan.push(`${tool.description}\n\n`);
    plan.push("**Key Features:**\n\n");
    plan.push("- Real-time monitoring\n");
    plan.push("- Custom dashboards\n");
    plan.push("- Alerting capabilities\n");
    plan.push("- Historical data analysis\n\n");
  });
  
  // Performance testing
  plan.push("## Performance Testing\n\n");
  plan.push("### Testing Types\n\n");
  plan.push("1. **Load Testing**: Test the application under expected load conditions\n");
  plan.push("2. **Stress Testing**: Test the application under extreme load conditions\n");
  plan.push("3. **Endurance Testing**: Test the application under sustained load over an extended period\n");
  plan.push("4. **Spike Testing**: Test the application's response to sudden increases in load\n\n");
  
  plan.push("### Testing Tools\n\n");
  plan.push("- JMeter\n");
  plan.push("- Lighthouse\n");
  plan.push("- WebPageTest\n");
  plan.push("- k6\n\n");
  
  // Optimization strategy
  plan.push("## Optimization Strategy\n\n");
  plan.push("1. **Measure**: Establish baseline performance metrics\n");
  plan.push("2. **Analyze**: Identify performance bottlenecks\n");
  plan.push("3. **Optimize**: Implement optimizations\n");
  plan.push("4. **Repeat**: Continuously monitor and optimize\n\n");
  
  plan.push("### Common Optimization Techniques\n\n");
  plan.push("- Code splitting and lazy loading\n");
  plan.push("- Image optimization\n");
  plan.push("- Caching strategies\n");
  plan.push("- Database query optimization\n");
  plan.push("- CDN utilization\n");
  plan.push("- Server-side rendering\n\n");
  
  // Performance budget
  plan.push("## Performance Budget\n\n");
  plan.push("| Metric | Budget |\n");
  plan.push("| ------ | ------ |\n");
  plan.push("| Total Page Size | < 1MB |\n");
  plan.push("| JavaScript Size | < 300KB |\n");
  plan.push("| CSS Size | < 100KB |\n");
  plan.push("| Image Size | < 500KB |\n");
  plan.push("| Font Size | < 100KB |\n");
  plan.push("| Third-party Scripts | < 200KB |\n\n");
  
  // Implementation roadmap
  plan.push("## Implementation Roadmap\n\n");
  plan.push("1. **Phase 1**: Set up monitoring tools and establish baseline metrics (Week 1-2)\n");
  plan.push("2. **Phase 2**: Conduct initial performance testing and identify optimization opportunities (Week 3-4)\n");
  plan.push("3. **Phase 3**: Implement high-priority optimizations (Week 5-6)\n");
  plan.push("4. **Phase 4**: Continuous monitoring and optimization (Ongoing)\n\n");
  
  // Conclusion
  plan.push("## Conclusion\n\n");
  plan.push(`By implementing this performance monitoring plan, ${applicationName} will maintain optimal performance and provide an excellent user experience. Regular monitoring, testing, and optimization will ensure the application scales effectively as user traffic grows.\n`);
  
  return plan.join("");
}
