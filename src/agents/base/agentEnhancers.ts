
/**
 * Functions to enhance agent responses with additional information
 */

/**
 * Enhances the Claude response with information from external search
 */
export function enhanceResponseWithSearch(claudeResponse: string, searchResults: string): string {
  return `
${claudeResponse}

## Additional Resources

Based on best practices and current industry standards:

${searchResults}

Would you like me to elaborate on any specific aspect of these recommendations?
  `;
}

/**
 * Enhances the Claude response with code examples
 */
export function enhanceResponseWithCodeExamples(claudeResponse: string, codeExamples: string): string {
  return `
${claudeResponse}

## Implementation Examples

Here are some code examples that might help:

${codeExamples}

Would you like me to explain any specific part in more detail?
  `;
}

/**
 * Enhances the Claude response with package information
 */
export function enhanceResponseWithPackageInfo(claudeResponse: string, packageInfo: string): string {
  return `
${claudeResponse}

## Package Information

${packageInfo}

Let me know if you'd like to explore other packages or need help with implementation.
  `;
}

/**
 * Enhances the Claude response with test results
 */
export function enhanceResponseWithTestResults(claudeResponse: string, testResults: string): string {
  return `
${claudeResponse}

## Code Testing Results

${testResults}

Would you like me to help implement any of these suggestions?
  `;
}

/**
 * Enhances the Claude response with troubleshooting information
 */
export function enhanceResponseWithTroubleshooting(claudeResponse: string, troubleshootingInfo: string): string {
  return `
${claudeResponse}

## Troubleshooting Guide

${troubleshootingInfo}

Let me know if you'd like more specific help resolving this issue.
  `;
}

/**
 * Enhances the Claude response with security check results
 */
export function enhanceResponseWithSecurityCheck(claudeResponse: string, securityResults: string): string {
  return `
${claudeResponse}

## Security Analysis

${securityResults}

Security is particularly important for e-commerce platforms. Let me know if you'd like help implementing any of these recommendations.
  `;
}
