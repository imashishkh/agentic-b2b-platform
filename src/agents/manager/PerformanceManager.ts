
import { PerformanceMetric, OptimizationRecommendation } from "@/contexts/types";
import { standardMetrics } from "@/utils/performanceMonitoring";

/**
 * PerformanceManager - Handles performance monitoring and optimization
 */
export class PerformanceManager {
  private performanceMetrics: PerformanceMetric[] = [...standardMetrics];
  private optimizationRecommendations: OptimizationRecommendation[] = [];

  /**
   * Get all performance metrics
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    return this.performanceMetrics;
  }

  /**
   * Get all optimization recommendations
   */
  getOptimizationRecommendations(): OptimizationRecommendation[] {
    return this.optimizationRecommendations;
  }

  /**
   * Generate optimization recommendations based on metrics
   */
  generateOptimizationRecommendations(): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Frontend performance recommendations
    const frontendMetrics = this.performanceMetrics.filter(m => m.category === 'frontend');
    frontendMetrics.forEach(metric => {
      const impact = metric.threshold && metric.currentValue && metric.currentValue > metric.threshold.critical ? 'high' : 'medium';
      
      recommendations.push({
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        metricId: metric.id,
        title: `Optimize ${metric.name}`,
        description: `Improve ${metric.name.toLowerCase()} performance to enhance user experience.`,
        impact: impact as 'low' | 'medium' | 'high',
        effort: 'medium'
      });
    });

    // Backend performance recommendations
    const backendMetrics = this.performanceMetrics.filter(m => m.category === 'backend');
    backendMetrics.forEach(metric => {
      const impact = metric.threshold && metric.currentValue && metric.currentValue > metric.threshold.critical ? 'high' : 'medium';
      
      recommendations.push({
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        metricId: metric.id,
        title: `Enhance ${metric.name}`,
        description: `Improve ${metric.name.toLowerCase()} to optimize server performance.`,
        impact: impact as 'low' | 'medium' | 'high',
        effort: 'high'
      });
    });

    // Database performance recommendations
    const databaseMetrics = this.performanceMetrics.filter(m => m.category === 'database');
    databaseMetrics.forEach(metric => {
      const impact = metric.threshold && metric.currentValue && metric.currentValue > metric.threshold.critical ? 'high' : 'medium';
      
      recommendations.push({
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        metricId: metric.id,
        title: `Optimize ${metric.name}`,
        description: `Improve database performance by optimizing ${metric.name.toLowerCase()}.`,
        impact: impact as 'low' | 'medium' | 'high',
        effort: 'high'
      });
    });

    return recommendations;
  }

  /**
   * Add a performance metric
   */
  addPerformanceMetric(metric: PerformanceMetric): void {
    const existingIndex = this.performanceMetrics.findIndex(m => m.id === metric.id);
    if (existingIndex >= 0) {
      this.performanceMetrics[existingIndex] = metric;
    } else {
      this.performanceMetrics.push(metric);
    }
  }

  /**
   * Add an optimization recommendation
   */
  addOptimizationRecommendation(recommendation: OptimizationRecommendation): void {
    const existingIndex = this.optimizationRecommendations.findIndex(r => r.id === recommendation.id);
    if (existingIndex >= 0) {
      this.optimizationRecommendations[existingIndex] = recommendation;
    } else {
      this.optimizationRecommendations.push(recommendation);
    }
  }
}

export default new PerformanceManager();
