import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Copy, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PolicyBuilder = () => {
  const [policySettings, setPolicySettings] = useState({
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxAge: 90,
    historyCount: 5,
    lockoutAttempts: 5,
    lockoutDuration: 30,
    complexity: "high",
    complianceLevel: "nist",
  });

  const handleExport = (format: "json" | "pdf" | "markdown") => {
    const policy = generatePolicyDocument();
    
    if (format === "json") {
      const dataStr = JSON.stringify(policySettings, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "password-policy.json";
      link.click();
    } else if (format === "markdown") {
      const dataBlob = new Blob([policy], { type: "text/markdown" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "password-policy.md";
      link.click();
    }

    toast({
      title: "Policy Exported",
      description: `Password policy exported as ${format.toUpperCase()}`,
    });
  };

  const copyToClipboard = () => {
    const policy = generatePolicyDocument();
    navigator.clipboard.writeText(policy);
    toast({
      title: "Copied!",
      description: "Policy document copied to clipboard",
    });
  };

  const generatePolicyDocument = () => {
    return `# Password Security Policy

## Policy Overview
This document defines the password security requirements and best practices for the organization.

**Compliance Level:** ${policySettings.complianceLevel.toUpperCase()}
**Policy Complexity:** ${policySettings.complexity}
**Last Updated:** ${new Date().toISOString().split('T')[0]}

## Password Requirements

### Composition Rules
- **Minimum Length:** ${policySettings.minLength} characters
- **Uppercase Letters:** ${policySettings.requireUppercase ? 'Required' : 'Optional'} (A-Z)
- **Lowercase Letters:** ${policySettings.requireLowercase ? 'Required' : 'Optional'} (a-z)
- **Numbers:** ${policySettings.requireNumbers ? 'Required' : 'Optional'} (0-9)
- **Special Characters:** ${policySettings.requireSymbols ? 'Required' : 'Optional'} (!@#$%^&*)

### Password Lifecycle
- **Maximum Age:** ${policySettings.maxAge} days
- **Password History:** ${policySettings.historyCount} previous passwords remembered
- **Expiration Warning:** 7 days before expiration

### Account Lockout Policy
- **Failed Attempt Threshold:** ${policySettings.lockoutAttempts} attempts
- **Lockout Duration:** ${policySettings.lockoutDuration} minutes
- **Reset Method:** Email verification or administrator intervention

## Security Controls

### Prohibited Passwords
- Dictionary words and common passwords
- Sequential or repeated characters (e.g., "12345", "aaaaa")
- Personal information (name, birthday, username)
- Previously breached passwords from known databases

### Implementation Guidelines
1. **Password Creation:**
   - Use passphrases or random character combinations
   - Employ a password manager for generation and storage
   - Never reuse passwords across systems
   - Avoid writing passwords down

2. **Password Protection:**
   - Never share passwords with others
   - Do not send passwords via email or unencrypted channels
   - Change password immediately if compromise suspected
   - Enable multi-factor authentication where available

3. **Technical Controls:**
   - Passwords must be hashed using bcrypt or Argon2
   - Implement rate limiting on authentication attempts
   - Use HTTPS for all password transmissions
   - Enforce secure password reset procedures

## Compliance Mapping

### NIST 800-63B Alignment
- ✓ Minimum 12-character length
- ✓ Support for all ASCII characters
- ✓ Check against breach databases
- ✓ No periodic password changes without reason
- ✓ Password strength meter implementation

### PCI DSS Requirements
- ✓ Unique passwords for system access
- ✓ Password complexity requirements
- ✓ 90-day maximum password age
- ✓ Password history of at least 4
- ✓ Account lockout after failed attempts

### ISO 27001 Controls
- ✓ A.9.4.3 Password management system
- ✓ A.9.2.4 User password management
- ✓ A.18.1.4 Privacy and data protection

## User Education

### Training Requirements
- Annual password security training for all users
- Phishing awareness and recognition
- Social engineering defense tactics
- Proper password manager usage

### Security Awareness Topics
- Importance of strong passwords
- Multi-factor authentication benefits
- Recognizing password phishing attempts
- Secure password sharing alternatives
- Incident reporting procedures

## Incident Response

### Breach Procedures
1. **Detection:** Immediate notification of suspected compromise
2. **Isolation:** Disable compromised accounts
3. **Investigation:** Determine scope and impact
4. **Remediation:** Force password reset for affected accounts
5. **Documentation:** Record incident details and response actions

### Reporting Channels
- IT Security Team: security@company.com
- Incident Hotline: (555) 123-4567
- Security Portal: https://security.company.com

## Policy Enforcement

### Monitoring and Auditing
- Quarterly password policy compliance audits
- Automated strength assessment for new passwords
- Regular breach database checks
- Failed authentication attempt monitoring

### Non-Compliance Consequences
1. First Violation: User education and warning
2. Second Violation: Manager notification
3. Third Violation: Account suspension
4. Continued Violations: Disciplinary action per HR policy

## Exceptions and Waivers
Requests for policy exceptions must be:
- Submitted in writing to IT Security
- Approved by CISO and business unit manager
- Documented with risk assessment
- Reviewed quarterly for continued validity

## Policy Review
This policy is reviewed annually or when:
- Significant security incidents occur
- Regulatory requirements change
- Technology landscape evolves
- Industry best practices update

**Next Review Date:** ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

---
*This policy is maintained by the Information Security Team*
*For questions or clarifications, contact: security@company.com*
`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Policy Builder</h2>
        <p className="text-muted-foreground mt-1">
          Create custom password policies tailored to your organization's security requirements
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <Card className="p-6 card-glow">
          <Tabs defaultValue="requirements" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="requirements" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Password Length: {policySettings.minLength}</Label>
                  <Slider
                    value={[policySettings.minLength]}
                    onValueChange={([value]) => setPolicySettings({ ...policySettings, minLength: value })}
                    min={8}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    NIST recommends minimum 12 characters
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase">Require Uppercase Letters</Label>
                    <Switch
                      id="uppercase"
                      checked={policySettings.requireUppercase}
                      onCheckedChange={(checked) =>
                        setPolicySettings({ ...policySettings, requireUppercase: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="lowercase">Require Lowercase Letters</Label>
                    <Switch
                      id="lowercase"
                      checked={policySettings.requireLowercase}
                      onCheckedChange={(checked) =>
                        setPolicySettings({ ...policySettings, requireLowercase: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="numbers">Require Numbers</Label>
                    <Switch
                      id="numbers"
                      checked={policySettings.requireNumbers}
                      onCheckedChange={(checked) =>
                        setPolicySettings({ ...policySettings, requireNumbers: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="symbols">Require Special Characters</Label>
                    <Switch
                      id="symbols"
                      checked={policySettings.requireSymbols}
                      onCheckedChange={(checked) =>
                        setPolicySettings({ ...policySettings, requireSymbols: checked })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complexity">Complexity Level</Label>
                  <Select
                    value={policySettings.complexity}
                    onValueChange={(value) => setPolicySettings({ ...policySettings, complexity: value })}
                  >
                    <SelectTrigger id="complexity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Basic requirements</SelectItem>
                      <SelectItem value="medium">Medium - Balanced security</SelectItem>
                      <SelectItem value="high">High - Maximum security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifecycle" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Maximum Password Age: {policySettings.maxAge} days</Label>
                  <Slider
                    value={[policySettings.maxAge]}
                    onValueChange={([value]) => setPolicySettings({ ...policySettings, maxAge: value })}
                    min={30}
                    max={365}
                    step={15}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    PCI DSS requires 90 days maximum
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Password History Count: {policySettings.historyCount}</Label>
                  <Slider
                    value={[policySettings.historyCount]}
                    onValueChange={([value]) => setPolicySettings({ ...policySettings, historyCount: value })}
                    min={0}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of previous passwords to remember
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Lockout Attempts: {policySettings.lockoutAttempts}</Label>
                  <Slider
                    value={[policySettings.lockoutAttempts]}
                    onValueChange={([value]) => setPolicySettings({ ...policySettings, lockoutAttempts: value })}
                    min={3}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lockout Duration: {policySettings.lockoutDuration} minutes</Label>
                  <Slider
                    value={[policySettings.lockoutDuration]}
                    onValueChange={([value]) => setPolicySettings({ ...policySettings, lockoutDuration: value })}
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compliance">Compliance Standard</Label>
                  <Select
                    value={policySettings.complianceLevel}
                    onValueChange={(value) => setPolicySettings({ ...policySettings, complianceLevel: value })}
                  >
                    <SelectTrigger id="compliance">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nist">NIST 800-63B</SelectItem>
                      <SelectItem value="pci">PCI DSS 3.2.1</SelectItem>
                      <SelectItem value="iso">ISO 27001</SelectItem>
                      <SelectItem value="hipaa">HIPAA Security Rule</SelectItem>
                      <SelectItem value="soc2">SOC 2 Type II</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-medium mb-3">Export Policy</p>
            <div className="flex gap-2">
              <Button onClick={() => handleExport("json")} variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button onClick={() => handleExport("markdown")} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Markdown
              </Button>
              <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Policy Preview</h3>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>

          <div className="space-y-4 custom-scrollbar" style={{ maxHeight: "600px", overflowY: "auto" }}>
            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-sm font-medium mb-2">Password Requirements</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Minimum {policySettings.minLength} characters</li>
                {policySettings.requireUppercase && <li>✓ At least one uppercase letter (A-Z)</li>}
                {policySettings.requireLowercase && <li>✓ At least one lowercase letter (a-z)</li>}
                {policySettings.requireNumbers && <li>✓ At least one number (0-9)</li>}
                {policySettings.requireSymbols && <li>✓ At least one special character (!@#$%)</li>}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-sm font-medium mb-2">Password Lifecycle</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Passwords expire after {policySettings.maxAge} days</li>
                <li>• Cannot reuse last {policySettings.historyCount} passwords</li>
                <li>• Warning notification 7 days before expiration</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-sm font-medium mb-2">Account Security</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Account locks after {policySettings.lockoutAttempts} failed attempts</li>
                <li>• Lockout duration: {policySettings.lockoutDuration} minutes</li>
                <li>• Automatic unlock or admin reset required</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary mb-2">Compliance: {policySettings.complianceLevel.toUpperCase()}</p>
              <p className="text-xs text-muted-foreground">
                This policy meets the requirements of {policySettings.complianceLevel.toUpperCase()} standards and
                industry best practices for password security.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-sm font-medium mb-2">Prohibited Passwords</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Common dictionary words</li>
                <li>• Sequential characters (123456, abcdef)</li>
                <li>• Personal information (name, birthday)</li>
                <li>• Previously breached passwords</li>
                <li>• Repeated characters (aaaaaa, 111111)</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-secondary/20">
              <p className="text-sm font-medium mb-2">Technical Implementation</p>
              <ul className="text-sm space-y-1 text-muted-foreground font-mono text-xs">
                <li>• Hash: bcrypt or Argon2</li>
                <li>• Salt: Unique per password</li>
                <li>• Transport: TLS 1.3+</li>
                <li>• Rate Limiting: 5 requests/minute</li>
                <li>• MFA: Strongly recommended</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PolicyBuilder;
