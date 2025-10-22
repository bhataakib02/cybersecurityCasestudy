import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, CheckCircle, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PasswordGenerator = () => {
  const [settings, setSettings] = useState({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
  });

  const [passwords, setPasswords] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(5);

  const generatePassword = (): string => {
    let charset = "";
    
    if (settings.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (settings.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (settings.numbers) charset += "0123456789";
    if (settings.symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (settings.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    if (settings.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()/\\'"~,;:.<>]/g, "");
    }

    if (charset.length === 0) {
      toast({
        title: "Invalid Settings",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return "";
    }

    const array = new Uint8Array(settings.length);
    crypto.getRandomValues(array);
    
    let password = "";
    for (let i = 0; i < settings.length; i++) {
      password += charset[array[i] % charset.length];
    }

    // Ensure password meets criteria
    if (settings.uppercase && !/[A-Z]/.test(password)) {
      const pos = Math.floor(Math.random() * password.length);
      password = password.substring(0, pos) + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)] + password.substring(pos + 1);
    }
    if (settings.lowercase && !/[a-z]/.test(password)) {
      const pos = Math.floor(Math.random() * password.length);
      password = password.substring(0, pos) + "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)] + password.substring(pos + 1);
    }
    if (settings.numbers && !/[0-9]/.test(password)) {
      const pos = Math.floor(Math.random() * password.length);
      password = password.substring(0, pos) + Math.floor(Math.random() * 10) + password.substring(pos + 1);
    }
    if (settings.symbols && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
      const pos = Math.floor(Math.random() * password.length);
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      password = password.substring(0, pos) + symbols[Math.floor(Math.random() * symbols.length)] + password.substring(pos + 1);
    }

    return password;
  };

  const generatePasswords = () => {
    const newPasswords = [];
    for (let i = 0; i < quantity; i++) {
      const pwd = generatePassword();
      if (pwd) newPasswords.push(pwd);
    }
    setPasswords(newPasswords);

    if (newPasswords.length > 0) {
      toast({
        title: "Passwords Generated",
        description: `Created ${newPasswords.length} secure password(s)`,
      });
    }
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    });
  };

  const copyAllPasswords = () => {
    navigator.clipboard.writeText(passwords.join("\n"));
    toast({
      title: "All Copied!",
      description: `${passwords.length} passwords copied to clipboard`,
    });
  };

  const calculateEntropy = () => {
    let charsetSize = 0;
    if (settings.lowercase) charsetSize += 26;
    if (settings.uppercase) charsetSize += 26;
    if (settings.numbers) charsetSize += 10;
    if (settings.symbols) charsetSize += 32;
    
    if (settings.excludeSimilar) charsetSize -= 6;
    
    return Math.round(settings.length * Math.log2(charsetSize || 1) * 10) / 10;
  };

  const entropy = calculateEntropy();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">Password Generator</h2>
        <p className="text-muted-foreground mt-1">
          Generate cryptographically secure passwords with custom requirements
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Settings Panel */}
        <Card className="p-6 card-glow">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Password Length: {settings.length}</Label>
                <span className="text-sm text-muted-foreground font-mono">{entropy} bits entropy</span>
              </div>
              <Slider
                value={[settings.length]}
                onValueChange={([value]) => setSettings({ ...settings, length: value })}
                min={8}
                max={64}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Uppercase Letters (A-Z)</Label>
                <Switch
                  id="uppercase"
                  checked={settings.uppercase}
                  onCheckedChange={(checked) => setSettings({ ...settings, uppercase: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Lowercase Letters (a-z)</Label>
                <Switch
                  id="lowercase"
                  checked={settings.lowercase}
                  onCheckedChange={(checked) => setSettings({ ...settings, lowercase: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Numbers (0-9)</Label>
                <Switch
                  id="numbers"
                  checked={settings.numbers}
                  onCheckedChange={(checked) => setSettings({ ...settings, numbers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Special Characters (!@#$%)</Label>
                <Switch
                  id="symbols"
                  checked={settings.symbols}
                  onCheckedChange={(checked) => setSettings({ ...settings, symbols: checked })}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label htmlFor="similar">Exclude Similar (i, l, 1, L, o, 0, O)</Label>
                  <Switch
                    id="similar"
                    checked={settings.excludeSimilar}
                    onCheckedChange={(checked) => setSettings({ ...settings, excludeSimilar: checked })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="ambiguous">Exclude Ambiguous ({`{}, [], (), /\\, etc.`})</Label>
                <Switch
                  id="ambiguous"
                  checked={settings.excludeAmbiguous}
                  onCheckedChange={(checked) => setSettings({ ...settings, excludeAmbiguous: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Number of Passwords to Generate</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={50}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="font-mono"
              />
            </div>

            <Button onClick={generatePasswords} className="w-full btn-glow">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Passwords
            </Button>
          </div>
        </Card>

        {/* Results Panel */}
        <Card className="p-6 card-glow">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Passwords</h3>
              {passwords.length > 0 && (
                <Button variant="outline" size="sm" onClick={copyAllPasswords}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              )}
            </div>

            {passwords.length > 0 ? (
              <div className="space-y-2 custom-scrollbar" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {passwords.map((password, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors group"
                  >
                    <span className="flex-1 font-mono text-sm break-all">{password}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyPassword(password)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Shield className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No passwords generated yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Configure settings and click Generate</p>
              </div>
            )}

            {passwords.length > 0 && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Cryptographically Secure</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Generated using Web Crypto API with {entropy} bits of entropy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Security Information */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 card-hover">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Crypto API
          </h4>
          <p className="text-xs text-muted-foreground">
            Uses browser's cryptographically secure random number generator (CSPRNG) for true randomness
          </p>
        </Card>
        <Card className="p-4 card-hover">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            No Storage
          </h4>
          <p className="text-xs text-muted-foreground">
            Generated passwords are never saved or transmitted. They exist only in your browser memory
          </p>
        </Card>
        <Card className="p-4 card-hover">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-info" />
            Best Practices
          </h4>
          <p className="text-xs text-muted-foreground">
            16+ character passwords with all character types provide optimal security for most use cases
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PasswordGenerator;
