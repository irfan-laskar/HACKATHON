import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  AlertTriangle,
  Info,
  Calendar,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  Layers,
  Percent,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
} from 'recharts';

interface BenchmarkModel {
  id: string;
  name: string;
  type: string;
  monthlySales: number;
  foodCostPct: number;
  grossMarginPct: number;
  netMarginPct: number;
  monthlyCovers: number;
  history: {
    month: string;
    sales: number;
    rawFoodCost: number;
    operatingExpenses: number;
    grossProfit: number;
    netProfit: number;
    dineInCovers: number;
    deliveryOrders: number;
  }[];
  costBreakdown: { name: string; value: number; color: string }[];
}

const BENCHMARK_MODELS: BenchmarkModel[] = [
  {
    id: 'casual-diner',
    name: 'The Spice Table (42-Seater Casual Diner)',
    type: 'Dine-In + Takeaway + Delivery',
    monthlySales: 480000,
    foodCostPct: 31,
    grossMarginPct: 69,
    netMarginPct: 18.5,
    monthlyCovers: 1420,
    history: [
      { month: 'May', sales: 410000, rawFoodCost: 135000, operatingExpenses: 215000, grossProfit: 275000, netProfit: 60000, dineInCovers: 890, deliveryOrders: 380 },
      { month: 'Jun', sales: 430000, rawFoodCost: 140000, operatingExpenses: 220000, grossProfit: 290000, netProfit: 70000, dineInCovers: 940, deliveryOrders: 410 },
      { month: 'Jul', sales: 445000, rawFoodCost: 142000, operatingExpenses: 225000, grossProfit: 303000, netProfit: 78000, dineInCovers: 980, deliveryOrders: 430 },
      { month: 'Aug', sales: 460000, rawFoodCost: 146000, operatingExpenses: 228000, grossProfit: 314000, netProfit: 86000, dineInCovers: 1020, deliveryOrders: 450 },
      { month: 'Sep', sales: 475000, rawFoodCost: 149000, operatingExpenses: 232000, grossProfit: 326000, netProfit: 94000, dineInCovers: 1050, deliveryOrders: 470 },
      { month: 'Oct', sales: 480000, rawFoodCost: 148800, operatingExpenses: 242400, grossProfit: 331200, netProfit: 88800, dineInCovers: 1060, deliveryOrders: 480 },
    ],
    costBreakdown: [
      { name: 'Raw Food Cost (31%)', value: 31, color: '#790D16' }, // Core Crimson
      { name: 'Staff Salaries (20%)', value: 20, color: '#b01d2a' }, // Crimson Medium
      { name: 'Rent & Maintenance (15%)', value: 15, color: '#E5D3AF' }, // Core Sand
      { name: 'Aggregator Commissions (8%)', value: 8, color: '#AEC4D4' }, // Core Powder Blue
      { name: 'LPG Gas, Power & Water (5%)', value: 5, color: '#6c8ea2' }, // Slate Blue
      { name: 'Packaging Supplies (2.5%)', value: 2.5, color: '#d5be8a' }, // Soft Sand
      { name: 'Net Take-Home Profit (18.5%)', value: 18.5, color: '#435a69' }, // Deep Powder Slate
    ],
  },
  {
    id: 'cloud-kitchen',
    name: 'Biryani Box (Cloud Kitchen)',
    type: '100% Online Delivery & Hyperlocal Takeaway',
    monthlySales: 360000,
    foodCostPct: 29.5,
    grossMarginPct: 70.5,
    netMarginPct: 13.2,
    monthlyCovers: 1150,
    history: [
      { month: 'May', sales: 290000, rawFoodCost: 92000, operatingExpenses: 170000, grossProfit: 198000, netProfit: 28000, dineInCovers: 0, deliveryOrders: 920 },
      { month: 'Jun', sales: 310000, rawFoodCost: 96000, operatingExpenses: 180000, grossProfit: 214000, netProfit: 34000, dineInCovers: 0, deliveryOrders: 990 },
      { month: 'Jul', sales: 325000, rawFoodCost: 99000, operatingExpenses: 188000, grossProfit: 226000, netProfit: 38000, dineInCovers: 0, deliveryOrders: 1040 },
      { month: 'Aug', sales: 340000, rawFoodCost: 102000, operatingExpenses: 195000, grossProfit: 238000, netProfit: 43000, dineInCovers: 0, deliveryOrders: 1090 },
      { month: 'Sep', sales: 355000, rawFoodCost: 106000, operatingExpenses: 204000, grossProfit: 249000, netProfit: 45000, dineInCovers: 0, deliveryOrders: 1130 },
      { month: 'Oct', sales: 360000, rawFoodCost: 106200, operatingExpenses: 206280, grossProfit: 253800, netProfit: 47520, dineInCovers: 0, deliveryOrders: 1150 },
    ],
    costBreakdown: [
      { name: 'Raw Food Cost (29.5%)', value: 29.5, color: '#790D16' },
      { name: 'Aggregator Commissions (22%)', value: 22, color: '#AEC4D4' },
      { name: 'Kitchen Staff (16%)', value: 16, color: '#b01d2a' },
      { name: 'Packaging Containers (7%)', value: 7, color: '#d5be8a' },
      { name: 'Kitchen Rent & Power (8.5%)', value: 8.5, color: '#E5D3AF' },
      { name: 'Platform Sponsored Ads (3.8%)', value: 3.8, color: '#e3727c' },
      { name: 'Net Take-Home Profit (13.2%)', value: 13.2, color: '#435a69' },
    ],
  },
  {
    id: 'chai-cafe',
    name: 'Chai & Chutney (QSR Cafe)',
    type: 'High Volume Counter Service',
    monthlySales: 280000,
    foodCostPct: 26,
    grossMarginPct: 74,
    netMarginPct: 22.4,
    monthlyCovers: 2950,
    history: [
      { month: 'May', sales: 240000, rawFoodCost: 65000, operatingExpenses: 125000, grossProfit: 175000, netProfit: 50000, dineInCovers: 2100, deliveryOrders: 350 },
      { month: 'Jun', sales: 250000, rawFoodCost: 67000, operatingExpenses: 130000, grossProfit: 183000, netProfit: 53000, dineInCovers: 2200, deliveryOrders: 370 },
      { month: 'Jul', sales: 260000, rawFoodCost: 69000, operatingExpenses: 134000, grossProfit: 191000, netProfit: 57000, dineInCovers: 2320, deliveryOrders: 390 },
      { month: 'Aug', sales: 270000, rawFoodCost: 71000, operatingExpenses: 138000, grossProfit: 199000, netProfit: 61000, dineInCovers: 2450, deliveryOrders: 410 },
      { month: 'Sep', sales: 275000, rawFoodCost: 72000, operatingExpenses: 141000, grossProfit: 203000, netProfit: 62000, dineInCovers: 2500, deliveryOrders: 420 },
      { month: 'Oct', sales: 280000, rawFoodCost: 72800, operatingExpenses: 144480, grossProfit: 207200, netProfit: 62720, dineInCovers: 2550, deliveryOrders: 440 },
    ],
    costBreakdown: [
      { name: 'Raw Food & Dairy Cost (26%)', value: 26, color: '#790D16' },
      { name: 'Counter Staff (18%)', value: 18, color: '#b01d2a' },
      { name: 'High-Street Kiosk Rent (20%)', value: 20, color: '#E5D3AF' },
      { name: 'Electricity & Gas (6%)', value: 6, color: '#6c8ea2' },
      { name: 'Packaging & Glasses (4%)', value: 4, color: '#d5be8a' },
      { name: 'Delivery Commissions (3.6%)', value: 3.6, color: '#AEC4D4' },
      { name: 'Net Take-Home Profit (22.4%)', value: 22.4, color: '#435a69' },
    ],
  },
];

export const Dashboard: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('casual-diner');
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '3m'>('6m');

  // Scenario Simulator interactive sliders
  const [simFoodCostReductionPct, setSimFoodCostReductionPct] = useState<number>(3);
  const [simDirectDeliveryConvertPct, setSimDirectDeliveryConvertPct] = useState<number>(20);

  const currentModel = useMemo(() => {
    return BENCHMARK_MODELS.find((m) => m.id === selectedModelId) || BENCHMARK_MODELS[0];
  }, [selectedModelId]);

  const chartData = useMemo(() => {
    if (selectedPeriod === '3m') {
      return currentModel.history.slice(-3);
    }
    return currentModel.history;
  }, [currentModel, selectedPeriod]);

  // Latest month numbers
  const latestMonth = currentModel.history[currentModel.history.length - 1];
  const grossProfit = latestMonth.grossProfit;
  const netProfit = latestMonth.netProfit;
  const grossMarginPct = Math.round((grossProfit / latestMonth.sales) * 1000) / 10;
  const netMarginPct = Math.round((netProfit / latestMonth.sales) * 1000) / 10;

  // Simulator savings calculation
  const simulationResults = useMemo(() => {
    // 1. Raw food savings: sales * (reductionPct / 100)
    const foodCostRupeeSavings = Math.round(latestMonth.sales * (simFoodCostReductionPct / 100));
    
    // 2. Delivery savings: 
    // Aggregator takes ~24%. Direct delivery costs ~8% packaging/delivery boy. Net savings ~ 16% on converted volume.
    const deliverySalesEstimate = latestMonth.sales * 0.4; // approx 40%
    const convertedVolumeRupees = deliverySalesEstimate * (simDirectDeliveryConvertPct / 100);
    const commissionRupeeSavings = Math.round(convertedVolumeRupees * 0.16);

    const totalExtraMonthlyProfit = foodCostRupeeSavings + commissionRupeeSavings;
    const newNetProfit = latestMonth.netProfit + totalExtraMonthlyProfit;
    const newNetMarginPct = Math.round((newNetProfit / latestMonth.sales) * 1000) / 10;

    return {
      foodCostRupeeSavings,
      commissionRupeeSavings,
      totalExtraMonthlyProfit,
      newNetProfit,
      newNetMarginPct,
    };
  }, [latestMonth, simFoodCostReductionPct, simDirectDeliveryConvertPct]);

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Demonstration Data Banner (Prominently requested) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3.5 shadow-2xs">
          <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 block mb-0.5">
              Demonstration & Benchmark Performance Data
            </span>
            <p className="text-amber-900/90 dark:text-amber-200 leading-relaxed">
              The metrics, charts, and unit economics displayed below are realistic, calibrated demonstration data modeled on actual small restaurants, cloud kitchens, and cafes operating in India. Use this dashboard to compare your own outlet's performance against industry benchmarks.
            </p>
          </div>
        </div>

        {/* Dashboard Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-2 border border-forest-200 dark:border-forest-700">
              <LayoutDashboard className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              Restaurant Unit Economics Analytics
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50">
              Executive Profit & Performance Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-cream-300 mt-1">
              Visualizing Gross Profit vs Net Profit, Prime Costs, Channel Mix, and Margin Recovery Scenarios.
            </p>
          </div>

          {/* Model Switcher and Period Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-700 text-xs sm:text-sm font-bold text-forest-950 dark:text-cream-50 shadow-xs focus:ring-2 focus:ring-lime-500"
            >
              {BENCHMARK_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>

            <div className="inline-flex p-1 rounded-xl bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-700">
              <button
                type="button"
                onClick={() => setSelectedPeriod('6m')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedPeriod === '6m'
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 shadow-2xs'
                    : 'text-slate-500 dark:text-cream-400 hover:text-slate-800'
                }`}
              >
                Last 6 Months
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('3m')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  selectedPeriod === '3m'
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 shadow-2xs'
                    : 'text-slate-500 dark:text-cream-400 hover:text-slate-800'
                }`}
              >
                Last 3 Months
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Monthly Gross Sales */}
          <div className="bg-white dark:bg-forest-900 p-6 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-cream-400 text-xs font-bold">
              <span>MONTHLY GROSS SALES</span>
              <DollarSign className="w-4 h-4 text-forest-600 dark:text-lime-400" />
            </div>
            <div className="text-3xl font-display font-black text-forest-950 dark:text-cream-50">
              ₹{latestMonth.sales.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +17.1% vs 6-month baseline
            </div>
          </div>

          {/* 2. Gross Profit (Sales - Food Cost) */}
          <div className="bg-white dark:bg-forest-900 p-6 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-cream-400 text-xs font-bold">
              <span>GROSS PROFIT (SALES - RAW FOOD)</span>
              <Percent className="w-4 h-4 text-forest-600 dark:text-lime-400" />
            </div>
            <div className="text-3xl font-display font-black text-forest-950 dark:text-cream-50">
              ₹{grossProfit.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-cream-400">
              <span className="font-bold text-forest-800 dark:text-lime-300">Gross Margin: {grossMarginPct}%</span>
              <span>Raw Food: {currentModel.foodCostPct}%</span>
            </div>
          </div>

          {/* 3. Net Take-Home Profit (Clearly distinguished) */}
          <div className="bg-gradient-to-br from-lime-500/15 via-forest-500/10 to-transparent dark:from-lime-950/40 dark:to-forest-900/40 p-6 rounded-3xl border border-lime-300 dark:border-lime-800/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-forest-800 dark:text-lime-300 text-xs font-extrabold uppercase">
              <span>NET TAKE-HOME PROFIT</span>
              <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            </div>
            <div className="text-3xl font-display font-black text-forest-950 dark:text-cream-50">
              ₹{netProfit.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-forest-800 dark:text-lime-300">
              <span>Net Margin: {netMarginPct}%</span>
              <span className="text-[11px] text-slate-500 dark:text-cream-400">After Rent & Staff</span>
            </div>
          </div>

          {/* 4. Total Monthly Customer Covers */}
          <div className="bg-white dark:bg-forest-900 p-6 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-cream-400 text-xs font-bold">
              <span>CUSTOMER COVERS / ORDERS</span>
              <Users className="w-4 h-4 text-forest-600 dark:text-lime-400" />
            </div>
            <div className="text-3xl font-display font-black text-forest-950 dark:text-cream-50">
              {(latestMonth.dineInCovers + latestMonth.deliveryOrders).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-cream-400">
              <span>Dine-In: {latestMonth.dineInCovers}</span>
              <span>Delivery: {latestMonth.deliveryOrders}</span>
            </div>
          </div>

        </div>

        {/* Charts Section: Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 1: Monthly Sales, Expenses & Gross Profit Trend */}
          <div className="lg:col-span-8 bg-white dark:bg-forest-900 p-6 sm:p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                  Monthly Revenue vs Operating Expenses & Gross Profit
                </h3>
                <p className="text-xs text-slate-500 dark:text-cream-400">
                  Bars represent Gross Sales and Operating Expenses; green line tracks Gross Profit in ₹.
                </p>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    contentStyle={{
                      backgroundColor: '#220306',
                      borderColor: '#790D16',
                      borderRadius: '12px',
                      color: '#F5EFE1',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="sales" name="Gross Sales" fill="#790D16" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="operatingExpenses" name="Operating Expenses" fill="#E5D3AF" radius={[6, 6, 0, 0]} />
                  <Line type="monotone" dataKey="grossProfit" name="Gross Profit" stroke="#AEC4D4" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Cost Structure Distribution (Donut Chart) */}
          <div className="lg:col-span-4 bg-white dark:bg-forest-900 p-6 sm:p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                Cost Structure Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-cream-400">
                Where every ₹100 of customer billing goes in this restaurant model.
              </p>
            </div>

            <div className="h-60 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentModel.costBreakdown}
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {currentModel.costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Share']}
                    contentStyle={{
                      backgroundColor: '#220306',
                      borderColor: '#790D16',
                      borderRadius: '12px',
                      color: '#F5EFE1',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              {currentModel.costBreakdown.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-cream-300">{item.name}</span>
                  </div>
                  <span className="font-bold text-forest-900 dark:text-cream-50">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Charts Section: Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Chart 3: Gross Profit vs Net Profit Area Trend */}
          <div className="lg:col-span-6 bg-white dark:bg-forest-900 p-6 sm:p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                Gross Profit vs Net Take-Home Margin Gap
              </h3>
              <p className="text-xs text-slate-500 dark:text-cream-400">
                Distinguishes initial food markup from what actually remains after paying rent and aggregator cuts.
              </p>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#790D16" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#790D16" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#AEC4D4" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#AEC4D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    contentStyle={{
                      backgroundColor: '#220306',
                      borderColor: '#790D16',
                      borderRadius: '12px',
                      color: '#F5EFE1',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="grossProfit" name="Gross Profit (Sales - Food)" stroke="#790D16" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGross)" />
                  <Area type="monotone" dataKey="netProfit" name="Net Profit (Take Home)" stroke="#AEC4D4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Order Channels (Dine-in vs Delivery) */}
          <div className="lg:col-span-6 bg-white dark:bg-forest-900 p-6 sm:p-7 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                Channel Volume: Dine-In Covers vs Online Orders
              </h3>
              <p className="text-xs text-slate-500 dark:text-cream-400">
                Tracking monthly order counts to identify platform dependency risk.
              </p>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#220306',
                      borderColor: '#790D16',
                      borderRadius: '12px',
                      color: '#F5EFE1',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="dineInCovers" name="Dine-In Covers" stroke="#790D16" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="deliveryOrders" name="Online Delivery Orders" stroke="#AEC4D4" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Interactive Scenario Simulator: "What-If Margin Simulator" */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-850 to-forest-900 rounded-3xl p-6 sm:p-10 text-cream-50 border border-forest-800 shadow-lg space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-bold uppercase tracking-wider mb-2 border border-lime-400/30">
                <Sliders className="w-3.5 h-3.5" /> Interactive Unit Economics Simulator
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
                Simulate Your Potential Monthly Profit Recovery
              </h3>
              <p className="text-xs sm:text-sm text-cream-200 mt-1 max-w-2xl">
                See what happens to your monthly cash in hand if you standardize recipes to lower food cost, or convert online delivery customers to direct WhatsApp ordering.
              </p>
            </div>

            {/* Simulated Take Home Display */}
            <div className="bg-forest-950/80 p-5 rounded-2xl border border-lime-400/30 text-center sm:text-right shrink-0">
              <span className="text-xs uppercase font-extrabold text-lime-400 block">
                Additional Monthly Cash Recovered
              </span>
              <span className="text-3xl sm:text-4xl font-display font-black text-lime-300 block mt-0.5">
                +₹{simulationResults.totalExtraMonthlyProfit.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-cream-300 block mt-1">
                Lifts Net Margin from {netMarginPct}% to {simulationResults.newNetMarginPct}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-forest-800">
            
            {/* Slider 1: Food Cost Reduction */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-cream-50">
                  Reduce Raw Food Cost by: <span className="text-lime-300 font-extrabold">{simFoodCostReductionPct}%</span>
                </label>
                <span className="text-xs text-lime-400 font-semibold">
                  +₹{simulationResults.foodCostRupeeSavings.toLocaleString('en-IN')} / mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={simFoodCostReductionPct}
                onChange={(e) => setSimFoodCostReductionPct(Number(e.target.value))}
                className="w-full accent-lime-400"
              />
              <p className="text-[11px] text-cream-300">
                Achieved by introducing portion control ladles, weighing prep cuts, and standardizing gravy recipes.
              </p>
            </div>

            {/* Slider 2: Direct Delivery Conversion */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-cream-50">
                  Convert Delivery Orders to Direct WhatsApp: <span className="text-lime-300 font-extrabold">{simDirectDeliveryConvertPct}%</span>
                </label>
                <span className="text-xs text-lime-400 font-semibold">
                  +₹{simulationResults.commissionRupeeSavings.toLocaleString('en-IN')} / mo
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={simDirectDeliveryConvertPct}
                onChange={(e) => setSimDirectDeliveryConvertPct(Number(e.target.value))}
                className="w-full accent-lime-400"
              />
              <p className="text-[11px] text-cream-300">
                Achieved with 15% discount flyers inside delivery bags and a direct WhatsApp menu catalog.
              </p>
            </div>

          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-cream-300">
              Ready to execute these improvements in your own kitchen?
            </span>
            <div className="flex items-center gap-3">
              <Link
                to="/tools"
                className="px-5 py-2.5 rounded-xl bg-lime-400 text-forest-950 font-bold text-xs hover:bg-lime-300 transition shadow-sm"
              >
                Launch Calculators
              </Link>
              <Link
                to="/growth-planner"
                className="px-5 py-2.5 rounded-xl bg-forest-800 text-cream-50 font-bold text-xs hover:bg-forest-750 transition border border-forest-700"
              >
                Track in 6-Month Plan
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
