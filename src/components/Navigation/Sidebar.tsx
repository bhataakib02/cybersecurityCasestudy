import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Lock, 
  Users, 
  Shield, 
  FileText, 
  Settings, 
  TrendingUp,
  ShieldAlert,
  Wrench,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analyzer", label: "Password Analyzer", icon: Lock },
    { id: "batch", label: "Batch Analysis", icon: Users },
    { id: "generator", label: "Password Generator", icon: Shield },
    { id: "breach", label: "Breach Checker", icon: ShieldAlert },
    { id: "policy", label: "Policy Recommendations", icon: FileText },
    { id: "builder", label: "Policy Builder", icon: Wrench },
    { id: "compliance", label: "Compliance Checker", icon: TrendingUp },
    { id: "audit", label: "Audit Reports", icon: Activity },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold">SecurePass</h1>
            <p className="text-xs text-muted-foreground">Enterprise Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 custom-scrollbar overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                activeTab === item.id && "bg-primary/10 text-primary hover:bg-primary/20"
              )}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" onClick={() => onTabChange("settings")}>
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
