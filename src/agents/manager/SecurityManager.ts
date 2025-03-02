
import { SecurityFinding, ComplianceRequirement } from "@/contexts/types";

/**
 * Performs code security scanning
 * 
 * @param code - The code to scan
 * @returns Security findings
 */
export async function performSecurityScan(code: string): Promise<SecurityFinding[]> {
  const findings: SecurityFinding[] = [];
  
  // Check for common security issues in code
  
  // SQL Injection vulnerabilities
  if (code.match(/SELECT .* FROM .* WHERE .* = .*\$/i) && !code.match(/parameterized|prepared statement/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "vulnerability",
      severity: "high",
      description: "Potential SQL Injection vulnerability detected.",
      recommendation: "Use parameterized queries or prepared statements instead of string concatenation.",
      codeLocation: "SQL query using string concatenation"
    });
  }
  
  // XSS vulnerabilities
  if (code.match(/innerHTML|dangerouslySetInnerHTML/i) && !code.match(/sanitize|DOMPurify/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "vulnerability",
      severity: "medium",
      description: "Potential Cross-Site Scripting (XSS) vulnerability detected.",
      recommendation: "Sanitize user input before inserting into the DOM. Consider using libraries like DOMPurify.",
      codeLocation: "DOM manipulation using innerHTML or dangerouslySetInnerHTML"
    });
  }
  
  // Hardcoded credentials
  if (code.match(/password|apiKey|secret|token|key|credential/i) && code.match(/("|')([a-zA-Z0-9_\-$%^&*!@#]{8,})("|')/)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "vulnerability",
      severity: "critical",
      description: "Potential hardcoded credentials detected.",
      recommendation: "Use environment variables or a secure secrets management solution instead of hardcoding sensitive values.",
      codeLocation: "Hardcoded credential in code"
    });
  }
  
  // Insecure direct object references
  if (code.match(/params.id|req.params|request.params|userId|user_id/i) && !code.match(/authorize|authentication|permission|access control/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "vulnerability",
      severity: "medium",
      description: "Potential Insecure Direct Object Reference (IDOR) vulnerability detected.",
      recommendation: "Implement proper authorization checks before accessing resources based on user input IDs.",
      codeLocation: "Resource access using parameters without authorization checks"
    });
  }
  
  // Weak cryptography
  if (code.match(/md5|sha1|createCipher/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "vulnerability",
      severity: "high",
      description: "Use of weak cryptographic algorithms detected.",
      recommendation: "Use modern cryptographic algorithms (SHA256, SHA3) and libraries like bcrypt for password hashing.",
      codeLocation: "Weak cryptographic algorithm usage"
    });
  }
  
  // Best practices violations
  
  // Error disclosure
  if (code.match(/console\.error\(err\)|console\.log\(error\)|res\.status\(500\)\.send\(error\)/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "best_practice",
      severity: "medium",
      description: "Potentially sensitive error details may be exposed to users.",
      recommendation: "Implement proper error handling and logging that doesn't expose sensitive information to end users.",
      codeLocation: "Error message disclosure"
    });
  }
  
  // Missing input validation
  if (code.match(/req\.body|request\.body|event\.body|params/i) && !code.match(/validate|sanitize|schema|zod|yup|joi/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "best_practice",
      severity: "medium",
      description: "Missing input validation for user-supplied data.",
      recommendation: "Implement input validation using libraries like Zod, Yup, or Joi.",
      codeLocation: "User input without validation"
    });
  }
  
  // Missing CSRF protection
  if (code.match(/form|post|put|delete/i) && !code.match(/csrf|csrfToken|X-CSRF-Token/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "best_practice",
      severity: "medium",
      description: "Potential missing CSRF protection for state-changing operations.",
      recommendation: "Implement CSRF tokens for all state-changing operations.",
      codeLocation: "Form or state-changing request without CSRF protection"
    });
  }
  
  // Missing Content Security Policy
  if (code.match(/<script>|script src|fetch|axios|XMLHttpRequest/i) && !code.match(/Content-Security-Policy|CSP/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "best_practice",
      severity: "low",
      description: "No Content Security Policy detected.",
      recommendation: "Implement a Content Security Policy to protect against XSS and data injection attacks.",
      codeLocation: "Client-side code without CSP"
    });
  }
  
  // Compliance issues
  
  // Missing accessibility attributes
  if (code.match(/<img/i) && !code.match(/alt=/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "compliance",
      severity: "low",
      description: "Image elements without alt attributes may not be WCAG compliant.",
      recommendation: "Add descriptive alt attributes to all image elements for accessibility.",
      codeLocation: "Image without alt attribute"
    });
  }
  
  // Missing GDPR compliance for data collection
  if (code.match(/cookie|localStorage|sessionStorage|indexedDB/i) && !code.match(/consent|gdpr|privacy/i)) {
    findings.push({
      id: `sec-${Date.now()}-${findings.length}`,
      type: "compliance",
      severity: "medium",
      description: "Data storage without explicit user consent may violate GDPR.",
      recommendation: "Implement proper consent mechanisms before storing user data.",
      codeLocation: "Data storage without consent mechanism"
    });
  }
  
  return findings;
}

/**
 * Perform a compliance check against standard requirements
 * 
 * @param code - The code to check
 * @param standard - The compliance standard to check against
 * @returns Compliance check results
 */
export async function performComplianceCheck(code: string, standard: string = "owasp"): Promise<ComplianceRequirement[]> {
  const requirements: ComplianceRequirement[] = [];
  
  if (standard.toLowerCase() === "owasp") {
    // OWASP Top 10 compliance checks
    
    // A1:2017-Injection
    requirements.push({
      id: `comp-${Date.now()}-1`,
      name: "Injection Prevention",
      description: "Prevent injection flaws (SQL, NoSQL, LDAP, etc.)",
      status: code.match(/parameterized|prepared statement|sanitize/i) ? "passed" : 
             (code.match(/SELECT|INSERT|UPDATE|DELETE|exec|eval/i) ? "failed" : "passed"),
      recommendation: "Use parameterized queries, ORM libraries, or input sanitization."
    });
    
    // A2:2017-Broken Authentication
    requirements.push({
      id: `comp-${Date.now()}-2`,
      name: "Authentication Security",
      description: "Implement secure authentication practices",
      status: code.match(/password.{0,10}hash|bcrypt|argon2|pbkdf2/i) ? "passed" : 
             (code.match(/password|login|auth/i) ? "warning" : "passed"),
      recommendation: "Use secure password hashing (bcrypt), implement MFA, and session management."
    });
    
    // A3:2017-Sensitive Data Exposure
    requirements.push({
      id: `comp-${Date.now()}-3`,
      name: "Data Protection",
      description: "Protect sensitive data in transit and at rest",
      status: code.match(/https|TLS|encrypt|hash/i) ? "passed" : 
             (code.match(/password|credit|card|ssn|personal/i) ? "warning" : "passed"),
      recommendation: "Use encryption for sensitive data, HTTPS for all communications."
    });
    
    // A5:2017-Broken Access Control
    requirements.push({
      id: `comp-${Date.now()}-5`,
      name: "Access Control",
      description: "Implement proper access controls",
      status: code.match(/authorize|authentication|permission|rbac|acl/i) ? "passed" : 
             (code.match(/admin|role|permission|restricted/i) ? "warning" : "passed"),
      recommendation: "Implement role-based access control and verify user permissions."
    });
    
    // A6:2017-Security Misconfiguration
    requirements.push({
      id: `comp-${Date.now()}-6`,
      name: "Secure Configuration",
      description: "Use secure configuration practices",
      status: code.match(/helmet|Content-Security-Policy|X-Frame-Options|X-XSS-Protection/i) ? "passed" : "warning",
      recommendation: "Use security headers, disable directory listings, and remove default accounts."
    });
    
    // A7:2017-Cross-Site Scripting (XSS)
    requirements.push({
      id: `comp-${Date.now()}-7`,
      name: "XSS Prevention",
      description: "Prevent cross-site scripting attacks",
      status: code.match(/DOMPurify|sanitize|escape|encodeURI/i) ? "passed" : 
             (code.match(/innerHTML|dangerouslySetInnerHTML/i) ? "failed" : "passed"),
      recommendation: "Use context-aware output encoding and input sanitization."
    });
  } else if (standard.toLowerCase() === "gdpr") {
    // GDPR compliance checks
    
    // Consent
    requirements.push({
      id: `comp-${Date.now()}-1`,
      name: "User Consent",
      description: "Obtain explicit consent before processing personal data",
      status: code.match(/consent|gdpr|opt-in|checkbox.{0,20}checked|accept.{0,20}terms/i) ? "passed" : 
             (code.match(/personal|data|email|name|address|phone|collect/i) ? "warning" : "passed"),
      recommendation: "Implement clear consent mechanisms before collecting any personal data."
    });
    
    // Right to Access
    requirements.push({
      id: `comp-${Date.now()}-2`,
      name: "Data Access Rights",
      description: "Allow users to access their personal data",
      status: code.match(/download.{0,20}data|export.{0,20}data|access.{0,20}data/i) ? "passed" : "warning",
      recommendation: "Implement functionality allowing users to export their personal data."
    });
    
    // Right to be Forgotten
    requirements.push({
      id: `comp-${Date.now()}-3`,
      name: "Data Deletion Rights",
      description: "Allow users to request deletion of their data",
      status: code.match(/delete.{0,20}account|remove.{0,20}data|forget.{0,20}me/i) ? "passed" : "warning",
      recommendation: "Implement functionality allowing users to delete their accounts and data."
    });
    
    // Data Breach Notification
    requirements.push({
      id: `comp-${Date.now()}-4`,
      name: "Breach Notification",
      description: "Capability to notify users of data breaches",
      status: code.match(/notification|alert|email.{0,20}users|notify/i) ? "passed" : "warning",
      recommendation: "Implement systems to detect and notify users of potential data breaches."
    });
  }
  
  return requirements;
}

/**
 * Generate a comprehensive security report based on findings
 * 
 * @param findings - The security findings
 * @param complianceRequirements - The compliance requirements
 * @returns A formatted security report
 */
export function generateSecurityReport(findings: SecurityFinding[], complianceRequirements: ComplianceRequirement[]): string {
  const report = ["# Security Assessment Report\n\n"];
  const timestamp = new Date().toLocaleString();
  
  report.push(`Report generated on: ${timestamp}\n\n`);
  
  // Summary section
  report.push("## Summary\n\n");
  
  const criticalVulnerabilities = findings.filter(f => f.type === "vulnerability" && f.severity === "critical").length;
  const highVulnerabilities = findings.filter(f => f.type === "vulnerability" && f.severity === "high").length;
  const mediumVulnerabilities = findings.filter(f => f.type === "vulnerability" && f.severity === "medium").length;
  const lowVulnerabilities = findings.filter(f => f.type === "vulnerability" && f.severity === "low").length;
  
  const bestPracticeIssues = findings.filter(f => f.type === "best_practice").length;
  const complianceIssues = findings.filter(f => f.type === "compliance").length;
  
  report.push("### Vulnerabilities\n\n");
  report.push(`- Critical: ${criticalVulnerabilities}\n`);
  report.push(`- High: ${highVulnerabilities}\n`);
  report.push(`- Medium: ${mediumVulnerabilities}\n`);
  report.push(`- Low: ${lowVulnerabilities}\n\n`);
  
  report.push(`- Best Practice Issues: ${bestPracticeIssues}\n`);
  report.push(`- Compliance Issues: ${complianceIssues}\n\n`);
  
  // Compliance status
  const passedRequirements = complianceRequirements.filter(r => r.status === "passed").length;
  const warningRequirements = complianceRequirements.filter(r => r.status === "warning").length;
  const failedRequirements = complianceRequirements.filter(r => r.status === "failed").length;
  
  report.push("### Compliance Status\n\n");
  report.push(`- Passed: ${passedRequirements}\n`);
  report.push(`- Warning: ${warningRequirements}\n`);
  report.push(`- Failed: ${failedRequirements}\n\n`);
  
  // Overall risk level
  let riskLevel = "Low";
  if (criticalVulnerabilities > 0 || failedRequirements > 2 || highVulnerabilities > 2) {
    riskLevel = "Critical";
  } else if (highVulnerabilities > 0 || failedRequirements > 0 || mediumVulnerabilities > 3) {
    riskLevel = "High";
  } else if (mediumVulnerabilities > 0 || warningRequirements > 3) {
    riskLevel = "Medium";
  }
  
  report.push(`**Overall Risk Level: ${riskLevel}**\n\n`);
  
  // Detailed findings
  if (findings.length > 0) {
    report.push("## Detailed Findings\n\n");
    
    // Group findings by severity
    if (criticalVulnerabilities > 0) {
      report.push("### Critical Vulnerabilities\n\n");
      findings.filter(f => f.type === "vulnerability" && f.severity === "critical").forEach(finding => {
        report.push(`#### ${finding.description}\n\n`);
        report.push(`- **Location:** ${finding.codeLocation}\n`);
        report.push(`- **Recommendation:** ${finding.recommendation}\n\n`);
      });
    }
    
    if (highVulnerabilities > 0) {
      report.push("### High Vulnerabilities\n\n");
      findings.filter(f => f.type === "vulnerability" && f.severity === "high").forEach(finding => {
        report.push(`#### ${finding.description}\n\n`);
        report.push(`- **Location:** ${finding.codeLocation}\n`);
        report.push(`- **Recommendation:** ${finding.recommendation}\n\n`);
      });
    }
    
    if (mediumVulnerabilities > 0) {
      report.push("### Medium Vulnerabilities\n\n");
      findings.filter(f => f.type === "vulnerability" && f.severity === "medium").forEach(finding => {
        report.push(`#### ${finding.description}\n\n`);
        report.push(`- **Location:** ${finding.codeLocation}\n`);
        report.push(`- **Recommendation:** ${finding.recommendation}\n\n`);
      });
    }
    
    if (lowVulnerabilities > 0) {
      report.push("### Low Vulnerabilities\n\n");
      findings.filter(f => f.type === "vulnerability" && f.severity === "low").forEach(finding => {
        report.push(`#### ${finding.description}\n\n`);
        report.push(`- **Location:** ${finding.codeLocation}\n`);
        report.push(`- **Recommendation:** ${finding.recommendation}\n\n`);
      });
    }
    
    if (bestPracticeIssues > 0) {
      report.push("### Best Practice Issues\n\n");
      findings.filter(f => f.type === "best_practice").forEach(finding => {
        report.push(`#### ${finding.description}\n\n`);
        report.push(`- **Location:** ${finding.codeLocation}\n`);
        report.push(`- **Recommendation:** ${finding.recommendation}\n\n`);
      });
    }
    
    if (complianceIssues > 0) {
      report.push("### Compliance Issues\n\n");
      findings.filter(f => f.type === "compliance").forEach(finding => {
        report.push(`#### ${finding.description}\n\n`);
        report.push(`- **Location:** ${finding.codeLocation}\n`);
        report.push(`- **Recommendation:** ${finding.recommendation}\n\n`);
      });
    }
  }
  
  // Compliance requirements
  if (complianceRequirements.length > 0) {
    report.push("## Compliance Requirements\n\n");
    
    // Group by status
    if (failedRequirements > 0) {
      report.push("### Failed Requirements\n\n");
      complianceRequirements.filter(r => r.status === "failed").forEach(req => {
        report.push(`#### ${req.name}\n\n`);
        report.push(`- **Description:** ${req.description}\n`);
        report.push(`- **Recommendation:** ${req.recommendation}\n\n`);
      });
    }
    
    if (warningRequirements > 0) {
      report.push("### Warning Requirements\n\n");
      complianceRequirements.filter(r => r.status === "warning").forEach(req => {
        report.push(`#### ${req.name}\n\n`);
        report.push(`- **Description:** ${req.description}\n`);
        report.push(`- **Recommendation:** ${req.recommendation}\n\n`);
      });
    }
    
    if (passedRequirements > 0) {
      report.push("### Passed Requirements\n\n");
      complianceRequirements.filter(r => r.status === "passed").forEach(req => {
        report.push(`- **${req.name}:** ${req.description}\n`);
      });
      report.push("\n");
    }
  }
  
  // Recommendations
  report.push("## Recommendations\n\n");
  report.push("Based on the findings, we recommend the following actions:\n\n");
  
  if (criticalVulnerabilities > 0) {
    report.push("### Immediate Actions\n\n");
    findings.filter(f => f.type === "vulnerability" && f.severity === "critical").forEach(finding => {
      report.push(`- ${finding.recommendation}\n`);
    });
    report.push("\n");
  }
  
  if (highVulnerabilities > 0 || failedRequirements > 0) {
    report.push("### High Priority Actions\n\n");
    findings.filter(f => f.severity === "high").forEach(finding => {
      report.push(`- ${finding.recommendation}\n`);
    });
    complianceRequirements.filter(r => r.status === "failed").forEach(req => {
      report.push(`- ${req.recommendation}\n`);
    });
    report.push("\n");
  }
  
  report.push("### General Recommendations\n\n");
  report.push("- Implement regular security reviews as part of the development process.\n");
  report.push("- Conduct security training for developers.\n");
  report.push("- Integrate automated security scanning into the CI/CD pipeline.\n");
  report.push("- Establish a security incident response process.\n\n");
  
  return report.join("");
}

/**
 * Checks if a message is related to security assessment
 * 
 * @param message - The user message to evaluate
 * @returns boolean indicating whether this is a security assessment request
 */
export function isSecurityAssessmentRequest(message: string): boolean {
  return message.match(/security|vulnerability|compliance|secure coding|best practices|owasp|penetration test|security scan/i) !== null;
}
