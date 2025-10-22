export type DashboardStatsItem = {
  title: string;
  value: string; // already formatted, e.g., "12,847" or "87.3%"
  change: string; // e.g., "+5.1%"
  trend: "up" | "down";
  icon?: string; // optional identifier if backend provides
  color?: string; // optional tailwind token class
};

export type StrengthDistributionItem = { name: string; value: number; color?: string };
export type WeeklyTrendItem = { day: string; analyzed: number; strong: number; weak: number };
export type ComplianceItem = { standard: string; score: number; color?: string };
export type ActivityItem = { action: string; count: string; time: string; status: "success" | "warning" | "info" };

export type DashboardResponse = {
  stats: DashboardStatsItem[];
  strengthDistribution: StrengthDistributionItem[];
  weeklyTrend: WeeklyTrendItem[];
  complianceData: ComplianceItem[];
  recentActivity: ActivityItem[];
  systemStatus?: string;
};

const DEFAULT_TIMEOUT_MS = 8000;

function getApiBase(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!base) {
    throw new Error("VITE_API_BASE_URL is not set");
  }
  return base.replace(/\/$/, "");
}

function normalizeDashboardResponse(raw: unknown): DashboardResponse {
  const obj = (raw ?? {}) as Record<string, any>;

  const stats = (obj.stats || obj.data?.stats || obj.metrics || []) as DashboardStatsItem[];
  const strengthDistribution = (obj.strengthDistribution || obj.passwordStrength || obj.strength || []) as StrengthDistributionItem[];
  const weeklyTrend = (obj.weeklyTrend || obj.trend || obj.activityTrend || []) as WeeklyTrendItem[];
  const complianceData = (obj.complianceData || obj.compliance || obj.standards || []) as ComplianceItem[];
  const recentActivity = (obj.recentActivity || obj.activity || obj.events || []) as ActivityItem[];
  const systemStatus = (obj.systemStatus || obj.status || undefined) as string | undefined;

  return { stats, strengthDistribution, weeklyTrend, complianceData, recentActivity, systemStatus };
}

export async function fetchDashboard(signal?: AbortSignal, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<DashboardResponse> {
  const base = getApiBase();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}/dashboard`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: ((): AbortSignal => {
        if (signal) {
          const anyController = controller as unknown as { abort: () => void };
          signal.addEventListener("abort", () => anyController.abort());
        }
        return controller.signal;
      })(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch dashboard: ${res.status}`);
    }
    const json = await res.json();
    return normalizeDashboardResponse(json);
  } finally {
    clearTimeout(timeout);
  }
}


