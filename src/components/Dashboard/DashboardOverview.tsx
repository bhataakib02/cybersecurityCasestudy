import { Card } from "@/components/ui/card";
import { Shield, Lock, Users, TrendingUp, AlertTriangle, CheckCircle, Activity, FileText } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboard, type DashboardResponse } from "@/lib/api";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

const DashboardOverview = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Passwords Analyzed",
      value: "12,847",
      change: "+14.2%",
      trend: "up",
      icon: Lock,
      color: "text-primary",
    },
    {
      title: "Security Score",
      value: "87.3%",
      change: "+5.1%",
      trend: "up",
      icon: Shield,
      color: "text-success",
    },
    {
      title: "Active Users",
      value: "2,456",
      change: "+8.7%",
      trend: "up",
      icon: Users,
      color: "text-info",
    },
    {
      title: "Critical Vulnerabilities",
      value: "23",
      change: "-12.5%",
      trend: "down",
      icon: AlertTriangle,
      color: "text-destructive",
    },
  ]);

  const [strengthDistribution, setStrengthDistribution] = useState([
    { name: "Very Strong", value: 2847, color: "hsl(var(--success))" },
    { name: "Strong", value: 4521, color: "hsl(var(--chart-1))" },
    { name: "Moderate", value: 3156, color: "hsl(var(--warning))" },
    { name: "Weak", value: 1423, color: "hsl(var(--chart-3))" },
    { name: "Very Weak", value: 900, color: "hsl(var(--destructive))" },
  ]);

  const [weeklyTrend, setWeeklyTrend] = useState([
    { day: "Mon", analyzed: 1247, strong: 856, weak: 391 },
    { day: "Tue", analyzed: 1456, strong: 1102, weak: 354 },
    { day: "Wed", analyzed: 1389, strong: 1034, weak: 355 },
    { day: "Thu", analyzed: 1623, strong: 1298, weak: 325 },
    { day: "Fri", analyzed: 1834, strong: 1502, weak: 332 },
    { day: "Sat", analyzed: 956, strong: 734, weak: 222 },
    { day: "Sun", analyzed: 1142, strong: 842, weak: 300 },
  ]);

  const [complianceData, setComplianceData] = useState([
    { standard: "NIST", score: 92, color: "hsl(var(--success))" },
    { standard: "PCI DSS", score: 88, color: "hsl(var(--chart-1))" },
    { standard: "ISO 27001", score: 85, color: "hsl(var(--chart-2))" },
    { standard: "HIPAA", score: 90, color: "hsl(var(--chart-3))" },
    { standard: "SOC 2", score: 87, color: "hsl(var(--chart-4))" },
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { action: "Batch analysis completed", count: "1,200 passwords", time: "5 min ago", status: "success" },
    { action: "Weak password detected", count: "User: john.doe@company.com", time: "12 min ago", status: "warning" },
    { action: "Policy update applied", count: "Minimum length: 12", time: "1 hour ago", status: "info" },
    { action: "Breach check completed", count: "0 compromised found", time: "2 hours ago", status: "success" },
    { action: "Compliance scan finished", count: "All standards met", time: "3 hours ago", status: "success" },
  ]);

  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>(new Date().toLocaleTimeString());

  // Real-time WebSocket connection
  const { isConnected, lastUpdate } = useRealtimeDashboard();

  const { data, isLoading, isError, refetch, error, isFetching } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
    refetchInterval: isConnected ? false : 10000, // Disable polling when WebSocket is connected
    staleTime: 3000,
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: (prev) => prev,
  });

  // Use data directly from API instead of local state
  const currentStats = data?.stats || stats;
  const currentStrengthDistribution = data?.strengthDistribution || strengthDistribution;
  const currentWeeklyTrend = data?.weeklyTrend || weeklyTrend;
  const currentComplianceData = data?.complianceData || complianceData;
  const currentRecentActivity = data?.recentActivity || recentActivity;

  // Debug logging
  console.log('Dashboard data:', data);
  console.log('WebSocket connected:', isConnected);
  console.log('Current stats:', currentStats);

  // Update last update time when WebSocket receives updates
  useEffect(() => {
    if (lastUpdate) {
      setLastUpdatedAt(lastUpdate);
    }
  }, [lastUpdate]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground mt-1">Comprehensive password security analytics and monitoring</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${isConnected ? 'animate-pulse text-success' : 'text-warning'}`} />
            <span>
              {isLoading ? "Loading…" : isError ? `Degraded${error instanceof Error ? `: ${error.message}` : ""}` : isFetching ? "Updating…" : isConnected ? "Live" : "Polling"}
              {" "}• {isConnected ? "Real-time" : "Auto-refresh 10s"} • Updated {lastUpdatedAt}
            </span>
          </div>
          <button 
            onClick={() => refetch()} 
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {currentStats.map((stat, index) => (
          <Card key={index} className="p-6 card-glow animate-fade-in-up transition-all duration-500 hover:scale-105" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-${stat.color.split('-')[1]}/10 transition-colors duration-300`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold font-mono mt-1 transition-all duration-500 ease-in-out">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className={`text-xs font-medium transition-colors duration-300 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                <span className="inline-flex items-center gap-1">
                  {stat.trend === 'up' ? '↗' : '↘'}
                  {stat.change}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strength Distribution */}
        <Card className="p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Password Strength Distribution</h3>
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={currentStrengthDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {currentStrengthDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly Trend */}
        <Card className="p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Weekly Analysis Trend</h3>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentWeeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="strong" fill="hsl(var(--success))" name="Strong" />
              <Bar dataKey="weak" fill="hsl(var(--destructive))" name="Weak" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Compliance and Activity Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Compliance Scores */}
        <Card className="p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Compliance Standards</h3>
            <CheckCircle className="h-5 w-5 text-success" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentComplianceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="standard" type="category" stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 card-glow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <FileText className="h-5 w-5 text-info" />
          </div>
          <div className="space-y-4 custom-scrollbar" style={{ maxHeight: "300px", overflowY: "auto" }}>
            {currentRecentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  activity.status === "success" ? "bg-success animate-pulse-glow" :
                  activity.status === "warning" ? "bg-warning animate-pulse-glow" :
                  "bg-info"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground font-mono">{activity.count}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
