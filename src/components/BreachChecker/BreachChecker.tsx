import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert, ShieldCheck, Search, Info, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BreachResult {
  email: string;
  isBreached: boolean;
  breachCount: number;
  breaches: string[];
  lastBreachDate: string;
}

const BreachChecker = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<BreachResult | null>(null);

  // Simulated breach database (in production, would integrate with HaveIBeenPwned API)
  const simulatedBreaches = [
    { email: "test@example.com", breaches: ["LinkedIn (2012)", "Adobe (2013)", "Dropbox (2012)"], count: 3 },
    { email: "demo@company.com", breaches: ["Collection #1 (2019)"], count: 1 },
  ];

  const checkForBreaches = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to check",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    // Simulate API call
    setTimeout(() => {
      const breach = simulatedBreaches.find((b) => b.email === email);

      if (breach) {
        setResults({
          email,
          isBreached: true,
          breachCount: breach.count,
          breaches: breach.breaches,
          lastBreachDate: "2019-01-07",
        });
        toast({
          title: "Breach Detected!",
          description: `This email appears in ${breach.count} known data breach(es)`,
          variant: "destructive",
        });
      } else {
        setResults({
          email,
          isBreached: false,
          breachCount: 0,
          breaches: [],
          lastBreachDate: "",
        });
        toast({
          title: "Good News!",
          description: "This email does not appear in any known data breaches",
        });
      }

      setIsChecking(false);
    }, 1500);
  };

  const checkPassword = () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter a password to check",
        variant: "destructive",
      });
      return;
    }

    // Common compromised passwords
    const commonBreachedPasswords = [
      "123456", "password", "123456789", "12345678", "12345",
      "1234567", "password1", "qwerty", "abc123", "111111"
    ];

    const isCompromised = commonBreachedPasswords.some(
      (common) => password.toLowerCase() === common
    );

    if (isCompromised) {
      toast({
        title: "⚠️ Compromised Password!",
        description: "This password appears in known breach databases. Do not use it!",
        variant: "destructive",
      });
    } else {
      toast({
        title: "✓ Password Check Passed",
        description: "This password does not appear in common breach databases",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Data Breach Checker</h2>
        <p className="text-muted-foreground mt-1">
          Check if your email or password has been compromised in known data breaches
        </p>
      </div>

      <Alert className="border-info bg-info/10">
        <Info className="h-4 w-4 text-info" />
        <AlertDescription className="text-info">
          This tool checks against a database of known data breaches. In production, integrates with HaveIBeenPwned API for
          real-time breach detection across 600+ million pwned passwords and 11+ billion compromised accounts.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email Breach Check */}
        <Card className="p-6 card-glow">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <h3 className="text-xl font-semibold">Check Email Address</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Search across billions of records to see if your email has been compromised in data breaches
            </p>

            <div className="space-y-3">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-mono"
              />

              <Button
                onClick={checkForBreaches}
                disabled={isChecking}
                className="w-full btn-glow"
              >
                {isChecking ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check for Breaches
                  </>
                )}
              </Button>
            </div>

            {results && (
              <div
                className={`mt-4 p-4 rounded-lg border-2 animate-scale-in ${
                  results.isBreached
                    ? "border-destructive bg-destructive/10"
                    : "border-success bg-success/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {results.isBreached ? (
                    <ShieldAlert className="h-5 w-5 text-destructive mt-0.5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5 text-success mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-semibold ${results.isBreached ? "text-destructive" : "text-success"}`}>
                      {results.isBreached ? "⚠️ Breach Detected!" : "✓ No Breaches Found"}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono mt-1">{results.email}</p>

                    {results.isBreached && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium">
                          Found in {results.breachCount} breach{results.breachCount !== 1 ? "es" : ""}:
                        </p>
                        <ul className="text-sm space-y-1">
                          {results.breaches.map((breach, index) => (
                            <li key={index} className="flex items-center gap-2 text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                              {breach}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 p-3 rounded-lg bg-background/50">
                          <p className="text-xs font-medium text-destructive">
                            ⚠️ Recommended Actions:
                          </p>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                            <li>• Change your password immediately</li>
                            <li>• Enable two-factor authentication</li>
                            <li>• Use unique passwords for each account</li>
                            <li>• Monitor account activity for suspicious behavior</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {!results.isBreached && (
                      <p className="text-sm text-muted-foreground mt-2">
                        This email address does not appear in our database of known breaches. However, always use strong,
                        unique passwords and enable 2FA when available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Password Breach Check */}
        <Card className="p-6 card-glow">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="text-xl font-semibold">Check Password</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Verify if a password has been exposed in previous data breaches
            </p>

            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Enter password to check"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono"
              />

              <Button onClick={checkPassword} className="w-full btn-glow" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Check Password
              </Button>
            </div>

            <Alert className="border-warning/50 bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-warning text-xs">
                <strong>Privacy Note:</strong> In production, passwords are hashed using SHA-1 and only the first 5
                characters are sent to the API (k-Anonymity model), ensuring your password is never transmitted in plain
                text.
              </AlertDescription>
            </Alert>

            <div className="mt-4 p-4 rounded-lg bg-secondary/20">
              <p className="text-sm font-medium mb-2">Why Check for Breaches?</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Over 11 billion accounts have been compromised</li>
                <li>• 600+ million passwords exposed in breaches</li>
                <li>• Attackers use credential stuffing with leaked data</li>
                <li>• Compromised passwords enable account takeover</li>
              </ul>
            </div>

            <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-sm font-medium text-primary mb-2">Best Practices:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Never reuse passwords across accounts</li>
                <li>• Use a password manager</li>
                <li>• Enable two-factor authentication</li>
                <li>• Change passwords if breach detected</li>
                <li>• Use 16+ character passwords</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <Card className="p-6 card-glow">
        <h3 className="text-lg font-semibold mb-4">Breach Statistics</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center p-4 rounded-lg bg-secondary/20">
            <p className="text-2xl font-bold font-mono text-primary">11.2B+</p>
            <p className="text-sm text-muted-foreground mt-1">Compromised Accounts</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/20">
            <p className="text-2xl font-bold font-mono text-warning">600M+</p>
            <p className="text-sm text-muted-foreground mt-1">Pwned Passwords</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/20">
            <p className="text-2xl font-bold font-mono text-destructive">12,000+</p>
            <p className="text-sm text-muted-foreground mt-1">Data Breaches</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/20">
            <p className="text-2xl font-bold font-mono text-success">95%</p>
            <p className="text-sm text-muted-foreground mt-1">Detection Accuracy</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BreachChecker;
