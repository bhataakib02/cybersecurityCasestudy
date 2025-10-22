import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface BatchResult {
  password: string;
  score: number;
  strength: string;
  entropy: number;
  issues: string[];
}

const BatchAnalyzer = () => {
  const [passwords, setPasswords] = useState("");
  const [results, setResults] = useState<BatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzePassword = (pwd: string): BatchResult => {
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd);
    const length = pwd.length;

    const issues: string[] = [];
    
    let charsetSize = 0;
    if (hasLowercase) charsetSize += 26;
    if (hasUppercase) charsetSize += 26;
    if (hasNumbers) charsetSize += 10;
    if (hasSymbols) charsetSize += 32;

    const entropy = length * Math.log2(charsetSize || 1);

    let score = 0;
    score += Math.min(length * 4, 40);
    if (hasUppercase) score += 10; else issues.push("Missing uppercase");
    if (hasLowercase) score += 10; else issues.push("Missing lowercase");
    if (hasNumbers) score += 10; else issues.push("Missing numbers");
    if (hasSymbols) score += 15; else issues.push("Missing symbols");
    if (length >= 12) score += 10; else issues.push("Too short");
    if (length < 8) { score = Math.min(score, 30); issues.push("Critically short"); }

    if (/(.)\1{2,}/.test(pwd)) { score -= 10; issues.push("Repeated chars"); }
    if (/(?:abc|123|qwe)/i.test(pwd)) { score -= 10; issues.push("Sequential pattern"); }

    const commonPasswords = ["password", "123456", "qwerty", "abc123", "letmein"];
    if (commonPasswords.includes(pwd.toLowerCase())) {
      score = 15;
      issues.push("Common password");
    }

    score = Math.max(0, Math.min(score, 100));

    let strength: string;
    if (score >= 80) strength = "Very Strong";
    else if (score >= 60) strength = "Strong";
    else if (score >= 40) strength = "Moderate";
    else if (score >= 20) strength = "Weak";
    else strength = "Very Weak";

    return {
      password: pwd.substring(0, 4) + "***",
      score,
      strength,
      entropy: Math.round(entropy * 10) / 10,
      issues: issues.slice(0, 3),
    };
  };

  const processBatch = async () => {
    const passwordList = passwords.split("\n").filter((p) => p.trim());

    if (passwordList.length === 0) {
      toast({
        title: "No Passwords",
        description: "Please enter at least one password to analyze",
        variant: "destructive",
      });
      return;
    }

    if (passwordList.length > 1000) {
      toast({
        title: "Too Many Passwords",
        description: "Maximum 1000 passwords per batch",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    const analyzed: BatchResult[] = [];

    // Simulate processing with delay
    for (let i = 0; i < passwordList.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      analyzed.push(analyzePassword(passwordList[i]));
    }

    setResults(analyzed);
    setIsProcessing(false);

    toast({
      title: "Analysis Complete",
      description: `Processed ${analyzed.length} passwords`,
    });
  };

  const exportResults = () => {
    if (results.length === 0) {
      toast({
        title: "No Results",
        description: "Analyze passwords first before exporting",
        variant: "destructive",
      });
      return;
    }

    const csv = [
      "Password,Score,Strength,Entropy,Issues",
      ...results.map((r) => `${r.password},${r.score},${r.strength},${r.entropy},"${r.issues.join("; ")}"`)
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `password-analysis-${Date.now()}.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: "Results exported to CSV file",
    });
  };

  const stats = results.length > 0 ? {
    total: results.length,
    veryStrong: results.filter((r) => r.score >= 80).length,
    strong: results.filter((r) => r.score >= 60 && r.score < 80).length,
    moderate: results.filter((r) => r.score >= 40 && r.score < 60).length,
    weak: results.filter((r) => r.score >= 20 && r.score < 40).length,
    veryWeak: results.filter((r) => r.score < 20).length,
    avgScore: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
    avgEntropy: Math.round((results.reduce((sum, r) => sum + r.entropy, 0) / results.length) * 10) / 10,
  } : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Batch Password Analysis</h2>
        <p className="text-muted-foreground mt-1">
          Analyze up to 1,000 passwords simultaneously and export results
        </p>
      </div>

      <Alert className="border-info bg-info/10">
        <Info className="h-4 w-4 text-info" />
        <AlertDescription className="text-info text-sm">
          Enter one password per line. Passwords are analyzed locally and never sent to any server.
          For security, only the first 4 characters are shown in results.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="p-6 card-glow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Password Input</h3>
              <Upload className="h-5 w-5 text-primary" />
            </div>

            <Textarea
              placeholder="Enter passwords (one per line)&#10;Example:&#10;MyP@ssw0rd123&#10;AnotherP@ss456&#10;SecurePassword!"
              value={passwords}
              onChange={(e) => setPasswords(e.target.value)}
              className="min-h-[300px] font-mono text-sm custom-scrollbar"
            />

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{passwords.split("\n").filter((p) => p.trim()).length} passwords</span>
              <span>Max: 1,000</span>
            </div>

            <div className="flex gap-2">
              <Button onClick={processBatch} disabled={isProcessing} className="flex-1 btn-glow">
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyze Batch
                  </>
                )}
              </Button>
              <Button onClick={exportResults} variant="outline" disabled={results.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics Section */}
        <Card className="p-6 card-glow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Analysis Statistics</h3>
              <CheckCircle className={`h-5 w-5 ${stats ? "text-success" : "text-muted-foreground"}`} />
            </div>

            {stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-2xl font-bold font-mono text-primary">{stats.total}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Analyzed</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/20">
                    <p className="text-2xl font-bold font-mono">{stats.avgScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">Average Score</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      Very Strong
                    </span>
                    <span className="font-mono">{stats.veryStrong}</span>
                  </div>
                  <Progress value={(stats.veryStrong / stats.total) * 100} className="bg-success/20" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Strong
                    </span>
                    <span className="font-mono">{stats.strong}</span>
                  </div>
                  <Progress value={(stats.strong / stats.total) * 100} className="bg-primary/20" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-warning" />
                      Moderate
                    </span>
                    <span className="font-mono">{stats.moderate}</span>
                  </div>
                  <Progress value={(stats.moderate / stats.total) * 100} className="bg-warning/20" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                      Weak
                    </span>
                    <span className="font-mono">{stats.weak}</span>
                  </div>
                  <Progress value={(stats.weak / stats.total) * 100} className="bg-orange-500/20" />

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-destructive" />
                      Very Weak
                    </span>
                    <span className="font-mono">{stats.veryWeak}</span>
                  </div>
                  <Progress value={(stats.veryWeak / stats.total) * 100} className="bg-destructive/20" />
                </div>

                <div className="p-4 rounded-lg bg-secondary/20 border border-border">
                  <p className="text-sm font-medium mb-2">Security Metrics</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Avg Entropy:</span>
                      <span className="ml-2 font-mono font-bold">{stats.avgEntropy} bits</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Security Rate:</span>
                      <span className="ml-2 font-mono font-bold">
                        {Math.round(((stats.veryStrong + stats.strong) / stats.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No analysis results yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Enter passwords and click Analyze</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Results Table */}
      {results.length > 0 && (
        <Card className="p-6 card-glow">
          <h3 className="text-lg font-semibold mb-4">Detailed Results</h3>
          <div className="rounded-lg border border-border custom-scrollbar" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead className="w-[100px]">Password</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Entropy</TableHead>
                  <TableHead>Issues</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-xs">{result.password}</TableCell>
                    <TableCell>
                      <span className="font-mono font-bold">{result.score}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${
                        result.score >= 80 ? "text-success" :
                        result.score >= 60 ? "text-primary" :
                        result.score >= 40 ? "text-warning" :
                        result.score >= 20 ? "text-orange-500" :
                        "text-destructive"
                      }`}>
                        {result.strength}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{result.entropy}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {result.issues.map((issue, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BatchAnalyzer;
