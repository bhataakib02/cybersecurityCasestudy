import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, TrendingUp, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  result: "success" | "failure" | "warning";
  details: string;
  ipAddress: string;
}

const AuditReports = () => {
  const [reportType, setReportType] = useState("weekly");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  // Sample audit data
  const auditEntries: AuditEntry[] = [
    {
      id: "1",
      timestamp: "2025-10-20 14:32:15",
      user: "john.doe@company.com",
      action: "Password Change",
      result: "success",
      details: "User changed password successfully",
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      timestamp: "2025-10-20 13:15:42",
      user: "jane.smith@company.com",
      action: "Failed Login Attempt",
      result: "failure",
      details: "Incorrect password - attempt 3 of 5",
      ipAddress: "10.0.0.45",
    },
    {
      id: "3",
      timestamp: "2025-10-20 12:08:23",
      user: "admin@company.com",
      action: "Policy Update",
      result: "success",
      details: "Updated minimum password length to 14",
      ipAddress: "192.168.1.10",
    },
    {
      id: "4",
      timestamp: "2025-10-20 11:45:10",
      user: "bob.johnson@company.com",
      action: "Password Reset",
      result: "success",
      details: "Password reset via email verification",
      ipAddress: "172.16.0.89",
    },
    {
      id: "5",
      timestamp: "2025-10-20 10:22:55",
      user: "sarah.williams@company.com",
      action: "Weak Password Rejected",
      result: "warning",
      details: "Password failed complexity requirements",
      ipAddress: "192.168.1.150",
    },
    {
      id: "6",
      timestamp: "2025-10-20 09:17:31",
      user: "mike.davis@company.com",
      action: "Account Lockout",
      result: "failure",
      details: "Account locked after 5 failed attempts",
      ipAddress: "10.0.0.78",
    },
    {
      id: "7",
      timestamp: "2025-10-20 08:45:00",
      user: "lisa.anderson@company.com",
      action: "MFA Enabled",
      result: "success",
      details: "Two-factor authentication activated",
      ipAddress: "192.168.1.125",
    },
    {
      id: "8",
      timestamp: "2025-10-19 16:30:22",
      user: "david.wilson@company.com",
      action: "Batch Password Analysis",
      result: "success",
      details: "Analyzed 250 passwords - 45 flagged as weak",
      ipAddress: "192.168.1.50",
    },
  ];

  const stats = {
    totalEvents: 8247,
    successRate: 87.3,
    failedAttempts: 1248,
    accountLockouts: 23,
    passwordChanges: 1842,
    policyViolations: 376,
  };

  const generateReport = () => {
    const report = `# Password Security Audit Report

## Report Summary
**Period:** ${reportType === "weekly" ? "Last 7 Days" : reportType === "monthly" ? "Last 30 Days" : "Last 90 Days"}
**Generated:** ${new Date().toLocaleString()}
**Report ID:** ${Date.now()}

## Executive Summary

### Key Metrics
- **Total Security Events:** ${stats.totalEvents.toLocaleString()}
- **Success Rate:** ${stats.successRate}%
- **Failed Login Attempts:** ${stats.failedAttempts.toLocaleString()}
- **Account Lockouts:** ${stats.accountLockouts}
- **Password Changes:** ${stats.passwordChanges.toLocaleString()}
- **Policy Violations:** ${stats.policyViolations}

## Detailed Findings

### Password Strength Analysis
- **Very Strong:** 2,847 passwords (34.5%)
- **Strong:** 4,521 passwords (54.8%)
- **Moderate:** 698 passwords (8.5%)
- **Weak:** 143 passwords (1.7%)
- **Very Weak:** 38 passwords (0.5%)

**Recommendation:** Focus remediation efforts on the 181 weak/very weak passwords.

### Authentication Events
- **Successful Logins:** 7,199 (87.3%)
- **Failed Attempts:** 1,248 (15.1%)
- **Account Lockouts:** 23 (0.3%)
- **Password Resets:** 184 (2.2%)

**Finding:** Failed attempt rate is within acceptable range. 23 lockouts indicate possible brute-force attempts.

### Compliance Status

#### NIST 800-63B
- ✓ Minimum 12-character requirement: 98.5% compliant
- ✓ Breach database checking: Enabled
- ✓ Password strength meter: Implemented
- ✗ All ASCII support: 92.3% (7.7% systems need update)

#### PCI DSS 3.2.1
- ✓ 90-day expiration: 100% enforced
- ✓ Password history (4): 100% compliant
- ✓ Account lockout (6 attempts): Configured
- ✓ Unique user IDs: 100% compliant

#### ISO/IEC 27001
- ✓ Password complexity: 98.5% compliant
- ✓ Encrypted storage: Argon2id hashing
- ✓ Password management system: Implemented
- ✓ User training: 96.2% completion rate

### Security Incidents

#### High Priority
1. **23 Account Lockouts** - Investigate for brute-force attempts
   - 18 appear to be legitimate user errors
   - 5 show patterns consistent with automated attacks
   - Recommendation: Implement CAPTCHA after 3 failed attempts

#### Medium Priority
1. **376 Policy Violations** - Users attempting weak passwords
   - 289 dictionary words detected
   - 87 sequential patterns (abc123, etc.)
   - Recommendation: Enhanced user education program

#### Low Priority
1. **143 Weak Passwords** - Still in use by end users
   - Users notified, forced change in 30 days
   - Recommendation: Implement immediate change for critical accounts

### Top Findings & Recommendations

1. **Implement CAPTCHA**
   - Priority: High
   - Evidence: 5 potential automated attack attempts
   - Timeline: 2 weeks

2. **Enhanced Password Training**
   - Priority: Medium
   - Evidence: 376 policy violations
   - Timeline: 30 days

3. **Privileged Account Review**
   - Priority: High
   - Evidence: 8 admin accounts with standard password expiration
   - Timeline: Immediate

4. **MFA Deployment**
   - Priority: Critical
   - Evidence: Only 34.5% of users have MFA enabled
   - Timeline: 60 days for full deployment

5. **Password Manager Rollout**
   - Priority: Medium
   - Evidence: 143 weak passwords still in use
   - Timeline: 90 days

### Detailed Event Log

${auditEntries
  .map(
    (entry) => `**${entry.timestamp}** | ${entry.user}
Action: ${entry.action}
Result: ${entry.result.toUpperCase()}
Details: ${entry.details}
IP: ${entry.ipAddress}
---`
  )
  .join("\n\n")}

## Compliance Attestation

This audit was conducted in accordance with:
- NIST 800-63B Digital Identity Guidelines
- PCI DSS 3.2.1 Requirements 8.1-8.8
- ISO/IEC 27001:2013 Controls A.9.2.4, A.9.4.3
- HIPAA Security Rule §164.308(a)(5)(ii)(D)
- SOC 2 Trust Services Criteria CC6.1

## Report Authorization

**Prepared By:** Security Audit System
**Reviewed By:** [To be completed by CISO]
**Approved By:** [To be completed by management]

---
*This report contains confidential information. Distribution restricted to authorized personnel only.*
`;

    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-report-${reportType}-${Date.now()}.md`;
    link.click();

    toast({
      title: "Report Generated",
      description: `${reportType} audit report downloaded successfully`,
    });
  };

  const exportCSV = () => {
    const csv = [
      "Timestamp,User,Action,Result,Details,IP Address",
      ...auditEntries.map(
        (entry) =>
          `"${entry.timestamp}","${entry.user}","${entry.action}","${entry.result}","${entry.details}","${entry.ipAddress}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${Date.now()}.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: "Audit log exported to CSV",
    });
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "success":
        return "text-success bg-success/10";
      case "failure":
        return "text-destructive bg-destructive/10";
      case "warning":
        return "text-warning bg-warning/10";
      default:
        return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Audit Reports</h2>
          <p className="text-muted-foreground mt-1">
            Sample security audit reports and event logging
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4 card-glow">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Events</span>
          </div>
          <p className="text-2xl font-bold font-mono">{stats.totalEvents.toLocaleString()}</p>
        </Card>

        <Card className="p-4 card-glow">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Success Rate</span>
          </div>
          <p className="text-2xl font-bold font-mono text-success">{stats.successRate}%</p>
        </Card>

        <Card className="p-4 card-glow">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Failed Attempts</span>
          </div>
          <p className="text-2xl font-bold font-mono">{stats.failedAttempts.toLocaleString()}</p>
        </Card>

        <Card className="p-4 card-glow">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground">Lockouts</span>
          </div>
          <p className="text-2xl font-bold font-mono">{stats.accountLockouts}</p>
        </Card>

        <Card className="p-4 card-glow">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-info" />
            <span className="text-xs text-muted-foreground">Password Changes</span>
          </div>
          <p className="text-2xl font-bold font-mono">{stats.passwordChanges.toLocaleString()}</p>
        </Card>

        <Card className="p-4 card-glow">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground">Policy Violations</span>
          </div>
          <p className="text-2xl font-bold font-mono">{stats.policyViolations}</p>
        </Card>
      </div>

      {/* Report Generation */}
      <Card className="p-6 card-glow">
        <h3 className="text-lg font-semibold mb-4">Generate Audit Report</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Report Type</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
                <SelectItem value="quarterly">Quarterly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Time Period</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="previous">Previous Period</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={generateReport} className="w-full btn-glow">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Event Log */}
      <Card className="p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Security Events</h3>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <div className="rounded-lg border border-border custom-scrollbar" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono text-xs">{entry.timestamp}</TableCell>
                  <TableCell className="text-sm">{entry.user}</TableCell>
                  <TableCell className="text-sm font-medium">{entry.action}</TableCell>
                  <TableCell>
                    <Badge className={getResultColor(entry.result)} variant="secondary">
                      {entry.result}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{entry.details}</TableCell>
                  <TableCell className="font-mono text-xs">{entry.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AuditReports;
