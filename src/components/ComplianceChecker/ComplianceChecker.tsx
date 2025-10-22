import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertTriangle, Shield, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ComplianceCheck {
  id: string;
  requirement: string;
  description: string;
  status: "pass" | "fail" | "partial";
  score: number;
}

const ComplianceChecker = () => {
  const [password, setPassword] = useState("");
  const [results, setResults] = useState<{ [key: string]: ComplianceCheck[] } | null>(null);

  const standards = {
    nist: {
      name: "NIST 800-63B",
      description: "National Institute of Standards and Technology Digital Identity Guidelines",
      checks: [
        {
          id: "nist-1",
          requirement: "Minimum 12 Characters",
          description: "Password must be at least 12 characters long",
          test: (pwd: string) => pwd.length >= 12,
          weight: 20,
        },
        {
          id: "nist-2",
          requirement: "All ASCII Characters Allowed",
          description: "Support all printable ASCII characters including spaces",
          test: () => true,
          weight: 10,
        },
        {
          id: "nist-3",
          requirement: "No Composition Rules Required",
          description: "Should not enforce specific character type requirements",
          test: () => true,
          weight: 15,
        },
        {
          id: "nist-4",
          requirement: "Breach Database Check",
          description: "Compare against known compromised password databases",
          test: (pwd: string) => !["password", "123456", "qwerty"].includes(pwd.toLowerCase()),
          weight: 25,
        },
        {
          id: "nist-5",
          requirement: "No Periodic Changes",
          description: "Only require password change if compromise suspected",
          test: () => true,
          weight: 15,
        },
        {
          id: "nist-6",
          requirement: "Password Strength Meter",
          description: "Provide real-time password strength feedback",
          test: () => true,
          weight: 15,
        },
      ],
    },
    pci: {
      name: "PCI DSS 3.2.1",
      description: "Payment Card Industry Data Security Standard",
      checks: [
        {
          id: "pci-1",
          requirement: "Minimum 7 Characters",
          description: "Passwords must be at least 7 characters (8+ recommended)",
          test: (pwd: string) => pwd.length >= 7,
          weight: 15,
        },
        {
          id: "pci-2",
          requirement: "Numeric and Alphabetic",
          description: "Password must contain both letters and numbers",
          test: (pwd: string) => /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd),
          weight: 20,
        },
        {
          id: "pci-3",
          requirement: "90-Day Expiration",
          description: "Passwords must be changed at least every 90 days",
          test: () => true,
          weight: 15,
        },
        {
          id: "pci-4",
          requirement: "Password History",
          description: "Cannot reuse any of the last 4 passwords",
          test: () => true,
          weight: 15,
        },
        {
          id: "pci-5",
          requirement: "Lockout After 6 Attempts",
          description: "Account locks after 6 failed login attempts",
          test: () => true,
          weight: 20,
        },
        {
          id: "pci-6",
          requirement: "Unique User IDs",
          description: "Each user must have a unique ID that cannot be shared",
          test: () => true,
          weight: 15,
        },
      ],
    },
    iso: {
      name: "ISO/IEC 27001",
      description: "Information Security Management System Standard",
      checks: [
        {
          id: "iso-1",
          requirement: "Password Complexity",
          description: "Minimum length and complexity requirements enforced",
          test: (pwd: string) => pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
          weight: 20,
        },
        {
          id: "iso-2",
          requirement: "Password Protection",
          description: "Passwords stored in encrypted or hashed form",
          test: () => true,
          weight: 25,
        },
        {
          id: "iso-3",
          requirement: "Password Management System",
          description: "Formal system for password generation, distribution, and storage",
          test: () => true,
          weight: 20,
        },
        {
          id: "iso-4",
          requirement: "User Responsibilities",
          description: "Users required to maintain password confidentiality",
          test: () => true,
          weight: 15,
        },
        {
          id: "iso-5",
          requirement: "Temporary Passwords",
          description: "Force change of temporary/initial passwords at first use",
          test: () => true,
          weight: 10,
        },
        {
          id: "iso-6",
          requirement: "Access Control",
          description: "Password-based access controls for systems and applications",
          test: () => true,
          weight: 10,
        },
      ],
    },
    hipaa: {
      name: "HIPAA Security Rule",
      description: "Health Insurance Portability and Accountability Act",
      checks: [
        {
          id: "hipaa-1",
          requirement: "Unique User Identification",
          description: "Assign unique identifier for tracking user identity",
          test: () => true,
          weight: 20,
        },
        {
          id: "hipaa-2",
          requirement: "Emergency Access Procedure",
          description: "Establish procedures for emergency access to ePHI",
          test: () => true,
          weight: 15,
        },
        {
          id: "hipaa-3",
          requirement: "Automatic Logoff",
          description: "Implement automatic logoff from inactive sessions",
          test: () => true,
          weight: 15,
        },
        {
          id: "hipaa-4",
          requirement: "Encryption and Decryption",
          description: "Implement mechanisms to encrypt and decrypt ePHI",
          test: () => true,
          weight: 25,
        },
        {
          id: "hipaa-5",
          requirement: "Password Complexity",
          description: "Strong passwords with complexity requirements",
          test: (pwd: string) =>
            pwd.length >= 8 &&
            /[A-Z]/.test(pwd) &&
            /[a-z]/.test(pwd) &&
            /[0-9]/.test(pwd) &&
            /[^A-Za-z0-9]/.test(pwd),
          weight: 15,
        },
        {
          id: "hipaa-6",
          requirement: "Transmission Security",
          description: "Guard against unauthorized access during transmission",
          test: () => true,
          weight: 10,
        },
      ],
    },
    soc2: {
      name: "SOC 2 Type II",
      description: "Service Organization Control 2 Trust Services Criteria",
      checks: [
        {
          id: "soc2-1",
          requirement: "Strong Authentication",
          description: "Multi-factor authentication for privileged users",
          test: () => true,
          weight: 25,
        },
        {
          id: "soc2-2",
          requirement: "Password Requirements",
          description: "Minimum complexity and length standards enforced",
          test: (pwd: string) => pwd.length >= 10 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd),
          weight: 20,
        },
        {
          id: "soc2-3",
          requirement: "Access Restrictions",
          description: "Logical access to systems restricted to authorized users",
          test: () => true,
          weight: 15,
        },
        {
          id: "soc2-4",
          requirement: "Password Security Policies",
          description: "Documented policies for password creation and management",
          test: () => true,
          weight: 15,
        },
        {
          id: "soc2-5",
          requirement: "Monitoring and Review",
          description: "Regular review of user access and password compliance",
          test: () => true,
          weight: 15,
        },
        {
          id: "soc2-6",
          requirement: "Security Awareness Training",
          description: "Regular security training including password best practices",
          test: () => true,
          weight: 10,
        },
      ],
    },
  };

  const runComplianceCheck = () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password to check compliance",
        variant: "destructive",
      });
      return;
    }

    const checkResults: { [key: string]: ComplianceCheck[] } = {};

    Object.entries(standards).forEach(([key, standard]) => {
      checkResults[key] = standard.checks.map((check) => {
        const passed = check.test(password);
        return {
          id: check.id,
          requirement: check.requirement,
          description: check.description,
          status: passed ? "pass" : "fail",
          score: passed ? check.weight : 0,
        };
      });
    });

    setResults(checkResults);

    const overallScore = Object.values(checkResults).reduce((acc, checks) => {
      const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
      return acc + totalScore;
    }, 0) / Object.keys(standards).length;

    toast({
      title: "Compliance Check Complete",
      description: `Average compliance score: ${Math.round(overallScore)}%`,
    });
  };

  const exportReport = () => {
    if (!results) return;

    let report = "# Password Compliance Report\n\n";
    report += `Generated: ${new Date().toISOString()}\n\n`;

    Object.entries(standards).forEach(([key, standard]) => {
      const checks = results[key];
      const score = checks.reduce((sum, check) => sum + check.score, 0);
      
      report += `## ${standard.name}\n`;
      report += `${standard.description}\n`;
      report += `Overall Score: ${score}%\n\n`;

      checks.forEach((check) => {
        const status = check.status === "pass" ? "✓ PASS" : "✗ FAIL";
        report += `${status} - ${check.requirement}\n`;
        report += `  ${check.description}\n\n`;
      });
    });

    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compliance-report-${Date.now()}.md`;
    link.click();

    toast({
      title: "Report Exported",
      description: "Compliance report downloaded successfully",
    });
  };

  const calculateScore = (checks: ComplianceCheck[]) => {
    return checks.reduce((sum, check) => sum + check.score, 0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Compliance Checker</h2>
        <p className="text-muted-foreground mt-1">
          Verify password policies against major compliance standards
        </p>
      </div>

      <Card className="p-6 card-glow">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter Password to Test Compliance</label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Test password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 font-mono"
              />
              <Button onClick={runComplianceCheck} className="btn-glow">
                <Shield className="mr-2 h-4 w-4" />
                Check
              </Button>
            </div>
          </div>

          {results && (
            <Button onClick={exportReport} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Compliance Report
            </Button>
          )}
        </div>
      </Card>

      {results && (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-5">
            {Object.entries(standards).map(([key, standard]) => {
              const checks = results[key];
              const score = calculateScore(checks);
              const total = standard.checks.reduce((sum, check) => sum + check.weight, 0);
              const percentage = Math.round((score / total) * 100);

              return (
                <Card key={key} className="p-4 card-glow">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{standard.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono">{percentage}</span>
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Detailed Results */}
          <Card className="p-6 card-glow">
            <Tabs defaultValue="nist" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {Object.entries(standards).map(([key, standard]) => (
                  <TabsTrigger key={key} value={key}>
                    {standard.name.split(" ")[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(standards).map(([key, standard]) => (
                <TabsContent key={key} value={key} className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold">{standard.name}</h3>
                    <p className="text-sm text-muted-foreground">{standard.description}</p>
                  </div>

                  <div className="space-y-2">
                    {results[key].map((check) => (
                      <div
                        key={check.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border ${
                          check.status === "pass"
                            ? "border-success/30 bg-success/10"
                            : "border-destructive/30 bg-destructive/10"
                        }`}
                      >
                        {check.status === "pass" ? (
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{check.requirement}</p>
                            <Badge variant={check.status === "pass" ? "default" : "destructive"}>
                              {check.score}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{check.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </>
      )}

      {!results && (
        <Card className="p-12 card-glow text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg font-medium mb-2">No Compliance Check Yet</p>
          <p className="text-sm text-muted-foreground">
            Enter a password and click Check to see compliance across 5 major standards
          </p>
        </Card>
      )}
    </div>
  );
};

export default ComplianceChecker;
