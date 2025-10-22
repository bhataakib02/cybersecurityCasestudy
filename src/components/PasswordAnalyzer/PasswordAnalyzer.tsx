import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Info, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

interface AnalysisResult {
  score: number;
  strength: "very-weak" | "weak" | "moderate" | "strong" | "very-strong";
  entropy: number;
  crackTime: string;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    dictionary: boolean;
    sequential: boolean;
    repeated: boolean;
  };
  suggestions: string[];
}

const PasswordAnalyzer = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const queryClient = useQueryClient();

  const commonPasswords = [
    "password", "123456", "12345678", "qwerty", "abc123",
    "monkey", "1234567", "letmein", "trustno1", "dragon",
    "baseball", "iloveyou", "master", "sunshine", "ashley",
    "bailey", "passw0rd", "shadow", "123123", "654321",
    "superman", "qazwsx", "michael", "football", "welcome",
    "jesus", "ninja", "mustang", "password1", "123456789",
    "starwars", "computer", "solo", "jordan", "pepper",
    "whatever", "charlie", "cheese", "freedom", "princess"
  ];

  const analyzePassword = (pwd: string) => {
    if (!pwd) {
      setAnalysis(null);
      return;
    }

    // Character set checks
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    const length = pwd.length;

    // Pattern checks
    const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pwd);
    const hasRepeated = /(.)\1{2,}/.test(pwd);
    const isDictionary = commonPasswords.includes(pwd.toLowerCase());

    // Calculate entropy
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;

    const entropy = length * Math.log2(charsetSize || 1);

    // Calculate score (0-100)
    let score = 0;
    score += Math.min(length * 4, 40); // Up to 40 points for length
    if (hasUppercase) score += 10;
    if (hasLowercase) score += 10;
    if (hasNumbers) score += 10;
    if (hasSymbols) score += 15;
    if (length >= 12) score += 10;
    if (!hasSequential) score += 5;
    if (!hasRepeated) score += 5;
    if (!isDictionary) score += 15;
    score = Math.min(score, 100);

    // Penalize for weaknesses
    if (isDictionary) score = Math.min(score, 20);
    if (hasSequential) score -= 10;
    if (hasRepeated) score -= 10;
    if (length < 8) score = Math.min(score, 30);

    // Determine strength
    let strength: AnalysisResult["strength"];
    if (score >= 80) strength = "very-strong";
    else if (score >= 60) strength = "strong";
    else if (score >= 40) strength = "moderate";
    else if (score >= 20) strength = "weak";
    else strength = "very-weak";

    // Estimate crack time
    const possibilities = Math.pow(charsetSize || 1, length);
    const guessesPerSecond = 100_000_000_000; // 100 billion guesses/sec
    const seconds = possibilities / guessesPerSecond;

    let crackTime: string;
    if (seconds < 60) crackTime = "Less than a minute";
    else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 3153600000) crackTime = `${Math.round(seconds / 31536000)} years`;
    else if (seconds < 31536000000) crackTime = `${Math.round(seconds / 3153600000)} decades`;
    else if (seconds < 315360000000) crackTime = `${Math.round(seconds / 31536000000)} centuries`;
    else crackTime = "Millions of years";

    // Generate suggestions
    const suggestions: string[] = [];
    if (length < 12) suggestions.push("Increase length to at least 12 characters");
    if (!hasUppercase) suggestions.push("Add uppercase letters (A-Z)");
    if (!hasLowercase) suggestions.push("Add lowercase letters (a-z)");
    if (!hasNumbers) suggestions.push("Include numbers (0-9)");
    if (!hasSymbols) suggestions.push("Use special characters (!@#$%^&*)");
    if (isDictionary) suggestions.push("Avoid common words and passwords");
    if (hasSequential) suggestions.push("Avoid sequential patterns (abc, 123)");
    if (hasRepeated) suggestions.push("Avoid repeated characters (aaa, 111)");
    if (suggestions.length === 0) suggestions.push("Excellent password! Consider using a password manager to securely store it.");

    setAnalysis({
      score,
      strength,
      entropy: Math.round(entropy * 10) / 10,
      crackTime,
      checks: {
        length: length >= 12,
        uppercase: hasUppercase,
        lowercase: hasLowercase,
        numbers: hasNumbers,
        symbols: hasSymbols,
        dictionary: !isDictionary,
        sequential: !hasSequential,
        repeated: !hasRepeated,
      },
      suggestions,
    });

    // Trigger dashboard update by calling the API
    if (pwd.length > 0) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/analyze-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      }).then(() => {
        // Invalidate dashboard query to trigger refetch
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }).catch(console.error);
    }
  };

  const strengthConfig = {
    "very-weak": { color: "bg-destructive", label: "Very Weak", icon: AlertTriangle, textColor: "text-destructive" },
    "weak": { color: "bg-orange-500", label: "Weak", icon: AlertTriangle, textColor: "text-orange-500" },
    "moderate": { color: "bg-warning", label: "Moderate", icon: Info, textColor: "text-warning" },
    "strong": { color: "bg-primary", label: "Strong", icon: CheckCircle, textColor: "text-primary" },
    "very-strong": { color: "bg-success", label: "Very Strong", icon: Shield, textColor: "text-success" },
  };

  const config = analysis ? strengthConfig[analysis.strength] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Password Strength Analyzer</h2>
        <p className="text-muted-foreground mt-1">
          Real-time analysis with entropy calculation and security recommendations
        </p>
      </div>

      <Card className="p-6 card-glow">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password-input">Enter Password to Analyze</Label>
            <div className="relative">
              <Input
                id="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Type your password here..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  analyzePassword(e.target.value);
                }}
                className="pr-10 font-mono"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {analysis && config && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Strength Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password Strength</span>
                  <div className="flex items-center gap-2">
                    <config.icon className={`h-4 w-4 ${config.textColor}`} />
                    <span className={`text-sm font-semibold ${config.textColor}`}>{config.label}</span>
                  </div>
                </div>
                <Progress value={analysis.score} className={`h-3 ${config.color}`} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Score: {analysis.score}/100</span>
                  <span>Entropy: {analysis.entropy} bits</span>
                </div>
              </div>

              {/* Crack Time */}
              <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                <div className="flex items-start gap-3">
                  <Shield className={`h-5 w-5 mt-0.5 ${config.textColor}`} />
                  <div>
                    <p className="text-sm font-medium">Estimated Crack Time</p>
                    <p className={`text-lg font-bold font-mono mt-1 ${config.textColor}`}>{analysis.crackTime}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Against 100 billion guesses per second (modern GPU cluster)
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Checks */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(analysis.checks).map(([key, passed]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 p-3 rounded-lg border ${
                      passed ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"
                    }`}
                  >
                    {passed ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm font-medium capitalize">
                      {key === "dictionary" ? "Not Common" : key}
                    </span>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Recommendations</p>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!password && (
            <div className="p-8 text-center text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Enter a password above to see detailed security analysis</p>
            </div>
          )}
        </div>
      </Card>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 card-hover">
          <h4 className="text-sm font-semibold mb-2">What is Entropy?</h4>
          <p className="text-xs text-muted-foreground">
            Entropy measures password randomness in bits. Higher entropy means more possible combinations, making brute-force attacks harder. Aim for 60+ bits.
          </p>
        </Card>
        <Card className="p-4 card-hover">
          <h4 className="text-sm font-semibold mb-2">Dictionary Attacks</h4>
          <p className="text-xs text-muted-foreground">
            Attackers use lists of common passwords and words. Avoid dictionary words, names, and popular passwords even with substitutions.
          </p>
        </Card>
        <Card className="p-4 card-hover">
          <h4 className="text-sm font-semibold mb-2">Best Practices</h4>
          <p className="text-xs text-muted-foreground">
            Use 16+ random characters, enable 2FA, never reuse passwords, and use a password manager to generate and store strong passwords.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PasswordAnalyzer;
