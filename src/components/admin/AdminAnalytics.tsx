import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, TrendingUp, Eye, ShoppingCart, RefreshCw, 
  Calendar, Users, Package, DollarSign, ArrowUpRight, 
  ArrowDownRight, Clock, Globe, Smartphone, Monitor,
  Filter, Download, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig 
} from "@/components/ui/chart";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import VisitorMap from "./VisitorMap";
import type { Database } from "@/integrations/supabase/types";

type Analytics = Database["public"]["Tables"]["site_analytics"]["Row"];
type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderStatus = Database["public"]["Enums"]["order_status"];

interface Stats {
  totalVisits: number;
  todayVisits: number;
  yesterdayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalOrders: number;
  todayOrders: number;
  yesterdayOrders: number;
  weekOrders: number;
  monthOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  topPages: { path: string; count: number }[];
  recentReferrers: { referrer: string; count: number }[];
  ordersByStatus: { status: string; count: number }[];
  uniqueVisitors: number;
  avgSessionDuration: number;
  conversionRate: number;
  dailyData: { date: string; visits: number; orders: number; revenue: number }[];
  hourlyData: { hour: string; visits: number }[];
  deviceData: { device: string; count: number }[];
  browserData: { browser: string; count: number }[];
}

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const chartConfig = {
  visits: {
    label: "Перегляди",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Замовлення",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Дохід",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const AdminAnalytics = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [mapboxToken, setMapboxToken] = useState<string>("");

  useEffect(() => {
    // Get Mapbox token from localStorage or environment
    const savedToken = localStorage.getItem("mapbox_token");
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);
    const rangeStart = new Date(today);
    
    switch (dateRange) {
      case "7d":
        rangeStart.setDate(rangeStart.getDate() - 7);
        break;
      case "30d":
        rangeStart.setDate(rangeStart.getDate() - 30);
        break;
      case "90d":
        rangeStart.setDate(rangeStart.getDate() - 90);
        break;
      default:
        rangeStart.setFullYear(2020);
    }
    
    return { today, yesterday, weekAgo, monthAgo, rangeStart };
  };

  const parseUserAgent = (ua: string) => {
    let device = "Комп'ютер";
    let browser = "Інший";
    
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
      device = /iPad/i.test(ua) ? "Планшет" : "Мобільний";
    }
    
    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = "Chrome";
    else if (/Firefox/i.test(ua)) browser = "Firefox";
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
    else if (/Edge/i.test(ua)) browser = "Edge";
    else if (/Opera|OPR/i.test(ua)) browser = "Opera";
    
    return { device, browser };
  };

  const fetchStats = async () => {
    setLoading(true);
    const { today, yesterday, weekAgo, monthAgo, rangeStart } = getDateRange();

    const [analyticsRes, ordersRes] = await Promise.all([
      supabase.from("site_analytics").select("*").gte("created_at", rangeStart.toISOString()),
      supabase.from("orders").select("*"),
    ]);

    const analytics = analyticsRes.data || [];
    const orders = ordersRes.data || [];

    // Filter data by periods
    const todayAnalytics = analytics.filter(a => new Date(a.created_at) >= today);
    const yesterdayAnalytics = analytics.filter(a => {
      const d = new Date(a.created_at);
      return d >= yesterday && d < today;
    });
    const weekAnalytics = analytics.filter(a => new Date(a.created_at) >= weekAgo);
    const monthAnalytics = analytics.filter(a => new Date(a.created_at) >= monthAgo);

    const todayOrders = orders.filter(o => new Date(o.created_at) >= today);
    const yesterdayOrders = orders.filter(o => {
      const d = new Date(o.created_at);
      return d >= yesterday && d < today;
    });
    const weekOrdersData = orders.filter(o => new Date(o.created_at) >= weekAgo);
    const monthOrdersData = orders.filter(o => new Date(o.created_at) >= monthAgo);

    // Calculate top pages
    const pageCounts: Record<string, number> = {};
    analytics.forEach((a) => {
      pageCounts[a.page_path] = (pageCounts[a.page_path] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate referrers
    const refCounts: Record<string, number> = {};
    analytics.forEach((a) => {
      if (a.referrer) {
        try {
          const ref = new URL(a.referrer).hostname || a.referrer;
          refCounts[ref] = (refCounts[ref] || 0) + 1;
        } catch {
          refCounts[a.referrer] = (refCounts[a.referrer] || 0) + 1;
        }
      }
    });
    const recentReferrers = Object.entries(refCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Orders by status
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });
    const ordersByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }));

    // Unique visitors (by session_id)
    const uniqueSessions = new Set(analytics.map(a => a.session_id));

    // Daily data for charts
    const dailyMap: Record<string, { visits: number; orders: number; revenue: number }> = {};
    analytics.forEach(a => {
      const date = new Date(a.created_at).toLocaleDateString('uk-UA');
      if (!dailyMap[date]) dailyMap[date] = { visits: 0, orders: 0, revenue: 0 };
      dailyMap[date].visits++;
    });
    orders.forEach(o => {
      const date = new Date(o.created_at).toLocaleDateString('uk-UA');
      if (!dailyMap[date]) dailyMap[date] = { visits: 0, orders: 0, revenue: 0 };
      dailyMap[date].orders++;
      dailyMap[date].revenue += Number(o.total_price) || 0;
    });
    const dailyData = Object.entries(dailyMap)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('.').map(Number);
        const [dayB, monthB, yearB] = b.date.split('.').map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      })
      .slice(-30);

    // Hourly data
    const hourlyMap: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyMap[`${i.toString().padStart(2, '0')}:00`] = 0;
    }
    todayAnalytics.forEach(a => {
      const hour = new Date(a.created_at).getHours();
      const key = `${hour.toString().padStart(2, '0')}:00`;
      hourlyMap[key]++;
    });
    const hourlyData = Object.entries(hourlyMap)
      .map(([hour, visits]) => ({ hour, visits }));

    // Device and browser data
    const deviceMap: Record<string, number> = {};
    const browserMap: Record<string, number> = {};
    analytics.forEach(a => {
      if (a.user_agent) {
        const { device, browser } = parseUserAgent(a.user_agent);
        deviceMap[device] = (deviceMap[device] || 0) + 1;
        browserMap[browser] = (browserMap[browser] || 0) + 1;
      }
    });
    const deviceData = Object.entries(deviceMap).map(([device, count]) => ({ device, count }));
    const browserData = Object.entries(browserMap).map(([browser, count]) => ({ browser, count }));

    // Conversion rate
    const conversionRate = analytics.length > 0 
      ? (orders.length / uniqueSessions.size) * 100 
      : 0;

    setStats({
      totalVisits: analytics.length,
      todayVisits: todayAnalytics.length,
      yesterdayVisits: yesterdayAnalytics.length,
      weekVisits: weekAnalytics.length,
      monthVisits: monthAnalytics.length,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      yesterdayOrders: yesterdayOrders.length,
      weekOrders: weekOrdersData.length,
      monthOrders: monthOrdersData.length,
      totalRevenue: orders.reduce((sum, o) => sum + Number(o.total_price), 0),
      todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total_price), 0),
      yesterdayRevenue: yesterdayOrders.reduce((sum, o) => sum + Number(o.total_price), 0),
      weekRevenue: weekOrdersData.reduce((sum, o) => sum + Number(o.total_price), 0),
      monthRevenue: monthOrdersData.reduce((sum, o) => sum + Number(o.total_price), 0),
      topPages,
      recentReferrers,
      ordersByStatus,
      uniqueVisitors: uniqueSessions.size,
      avgSessionDuration: 0,
      conversionRate,
      dailyData,
      hourlyData,
      deviceData,
      browserData,
    });
    setLoading(false);
  };

  const getPageName = (path: string) => {
    const pages: Record<string, string> = {
      "/": "Головна",
      "/checkout": "Оформлення",
      "/configurator": "Конфігуратор",
      "/search": "Пошук",
      "/admin": "Адмін",
      "/admin/login": "Вхід адмін",
      "/instructions": "Інструкції",
    };
    if (path.startsWith("/product/")) return `Товар ${path.split("/")[2]}`;
    if (path.startsWith("/instructions-")) return "Інструкція";
    return pages[path] || path;
  };

  const getStatusName = (status: string) => {
    const statuses: Record<string, string> = {
      pending: "Очікує",
      processing: "Обробляється",
      shipped: "Відправлено",
      delivered: "Доставлено",
      cancelled: "Скасовано",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const getPercentChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const exportToCSV = () => {
    if (!stats) return;
    
    const csvContent = [
      ["Метрика", "Значення"],
      ["Всього переглядів", stats.totalVisits],
      ["Унікальних відвідувачів", stats.uniqueVisitors],
      ["Всього замовлень", stats.totalOrders],
      ["Загальний дохід", stats.totalRevenue],
      ["Конверсія", `${stats.conversionRate.toFixed(2)}%`],
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const visitChange = getPercentChange(stats.todayVisits, stats.yesterdayVisits);
  const orderChange = getPercentChange(stats.todayOrders, stats.yesterdayOrders);
  const revenueChange = getPercentChange(stats.todayRevenue, stats.yesterdayRevenue);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-white">Розширена аналітика</h2>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v: "7d" | "30d" | "90d" | "all") => setDateRange(v)}>
            <SelectTrigger className="w-32 bg-[#0a1628] border-cyan-500/20 text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a1628] border-cyan-500/20">
              <SelectItem value="7d">7 днів</SelectItem>
              <SelectItem value="30d">30 днів</SelectItem>
              <SelectItem value="90d">90 днів</SelectItem>
              <SelectItem value="all">Весь час</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportToCSV}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchStats}
            className="text-cyan-400 hover:text-cyan-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Оновити
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#0a1628]/80 border border-cyan-500/20 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
          >
            Огляд
          </TabsTrigger>
          <TabsTrigger
            value="traffic"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
          >
            Трафік
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
          >
            Замовлення
          </TabsTrigger>
          <TabsTrigger
            value="devices"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
          >
            Пристрої
          </TabsTrigger>
          <TabsTrigger
            value="geography"
            className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black text-slate-300"
          >
            <MapPin className="w-4 h-4 mr-1" />
            Географія
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Main Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className={`flex items-center text-xs ${visitChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {visitChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(visitChange).toFixed(1)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{stats.totalVisits.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Перегляди</p>
                <p className="text-xs text-slate-500 mt-1">Сьогодні: {stats.todayVisits}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{stats.uniqueVisitors.toLocaleString()}</p>
                <p className="text-xs text-slate-400">Унікальні відвідувачі</p>
                <p className="text-xs text-slate-500 mt-1">Сесій всього</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <ShoppingCart className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className={`flex items-center text-xs ${orderChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {orderChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(orderChange).toFixed(1)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{stats.totalOrders}</p>
                <p className="text-xs text-slate-400">Замовлення</p>
                <p className="text-xs text-slate-500 mt-1">Сьогодні: {stats.todayOrders}</p>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div className={`flex items-center text-xs ${revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {revenueChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(revenueChange).toFixed(1)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mt-2">{stats.totalRevenue.toLocaleString()} ₴</p>
                <p className="text-xs text-slate-400">Дохід</p>
                <p className="text-xs text-slate-500 mt-1">Сьогодні: {stats.todayRevenue.toLocaleString()} ₴</p>
              </CardContent>
            </Card>
          </div>

          {/* Conversion & Period Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">Конверсія</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{stats.conversionRate.toFixed(2)}%</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">За тиждень</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{stats.weekVisits} переглядів</p>
                <p className="text-xs text-slate-500">{stats.weekOrders} замовлень</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">За місяць</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{stats.monthVisits} переглядів</p>
                <p className="text-xs text-slate-500">{stats.monthOrders} замовлень</p>
              </CardContent>
            </Card>
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-400">Дохід за місяць</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{stats.monthRevenue.toLocaleString()} ₴</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart */}
          <Card className="bg-[#0a1628]/60 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Динаміка за період
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={stats.dailyData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="visits" stroke="#06b6d4" fillOpacity={1} fill="url(#colorVisits)" name="Перегляди" />
                  <Area type="monotone" dataKey="orders" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorOrders)" name="Замовлення" />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Top Pages */}
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Популярні сторінки
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.topPages.length === 0 ? (
                  <p className="text-slate-400 text-sm">Немає даних</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topPages.map((page, idx) => {
                      const maxCount = stats.topPages[0]?.count || 1;
                      const width = (page.count / maxCount) * 100;
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-300 text-sm truncate max-w-[200px]">{getPageName(page.path)}</span>
                            <span className="text-cyan-400 text-sm font-mono">{page.count}</span>
                          </div>
                          <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                            <div 
                              className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500" 
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referrers */}
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Джерела трафіку
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentReferrers.length === 0 ? (
                  <p className="text-slate-400 text-sm">Немає даних</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentReferrers.map((ref, idx) => {
                      const maxCount = stats.recentReferrers[0]?.count || 1;
                      const width = (ref.count / maxCount) * 100;
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-slate-300 text-sm truncate max-w-[200px]">{ref.referrer}</span>
                            <span className="text-purple-400 text-sm font-mono">{ref.count}</span>
                          </div>
                          <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                            <div 
                              className="bg-purple-500 h-1.5 rounded-full transition-all duration-500" 
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hourly Traffic */}
          <Card className="bg-[#0a1628]/60 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Відвідування по годинах (сьогодні)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={stats.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visits" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Перегляди" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Orders by Status Pie Chart */}
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  Замовлення по статусах
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.ordersByStatus.length === 0 ? (
                  <p className="text-slate-400 text-sm">Немає замовлень</p>
                ) : (
                  <div className="flex items-center justify-center">
                    <ChartContainer config={chartConfig} className="h-[250px] w-full max-w-[300px]">
                      <PieChart>
                        <Pie
                          data={stats.ordersByStatus}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ status, count }) => `${getStatusName(status)}: ${count}`}
                          labelLine={false}
                        >
                          {stats.ordersByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders Stats */}
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-cyan-400" />
                  Статистика замовлень
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.ordersByStatus.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getStatusColor(item.status) }}
                        />
                        <span className="text-slate-300 text-sm">{getStatusName(item.status)}</span>
                      </div>
                      <span className="text-white font-mono">{item.count}</span>
                    </div>
                  ))}
                  <div className="border-t border-cyan-500/20 pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Середній чек</span>
                      <span className="text-white font-mono">
                        {stats.totalOrders > 0 
                          ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() 
                          : 0} ₴
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card className="bg-[#0a1628]/60 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-cyan-400" />
                Дохід по днях
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <LineChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                    name="Дохід (₴)"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Devices Chart */}
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  Пристрої
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.deviceData.length === 0 ? (
                  <p className="text-slate-400 text-sm">Немає даних</p>
                ) : (
                  <div className="space-y-4">
                    {stats.deviceData.map((item, idx) => {
                      const total = stats.deviceData.reduce((s, d) => s + d.count, 0);
                      const percent = ((item.count / total) * 100).toFixed(1);
                      return (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {item.device === "Мобільний" ? (
                                <Smartphone className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <Monitor className="w-4 h-4 text-cyan-400" />
                              )}
                              <span className="text-slate-300 text-sm">{item.device}</span>
                            </div>
                            <span className="text-cyan-400 text-sm">{percent}%</span>
                          </div>
                          <div className="w-full bg-slate-700/30 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${percent}%`,
                                backgroundColor: COLORS[idx % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Browsers Chart */}
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  Браузери
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.browserData.length === 0 ? (
                  <p className="text-slate-400 text-sm">Немає даних</p>
                ) : (
                  <div className="flex items-center justify-center">
                    <ChartContainer config={chartConfig} className="h-[250px] w-full max-w-[300px]">
                      <PieChart>
                        <Pie
                          data={stats.browserData}
                          dataKey="count"
                          nameKey="browser"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ browser, count }) => `${browser}: ${count}`}
                          labelLine={false}
                        >
                          {stats.browserData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography" className="space-y-6">
          {!mapboxToken ? (
            <Card className="bg-[#0a1628]/60 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  Налаштування Mapbox
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-400 text-sm">
                  Для відображення мапи введіть ваш Mapbox Public Token. 
                  Отримати його можна на <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">mapbox.com</a>
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="pk.eyJ1Ijo..."
                    className="bg-[#0a1628] border-cyan-500/20 text-white"
                    onChange={(e) => {
                      const token = e.target.value;
                      if (token.startsWith('pk.')) {
                        setMapboxToken(token);
                        localStorage.setItem("mapbox_token", token);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <VisitorMap mapboxToken={mapboxToken} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
