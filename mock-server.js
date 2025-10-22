import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 4000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// In-memory data store that simulates real password analysis
let dashboardData = {
  stats: [
    {
      title: "Total Passwords Analyzed",
      value: "12,847",
      change: "+14.2%",
      trend: "up",
      icon: "Lock",
      color: "text-primary"
    },
    {
      title: "Security Score",
      value: "87.3%",
      change: "+5.1%",
      trend: "up",
      icon: "Shield",
      color: "text-success"
    },
    {
      title: "Active Users",
      value: "2,456",
      change: "+8.7%",
      trend: "up",
      icon: "Users",
      color: "text-info"
    },
    {
      title: "Critical Vulnerabilities",
      value: "23",
      change: "-12.5%",
      trend: "down",
      icon: "AlertTriangle",
      color: "text-destructive"
    }
  ],
  strengthDistribution: [
    { name: "Very Strong", value: 2847, color: "hsl(var(--success))" },
    { name: "Strong", value: 4521, color: "hsl(var(--chart-1))" },
    { name: "Moderate", value: 3156, color: "hsl(var(--warning))" },
    { name: "Weak", value: 1423, color: "hsl(var(--chart-3))" },
    { name: "Very Weak", value: 900, color: "hsl(var(--destructive))" }
  ],
  weeklyTrend: [
    { day: "Mon", analyzed: 1247, strong: 856, weak: 391 },
    { day: "Tue", analyzed: 1456, strong: 1102, weak: 354 },
    { day: "Wed", analyzed: 1389, strong: 1034, weak: 355 },
    { day: "Thu", analyzed: 1623, strong: 1298, weak: 325 },
    { day: "Fri", analyzed: 1834, strong: 1502, weak: 332 },
    { day: "Sat", analyzed: 956, strong: 734, weak: 222 },
    { day: "Sun", analyzed: 1142, strong: 842, weak: 300 }
  ],
  complianceData: [
    { standard: "NIST", score: 92, color: "hsl(var(--success))" },
    { standard: "PCI DSS", score: 88, color: "hsl(var(--chart-1))" },
    { standard: "ISO 27001", score: 85, color: "hsl(var(--chart-2))" },
    { standard: "HIPAA", score: 90, color: "hsl(var(--chart-3))" },
    { standard: "SOC 2", score: 87, color: "hsl(var(--chart-4))" }
  ],
  recentActivity: [
    { action: "Batch analysis completed", count: "1,200 passwords", time: "5 min ago", status: "success" },
    { action: "Weak password detected", count: "User: john.doe@company.com", time: "12 min ago", status: "warning" },
    { action: "Policy update applied", count: "Minimum length: 12", time: "1 hour ago", status: "info" },
    { action: "Breach check completed", count: "0 compromised found", time: "2 hours ago", status: "success" },
    { action: "Compliance scan finished", count: "All standards met", time: "3 hours ago", status: "success" }
  ],
  systemStatus: "Operational"
};

// Helper functions for realistic data updates
function formatNumber(num) {
  return num.toLocaleString();
}

function getRandomChange() {
  const change = (Math.random() * 3 - 1).toFixed(1);
  return change >= 0 ? `+${change}%` : `${change}%`;
}

function updateStats() {
  // Simulate password analysis activity
  const totalAnalyzed = parseInt(dashboardData.stats[0].value.replace(/,/g, ''));
  const newAnalyzed = totalAnalyzed + Math.floor(Math.random() * 50 + 10);
  
  const securityScore = parseFloat(dashboardData.stats[1].value);
  const newScore = Math.max(70, Math.min(99, securityScore + (Math.random() * 2 - 1)));
  
  const activeUsers = parseInt(dashboardData.stats[2].value.replace(/,/g, ''));
  const newUsers = activeUsers + Math.floor(Math.random() * 5);
  
  const vulnerabilities = parseInt(dashboardData.stats[3].value);
  const newVulns = Math.max(0, vulnerabilities + Math.floor(Math.random() * 3 - 1));
  
  dashboardData.stats = [
    {
      ...dashboardData.stats[0],
      value: formatNumber(newAnalyzed),
      change: getRandomChange(),
      trend: "up"
    },
    {
      ...dashboardData.stats[1],
      value: `${newScore.toFixed(1)}%`,
      change: getRandomChange(),
      trend: newScore >= securityScore ? "up" : "down"
    },
    {
      ...dashboardData.stats[2],
      value: formatNumber(newUsers),
      change: getRandomChange(),
      trend: "up"
    },
    {
      ...dashboardData.stats[3],
      value: `${newVulns}`,
      change: getRandomChange(),
      trend: newVulns <= vulnerabilities ? "down" : "up"
    }
  ];
}

function updateStrengthDistribution() {
  dashboardData.strengthDistribution = dashboardData.strengthDistribution.map(item => ({
    ...item,
    value: Math.max(0, item.value + Math.floor(Math.random() * 20 - 10))
  }));
}

function updateWeeklyTrend() {
  // Shift data and add new day
  dashboardData.weeklyTrend.shift();
  const lastDay = dashboardData.weeklyTrend[dashboardData.weeklyTrend.length - 1];
  const strong = Math.max(200, lastDay.strong + Math.floor(Math.random() * 100 - 50));
  const weak = Math.max(50, lastDay.weak + Math.floor(Math.random() * 50 - 25));
  const analyzed = strong + weak + Math.floor(Math.random() * 100);
  
  const now = new Date();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayName = dayNames[now.getDay()];
  
  dashboardData.weeklyTrend.push({
    day: dayName,
    analyzed,
    strong,
    weak
  });
}

function updateComplianceData() {
  dashboardData.complianceData = dashboardData.complianceData.map(item => ({
    ...item,
    score: Math.max(70, Math.min(99, item.score + Math.floor(Math.random() * 4 - 2)))
  }));
}

function updateRecentActivity() {
  const activities = [
    { action: "Password analysis completed", count: `${Math.floor(100 + Math.random() * 500)} passwords`, status: "success" },
    { action: "Weak password detected", count: `User: user${Math.floor(Math.random() * 1000)}@company.com`, status: "warning" },
    { action: "Policy update applied", count: `Minimum length: ${10 + Math.floor(Math.random() * 6)}`, status: "info" },
    { action: "Breach check completed", count: `${Math.random() < 0.9 ? "0 compromised found" : `${1 + Math.floor(Math.random() * 3)} compromised found`}`, status: "success" },
    { action: "Compliance scan finished", count: "All standards met", status: "success" }
  ];
  
  const newActivity = activities[Math.floor(Math.random() * activities.length)];
  dashboardData.recentActivity.unshift({
    ...newActivity,
    time: "just now"
  });
  
  // Keep only last 10 activities
  dashboardData.recentActivity = dashboardData.recentActivity.slice(0, 10);
}

// Simulate password analysis when endpoint is called
function simulatePasswordAnalysis() {
  updateStats();
  updateStrengthDistribution();
  updateWeeklyTrend();
  updateComplianceData();
  updateRecentActivity();
  
  // Broadcast real-time updates to all connected clients
  io.emit('dashboard-update', {
    type: 'full-update',
    data: dashboardData,
    timestamp: new Date().toISOString()
  });
}

// Simulate real-time micro-updates
function simulateMicroUpdates() {
  // Randomly update individual stats
  if (Math.random() < 0.3) {
    const statIndex = Math.floor(Math.random() * dashboardData.stats.length);
    const stat = dashboardData.stats[statIndex];
    
    if (statIndex === 0) { // Total Passwords Analyzed
      const current = parseInt(stat.value.replace(/,/g, ''));
      const increment = Math.floor(Math.random() * 5 + 1);
      stat.value = formatNumber(current + increment);
      stat.change = `+${(Math.random() * 2 + 0.5).toFixed(1)}%`;
    } else if (statIndex === 1) { // Security Score
      const current = parseFloat(stat.value);
      const change = (Math.random() * 2 - 1);
      const newScore = Math.max(70, Math.min(99, current + change));
      stat.value = `${newScore.toFixed(1)}%`;
      stat.change = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
      stat.trend = change >= 0 ? 'up' : 'down';
    } else if (statIndex === 2) { // Active Users
      const current = parseInt(stat.value.replace(/,/g, ''));
      const change = Math.floor(Math.random() * 3 - 1);
      stat.value = formatNumber(Math.max(0, current + change));
      stat.change = `+${(Math.random() * 1.5).toFixed(1)}%`;
    } else if (statIndex === 3) { // Critical Vulnerabilities
      const current = parseInt(stat.value);
      const change = Math.floor(Math.random() * 3 - 1);
      const newVulns = Math.max(0, current + change);
      stat.value = `${newVulns}`;
      stat.change = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
      stat.trend = change <= 0 ? 'down' : 'up';
    }
    
    // Send micro-update
    io.emit('dashboard-update', {
      type: 'stats-update',
      data: { stats: dashboardData.stats },
      timestamp: new Date().toISOString()
    });
  }
  
  // Randomly update activity feed
  if (Math.random() < 0.2) {
    const activities = [
      { action: "Password analysis completed", count: `${Math.floor(10 + Math.random() * 50)} passwords`, status: "success" },
      { action: "Weak password detected", count: `User: user${Math.floor(Math.random() * 1000)}@company.com`, status: "warning" },
      { action: "Policy update applied", count: `Minimum length: ${10 + Math.floor(Math.random() * 6)}`, status: "info" },
      { action: "Breach check completed", count: `${Math.random() < 0.9 ? "0 compromised found" : `${1 + Math.floor(Math.random() * 3)} compromised found`}`, status: "success" },
      { action: "Compliance scan finished", count: "All standards met", status: "success" }
    ];
    
    const newActivity = activities[Math.floor(Math.random() * activities.length)];
    dashboardData.recentActivity.unshift({
      ...newActivity,
      time: "just now"
    });
    
    // Keep only last 10 activities
    dashboardData.recentActivity = dashboardData.recentActivity.slice(0, 10);
    
    // Send activity update
    io.emit('dashboard-update', {
      type: 'activity-update',
      data: { recentActivity: dashboardData.recentActivity },
      timestamp: new Date().toISOString()
    });
  }
}

// API Routes
app.get('/dashboard', (req, res) => {
  // Simulate some activity on each request
  if (Math.random() < 0.3) { // 30% chance to update data
    simulatePasswordAnalysis();
  }
  
  res.json(dashboardData);
});

// Simulate password analysis endpoint
app.post('/analyze-password', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  // Simulate analysis and update dashboard data
  simulatePasswordAnalysis();
  
  // Return analysis result
  const strength = password.length >= 12 ? 'strong' : password.length >= 8 ? 'moderate' : 'weak';
  const score = Math.floor(Math.random() * 40 + 60); // 60-100
  
  res.json({
    strength,
    score,
    feedback: `Password analyzed: ${strength} (${score}/100)`,
    timestamp: new Date().toISOString()
  });
});

// Batch analysis endpoint
app.post('/batch-analyze', (req, res) => {
  const { passwords } = req.body;
  
  if (!passwords || !Array.isArray(passwords)) {
    return res.status(400).json({ error: 'Passwords array is required' });
  }
  
  // Simulate batch analysis and update dashboard
  for (let i = 0; i < passwords.length; i++) {
    simulatePasswordAnalysis();
  }
  
  res.json({
    analyzed: passwords.length,
    message: `Batch analysis completed for ${passwords.length} passwords`,
    timestamp: new Date().toISOString()
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send initial data to new client
  socket.emit('dashboard-update', {
    type: 'full-update',
    data: dashboardData,
    timestamp: new Date().toISOString()
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Auto-update data every 10 seconds (full updates)
setInterval(() => {
  simulatePasswordAnalysis();
  console.log(`Dashboard updated at ${new Date().toLocaleTimeString()}`);
}, 10000);

// Micro-updates every 2-3 seconds for real-time feel
setInterval(() => {
  simulateMicroUpdates();
}, 2000 + Math.random() * 1000);

server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /dashboard - Get dashboard data');
  console.log('  POST /analyze-password - Analyze single password');
  console.log('  POST /batch-analyze - Analyze multiple passwords');
  console.log('  WS   / - Real-time dashboard updates');
});
