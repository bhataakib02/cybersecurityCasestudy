import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Users, Clock, AlertTriangle, CheckCircle, FileText } from "lucide-react";

const PolicyRecommendations = () => {
  const recommendations = [
    {
      category: "Password Requirements",
      icon: Lock,
      priority: "Critical",
      items: [
        {
          title: "Minimum Length Requirement",
          description: "Enforce a minimum password length of 12 characters (NIST recommends 12-16 characters minimum)",
          rationale: "Longer passwords exponentially increase resistance to brute-force attacks",
          implementation: "Configure system authentication to reject passwords shorter than 12 characters",
          compliance: ["NIST 800-63B", "PCI DSS 8.2.3"],
        },
        {
          title: "Character Complexity",
          description: "Require at least three of four character types: uppercase, lowercase, numbers, symbols",
          rationale: "Increases character space and password entropy",
          implementation: "Implement validation rules in password creation forms and APIs",
          compliance: ["PCI DSS 8.2.3", "ISO 27001 A.9.4.3"],
        },
        {
          title: "Prohibited Passwords",
          description: "Ban common passwords, dictionary words, and previously breached passwords",
          rationale: "Prevents use of easily guessable passwords targeted in credential stuffing attacks",
          implementation: "Integrate with breach databases (e.g., HaveIBeenPwned) and maintain custom blocklist",
          compliance: ["NIST 800-63B", "OWASP ASVS 2.1.7"],
        },
      ],
    },
    {
      category: "Password Lifecycle Management",
      icon: Clock,
      priority: "High",
      items: [
        {
          title: "Password Expiration Policy",
          description: "Set maximum password age to 90 days for privileged accounts, 180 days for standard users",
          rationale: "Limits exposure window if password is compromised",
          implementation: "Configure automated password expiration with 7-day advance warning",
          compliance: ["PCI DSS 8.2.4", "ISO 27001 A.9.2.4"],
        },
        {
          title: "Password History Enforcement",
          description: "Prevent reuse of last 5 passwords",
          rationale: "Prevents users from cycling through favorite passwords",
          implementation: "Store hashed password history and validate against it during password changes",
          compliance: ["PCI DSS 8.2.5", "HIPAA §164.308"],
        },
        {
          title: "Grace Period Management",
          description: "Allow 7-day warning before expiration, 3-day grace period after",
          rationale: "Balances security with user experience to prevent lockouts",
          implementation: "Implement notification system and temporary access extension",
          compliance: ["Best Practice"],
        },
      ],
    },
    {
      category: "Account Security Controls",
      icon: Shield,
      priority: "Critical",
      items: [
        {
          title: "Account Lockout Policy",
          description: "Lock account after 5 failed login attempts for 30 minutes",
          rationale: "Mitigates brute-force and password spraying attacks",
          implementation: "Configure authentication system with automatic lockout and alerting",
          compliance: ["PCI DSS 8.1.6", "NIST 800-63B"],
        },
        {
          title: "Multi-Factor Authentication",
          description: "Require MFA for all privileged accounts and remote access",
          rationale: "Provides defense-in-depth even if password is compromised",
          implementation: "Deploy MFA solution (TOTP, SMS, biometric, or hardware tokens)",
          compliance: ["PCI DSS 8.3", "NIST 800-63B AAL2", "SOC 2"],
        },
        {
          title: "Session Management",
          description: "Enforce 15-minute idle timeout, 8-hour maximum session duration",
          rationale: "Reduces risk of session hijacking and unauthorized access",
          implementation: "Configure session timeout in application settings",
          compliance: ["PCI DSS 8.1.8", "OWASP ASVS 3.2.1"],
        },
      ],
    },
    {
      category: "User Education & Training",
      icon: Users,
      priority: "High",
      items: [
        {
          title: "Security Awareness Training",
          description: "Conduct annual password security training for all employees",
          rationale: "Human factor is often the weakest link in security",
          implementation: "Deploy interactive training modules covering password best practices and phishing",
          compliance: ["ISO 27001 A.7.2.2", "SOC 2 CC1.4"],
        },
        {
          title: "Password Manager Deployment",
          description: "Provide enterprise password manager to all users",
          rationale: "Enables use of strong, unique passwords without memorization burden",
          implementation: "Select, license, and deploy password management solution organization-wide",
          compliance: ["NIST 800-63B Recommendation", "Best Practice"],
        },
        {
          title: "Phishing Simulation",
          description: "Conduct quarterly phishing tests with targeted training for failures",
          rationale: "Tests and improves ability to recognize credential theft attempts",
          implementation: "Use phishing simulation platform with metrics tracking",
          compliance: ["Best Practice", "Cyber Insurance Requirements"],
        },
      ],
    },
    {
      category: "Technical Implementation",
      icon: FileText,
      priority: "Critical",
      items: [
        {
          title: "Password Storage",
          description: "Hash all passwords using Argon2id or bcrypt with appropriate work factors",
          rationale: "Protects passwords even if database is compromised",
          implementation: "Use Argon2id (memory-hard) or bcrypt with cost factor 12+",
          compliance: ["OWASP ASVS 2.4.1", "PCI DSS 8.2.1"],
        },
        {
          title: "Transmission Security",
          description: "Require TLS 1.3 for all password transmissions",
          rationale: "Prevents credential interception via man-in-the-middle attacks",
          implementation: "Configure web servers to require TLS 1.3, disable older protocols",
          compliance: ["PCI DSS 4.1", "NIST 800-52r2"],
        },
        {
          title: "Rate Limiting",
          description: "Implement rate limiting of 5 authentication attempts per minute per IP",
          rationale: "Slows down automated brute-force attacks",
          implementation: "Deploy rate limiting middleware or WAF rules",
          compliance: ["OWASP ASVS 2.2.1", "Best Practice"],
        },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-destructive border-destructive bg-destructive/10";
      case "High":
        return "text-warning border-warning bg-warning/10";
      default:
        return "text-info border-info bg-info/10";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Policy Recommendations</h2>
        <p className="text-muted-foreground mt-1">
          Comprehensive password security policy framework aligned with industry standards
        </p>
      </div>

      <Alert className="border-primary bg-primary/10">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          <strong>Implementation Roadmap:</strong> Start with Critical priority items, then address High priority
          recommendations. Review and update policies quarterly or after security incidents.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {recommendations.map((section, index) => (
          <Card key={index} className="p-6 card-glow animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{section.category}</h3>
              </div>
              <Badge className={getPriorityColor(section.priority)} variant="outline">
                {section.priority}
              </Badge>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {section.items.map((item, itemIndex) => (
                <AccordionItem key={itemIndex} value={`item-${itemIndex}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2 pl-6">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Description:</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Rationale:</p>
                        <p className="text-sm text-muted-foreground">{item.rationale}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Implementation:</p>
                        <p className="text-sm text-muted-foreground">{item.implementation}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Compliance Standards:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.compliance.map((standard, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        ))}
      </div>

      {/* Quick Reference Card */}
      <Card className="p-6 card-glow border-primary/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Quick Reference: Minimum Security Baselines
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-secondary/20">
            <p className="text-sm font-medium mb-1">Password Requirements</p>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• Minimum 12 characters</li>
              <li>• Mixed case + numbers + symbols</li>
              <li>• No dictionary words</li>
              <li>• Check against breach databases</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-secondary/20">
            <p className="text-sm font-medium mb-1">Account Controls</p>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• 5 failed attempts → 30 min lockout</li>
              <li>• MFA required for privileged access</li>
              <li>• 15 min idle timeout</li>
              <li>• Rate limit: 5 req/min</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-secondary/20">
            <p className="text-sm font-medium mb-1">Password Lifecycle</p>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• 90-day expiration (privileged)</li>
              <li>• 5 password history</li>
              <li>• 7-day expiration warning</li>
              <li>• Secure reset process</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-secondary/20">
            <p className="text-sm font-medium mb-1">Technical Controls</p>
            <ul className="text-xs text-muted-foreground space-y-1 font-mono">
              <li>• Argon2id or bcrypt hashing</li>
              <li>• TLS 1.3 for transmission</li>
              <li>• No plaintext storage</li>
              <li>• Audit logging enabled</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PolicyRecommendations;
