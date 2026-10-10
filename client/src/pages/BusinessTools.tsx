import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calculator,
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Flame,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const BusinessTools: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const activeTabParam = searchParams.get('tab') || 'food-cost';
  const [activeTab, setActiveTab] = useState<string>(activeTabParam);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    searchParams.set('tab', tabId);
    setSearchParams(searchParams);
  };

  /* ============================================================
     TOOL 1: FOOD-COST CALCULATOR
  ============================================================ */
  interface IngredientItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    costPerUnit: number; // in ₹
    yieldLossPercent: number; // e.g., 10%
  }

  const [dishName, setDishName] = useState('Shahi Paneer Butter Masala');
  const [sellingPrice, setSellingPrice] = useState<number>(290);
  const [targetFoodCostPct, setTargetFoodCostPct] = useState<number>(30);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: '1', name: 'Fresh Malai Paneer', quantity: 0.18, unit: 'kg', costPerUnit: 380, yieldLossPercent: 2 },
    { id: '2', name: 'Amul Butter & Cream', quantity: 0.05, unit: 'kg', costPerUnit: 520, yieldLossPercent: 0 },
    { id: '3', name: 'Onion-Tomato Makhani Base', quantity: 0.22, unit: 'kg', costPerUnit: 95, yieldLossPercent: 8 },
    { id: '4', name: 'Cashew Nut Paste', quantity: 0.03, unit: 'kg', costPerUnit: 800, yieldLossPercent: 5 },
    { id: '5', name: 'Spices, Ginger-Garlic & Kasuri Methi', quantity: 0.02, unit: 'kg', costPerUnit: 350, yieldLossPercent: 0 },
    { id: '6', name: 'Refined Cooking Oil', quantity: 0.03, unit: 'L', costPerUnit: 140, yieldLossPercent: 0 },
  ]);

  const addIngredientRow = () => {
    setIngredients((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: 'New Ingredient',
        quantity: 0.1,
        unit: 'kg',
        costPerUnit: 100,
        yieldLossPercent: 0,
      },
    ]);
  };

  const removeIngredientRow = (id: string) => {
    if (ingredients.length <= 1) {
      showToast('You need at least one ingredient row', 'warning');
      return;
    }
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const updateIngredient = (id: string, field: keyof IngredientItem, value: any) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const loadRecipePreset = (preset: 'paneer' | 'biryani' | 'chai') => {
    if (preset === 'paneer') {
      setDishName('Shahi Paneer Butter Masala');
      setSellingPrice(290);
      setIngredients([
        { id: '1', name: 'Fresh Malai Paneer', quantity: 0.18, unit: 'kg', costPerUnit: 380, yieldLossPercent: 2 },
        { id: '2', name: 'Amul Butter & Cream', quantity: 0.05, unit: 'kg', costPerUnit: 520, yieldLossPercent: 0 },
        { id: '3', name: 'Onion-Tomato Makhani Base', quantity: 0.22, unit: 'kg', costPerUnit: 95, yieldLossPercent: 8 },
        { id: '4', name: 'Cashew Nut Paste', quantity: 0.03, unit: 'kg', costPerUnit: 800, yieldLossPercent: 5 },
        { id: '5', name: 'Spices, Ginger-Garlic & Kasuri Methi', quantity: 0.02, unit: 'kg', costPerUnit: 350, yieldLossPercent: 0 },
        { id: '6', name: 'Refined Cooking Oil', quantity: 0.03, unit: 'L', costPerUnit: 140, yieldLossPercent: 0 },
      ]);
    } else if (preset === 'biryani') {
      setDishName('Dum Chicken Biryani (Single Portion)');
      setSellingPrice(260);
      setIngredients([
        { id: '1', name: 'Fresh Bone-in Chicken', quantity: 0.25, unit: 'kg', costPerUnit: 220, yieldLossPercent: 12 },
        { id: '2', name: 'Aged Basmati Rice', quantity: 0.18, unit: 'kg', costPerUnit: 110, yieldLossPercent: 0 },
        { id: '3', name: 'Pure Desi Ghee & Oil', quantity: 0.04, unit: 'kg', costPerUnit: 600, yieldLossPercent: 0 },
        { id: '4', name: 'Brown Fried Onions (Birista)', quantity: 0.06, unit: 'kg', costPerUnit: 180, yieldLossPercent: 15 },
        { id: '5', name: 'Curd / Dahi & Mint Marinade', quantity: 0.08, unit: 'kg', costPerUnit: 70, yieldLossPercent: 0 },
        { id: '6', name: 'Whole Biryani Spices & Saffron Milk', quantity: 0.015, unit: 'kg', costPerUnit: 750, yieldLossPercent: 0 },
      ]);
    } else {
      setDishName('Kadak Masala Chai Pot (Serves 4)');
      setSellingPrice(120);
      setIngredients([
        { id: '1', name: 'Full Cream Cow Milk', quantity: 0.5, unit: 'L', costPerUnit: 66, yieldLossPercent: 0 },
        { id: '2', name: 'Assam CTC Tea Leaves', quantity: 0.04, unit: 'kg', costPerUnit: 340, yieldLossPercent: 0 },
        { id: '3', name: 'Sugar', quantity: 0.05, unit: 'kg', costPerUnit: 44, yieldLossPercent: 0 },
        { id: '4', name: 'Fresh Crushed Ginger & Cardamom', quantity: 0.025, unit: 'kg', costPerUnit: 400, yieldLossPercent: 10 },
      ]);
    }
    showToast(`Loaded ${preset.toUpperCase()} preset recipe!`, 'info');
  };

  const foodCostCalculations = useMemo(() => {
    let rawPlateCost = 0;
    ingredients.forEach((item) => {
      // Yield adjusted cost: cost / (1 - loss/100)
      const effectiveLossMultiplier = 1 / Math.max(0.01, 1 - item.yieldLossPercent / 100);
      const rowCost = item.quantity * item.costPerUnit * effectiveLossMultiplier;
      rawPlateCost += rowCost;
    });

    const actualFoodCostPct = sellingPrice > 0 ? (rawPlateCost / sellingPrice) * 100 : 0;
    const grossProfitRupees = Math.max(0, sellingPrice - rawPlateCost);
    const recommendedSellingPrice = rawPlateCost / (targetFoodCostPct / 100);

    return {
      rawPlateCost: Math.round(rawPlateCost * 100) / 100,
      actualFoodCostPct: Math.round(actualFoodCostPct * 10) / 10,
      grossProfitRupees: Math.round(grossProfitRupees * 100) / 100,
      recommendedSellingPrice: Math.round(recommendedSellingPrice),
    };
  }, [ingredients, sellingPrice, targetFoodCostPct]);

  /* ============================================================
     TOOL 2: MENU-PRICING CALCULATOR
  ============================================================ */
  const [basePlateCost, setBasePlateCost] = useState<number>(85);
  const [dineInTargetMarginPct, setDineInTargetMarginPct] = useState<number>(70); // Gross margin 70% -> Food cost 30%
  const [platformCommissionPct, setPlatformCommissionPct] = useState<number>(24);
  const [packagingContainerCost, setPackagingContainerCost] = useState<number>(14);
  const [gstRatePct, setGstRatePct] = useState<number>(5);

  const menuPricingResults = useMemo(() => {
    // Dine in Price before GST: PlateCost / (1 - Margin/100)
    const dineInTargetFoodCost = 1 - dineInTargetMarginPct / 100;
    const recommendedDineInPrice = Math.round(basePlateCost / Math.max(0.1, dineInTargetFoodCost));
    const dineInGrossProfit = recommendedDineInPrice - basePlateCost;
    const dineInGstAmount = Math.round((recommendedDineInPrice * gstRatePct) / 100);
    const dineInFinalCustomerPrice = recommendedDineInPrice + dineInGstAmount;

    // Online delivery: To preserve the exact same ₹ Gross Profit (dineInGrossProfit),
    // Net realization after commission must equal (basePlateCost + packagingContainerCost + dineInGrossProfit).
    // Let P = Online Price. Commission = P * (CommissionPct / 100).
    // P - Commission - Packaging - PlateCost = dineInGrossProfit
    // P * (1 - CommissionPct/100) = basePlateCost + packagingContainerCost + dineInGrossProfit
    const commissionFraction = platformCommissionPct / 100;
    const totalRequiredNet = basePlateCost + packagingContainerCost + dineInGrossProfit;
    const recommendedOnlinePrice = Math.round(totalRequiredNet / Math.max(0.1, 1 - commissionFraction));
    const commissionRupees = Math.round(recommendedOnlinePrice * commissionFraction);
    const onlineNetRealization = recommendedOnlinePrice - commissionRupees - packagingContainerCost;
    const markupPct = recommendedDineInPrice > 0
      ? Math.round(((recommendedOnlinePrice - recommendedDineInPrice) / recommendedDineInPrice) * 100)
      : 0;

    return {
      recommendedDineInPrice,
      dineInGrossProfit,
      dineInGstAmount,
      dineInFinalCustomerPrice,
      recommendedOnlinePrice,
      commissionRupees,
      onlineNetRealization,
      markupPct,
    };
  }, [basePlateCost, dineInTargetMarginPct, platformCommissionPct, packagingContainerCost, gstRatePct]);

  /* ============================================================
     TOOL 3: MONTHLY PROFIT & BREAK-EVEN TRACKER
  ============================================================ */
  const [monthlySales, setMonthlySales] = useState<number>(420000);
  const [deliverySharePct, setDeliverySharePct] = useState<number>(45);
  const [foodCostRatioPct, setFoodCostRatioPct] = useState<number>(31);
  const [rentExpense, setRentExpense] = useState<number>(48000);
  const [staffSalariesExpense, setStaffSalariesExpense] = useState<number>(68000);
  const [utilitiesExpense, setUtilitiesExpense] = useState<number>(24000); // LPG, power, water
  const [ownerSalaryExpense, setOwnerSalaryExpense] = useState<number>(35000);
  const [avgOrderValueAOV, setAvgOrderValueAOV] = useState<number>(320);

  const profitTrackerResults = useMemo(() => {
    const rawFoodExpense = Math.round((monthlySales * foodCostRatioPct) / 100);
    const grossProfitRupees = monthlySales - rawFoodExpense;
    const grossMarginPct = monthlySales > 0 ? (grossProfitRupees / monthlySales) * 100 : 0;

    // Delivery Platform commissions (24% on delivery share of sales)
    const deliveryRevenue = (monthlySales * deliverySharePct) / 100;
    const platformCommissionExpense = Math.round(deliveryRevenue * 0.24);
    const packagingExpense = Math.round(deliveryRevenue * 0.05); // ~5% on delivery packaging

    // Total fixed costs
    const fixedOverheads = rentExpense + staffSalariesExpense + utilitiesExpense + ownerSalaryExpense;
    // Total variable costs
    const variableCosts = platformCommissionExpense + packagingExpense;
    const totalOperatingExpenses = fixedOverheads + variableCosts;

    const netProfitRupees = grossProfitRupees - totalOperatingExpenses;
    const netMarginPct = monthlySales > 0 ? (netProfitRupees / monthlySales) * 100 : 0;

    // Break Even Revenue = Fixed Costs / (Gross Margin Pct / 100)
    const grossMarginFraction = grossMarginPct / 100;
    const monthlyBreakEvenSales = grossMarginFraction > 0 ? Math.round(fixedOverheads / grossMarginFraction) : 0;
    const dailyBreakEvenSales = Math.round(monthlyBreakEvenSales / 30);
    const dailyCoversNeeded = avgOrderValueAOV > 0 ? Math.ceil(dailyBreakEvenSales / avgOrderValueAOV) : 0;

    return {
      rawFoodExpense,
      grossProfitRupees,
      grossMarginPct: Math.round(grossMarginPct * 10) / 10,
      platformCommissionExpense,
      packagingExpense,
      fixedOverheads,
      totalOperatingExpenses,
      netProfitRupees,
      netMarginPct: Math.round(netMarginPct * 10) / 10,
      monthlyBreakEvenSales,
      dailyBreakEvenSales,
      dailyCoversNeeded,
    };
  }, [
    monthlySales,
    deliverySharePct,
    foodCostRatioPct,
    rentExpense,
    staffSalariesExpense,
    utilitiesExpense,
    ownerSalaryExpense,
    avgOrderValueAOV,
  ]);

  /* ============================================================
     TOOL 4: PANTRY INVENTORY TRACKER
  ============================================================ */
  interface PantryItem {
    id: string;
    name: string;
    category: string;
    unit: string;
    costPerUnit: number;
    currentStock: number;
    minReorderLevel: number;
  }

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: '1', name: 'Fresh Malai Paneer', category: 'Dairy', unit: 'kg', costPerUnit: 380, currentStock: 6.5, minReorderLevel: 8 },
    { id: '2', name: 'Aged Basmati Rice', category: 'Grains', unit: 'kg', costPerUnit: 110, currentStock: 45, minReorderLevel: 25 },
    { id: '3', name: 'Broiler Chicken (Curry Cut)', category: 'Poultry', unit: 'kg', costPerUnit: 220, currentStock: 4.2, minReorderLevel: 10 },
    { id: '4', name: 'Fortune Refined Sunflower Oil', category: 'Oils', unit: 'L', costPerUnit: 145, currentStock: 28, minReorderLevel: 20 },
    { id: '5', name: 'Amul Salted Butter (100g blocks)', category: 'Dairy', unit: 'pcs', costPerUnit: 56, currentStock: 12, minReorderLevel: 25 },
    { id: '6', name: 'Red Onions (Nashik Grade)', category: 'Vegetables', unit: 'kg', costPerUnit: 35, currentStock: 60, minReorderLevel: 40 },
    { id: '7', name: 'Hybrid Red Tomatoes', category: 'Vegetables', unit: 'kg', costPerUnit: 42, currentStock: 18, minReorderLevel: 25 },
    { id: '8', name: '3-Compartment Meal Delivery Trays', category: 'Packaging', unit: 'pcs', costPerUnit: 12.5, currentStock: 95, minReorderLevel: 150 },
  ]);

  const [newPantryName, setNewPantryName] = useState('');
  const [newPantryCategory, setNewPantryCategory] = useState('Dairy');
  const [newPantryUnit, setNewPantryUnit] = useState('kg');
  const [newPantryCost, setNewPantryCost] = useState<number>(100);
  const [newPantryStock, setNewPantryStock] = useState<number>(10);
  const [newPantryMin, setNewPantryMin] = useState<number>(5);
  const [wastageRupeesLogged, setWastageRupeesLogged] = useState<number>(0);

  const addPantryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPantryName.trim()) {
      showToast('Enter item name', 'warning');
      return;
    }
    const item: PantryItem = {
      id: Date.now().toString(),
      name: newPantryName.trim(),
      category: newPantryCategory,
      unit: newPantryUnit,
      costPerUnit: Number(newPantryCost),
      currentStock: Number(newPantryStock),
      minReorderLevel: Number(newPantryMin),
    };
    setPantryItems((prev) => [item, ...prev]);
    setNewPantryName('');
    showToast(`Added ${item.name} to pantry list`, 'success');
  };

  const removePantryItem = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updatePantryStock = (id: string, delta: number) => {
    setPantryItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStock = Math.max(0, Math.round((item.currentStock + delta) * 10) / 10);
          return { ...item, currentStock: newStock };
        }
        return item;
      })
    );
  };

  const logWastage = (item: PantryItem) => {
    const wasteCost = Math.round(item.costPerUnit * 1);
    setWastageRupeesLogged((prev) => prev + wasteCost);
    updatePantryStock(item.id, -1);
    showToast(`Logged 1 ${item.unit} of ${item.name} as spoilage (₹${wasteCost})`, 'warning');
  };

  const pantryCalculations = useMemo(() => {
    let totalStockValue = 0;
    let lowStockCount = 0;

    pantryItems.forEach((item) => {
      totalStockValue += item.currentStock * item.costPerUnit;
      if (item.currentStock <= item.minReorderLevel) {
        lowStockCount++;
      }
    });

    return {
      totalStockValue: Math.round(totalStockValue),
      lowStockCount,
      totalItems: pantryItems.length,
    };
  }, [pantryItems]);

  /* ============================================================
     TOOL 5: BRAND-NAME BRAINSTORMING TOOL
  ============================================================ */
  const [selectedCuisine, setSelectedCuisine] = useState('North Indian & Mughlai');
  const [selectedVibe, setSelectedVibe] = useState('Heritage & Royal');
  const [selectedCity, setSelectedCity] = useState('Delhi-NCR');
  const [copiedBrandIdx, setCopiedBrandIdx] = useState<number | null>(null);

  const brandIdeas = useMemo(() => {
    const list = [
      {
        name: selectedVibe === 'Heritage & Royal' ? 'Shahi Dastaan' : 'Masala & Co.',
        tagline: 'Slow-simmered handi classics with authentic generational spices.',
        positioning: 'High-margin slow-cooked curries with premium clay handi delivery packaging.',
        heroDish: 'Dum Pukht Handi Gosht & Zafrani Phirni',
        igHandle: '@shahidastaan.in',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: selectedVibe === 'Modern Quirky & Trendy' ? 'The Curry Collective' : 'Dilli 6 Dastarkhwan',
        tagline: 'Everyday comfort flavors reimagined for fast-paced urban dining.',
        positioning: 'Pocket-friendly thali boxes and quick 7-minute lunch service for office goers.',
        heroDish: 'Butter Chicken Rice Bowls & Kokum Fizz',
        igHandle: '@currycollective.eats',
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: selectedVibe === 'Farm Fresh & Organic' ? 'Pind Botanica' : 'Rasoi Khazana',
        tagline: 'Pure desi ghee cooking with 100% farm-sourced stone-ground flour.',
        positioning: 'Health-conscious families seeking zero-adulteration, unrefined home recipes.',
        heroDish: 'Makki Di Roti, Sarson Ka Saag & White Butter',
        igHandle: '@pindbotanica.pure',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Tandoor Republic',
        tagline: 'Charcoal flames, smoky marinades and late-night craving satisfaction.',
        positioning: 'Focus on high-turnover evening kebab rolls, tandoori starters & direct delivery.',
        heroDish: 'Bhatti Da Murgh & Smoked Paneer Tikka',
        igHandle: '@tandoorrepublic.official',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Zaika Junction',
        tagline: 'Grand trunk road highway nostalgia served fresh at your table.',
        positioning: 'Affordable, generous portions engineered for group celebrations and students.',
        heroDish: 'Highway Dal Tadka & Kadai Chicken',
        igHandle: '@zaikajunction.in',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'The Biryani Karkhana',
        tagline: 'Fragrant aged basmati, pure saffron strands, and 24-layer dum perfection.',
        positioning: 'Dedicated biryani cloud kitchen delivering in sealed earthen pots with raita.',
        heroDish: 'Awadhi Nizami Dum Biryani',
        igHandle: '@biryanikarkhana.hq',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      },
    ];
    return list;
  }, [selectedCuisine, selectedVibe, selectedCity]);

  const copyBrandCard = (b: any, idx: number) => {
    const text = `Brand Name: ${b.name}\nTagline: ${b.tagline}\nHero Dish: ${b.heroDish}\nPositioning: ${b.positioning}\nSuggested Handle: ${b.igHandle}`;
    navigator.clipboard.writeText(text);
    setCopiedBrandIdx(idx);
    showToast(`Copied "${b.name}" concept to clipboard!`, 'success');
    setTimeout(() => setCopiedBrandIdx(null), 2500);
  };

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-950 text-forest-950 dark:text-cream-50 transition-colors py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider mb-4 border border-forest-200 dark:border-forest-700">
            <Calculator className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            Financial & Operational Calculators
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-forest-950 dark:text-cream-50 leading-tight">
            Interactive Restaurant <br className="hidden sm:inline" />
            <span className="text-forest-700 dark:text-lime-400">Business Growth Tools</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-cream-200 leading-relaxed">
            Stop guessing your food costs and delivery cuts. Use these 5 mathematical tools engineered for Indian restaurant economics to protect your working capital.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar border-b border-cream-200 dark:border-forest-800">
          {[
            { id: 'food-cost', label: '1. Food-Cost Calculator', icon: UtensilsCrossed },
            { id: 'menu-pricing', label: '2. Menu-Pricing & Delivery Markup', icon: DollarSign },
            { id: 'profit-tracker', label: '3. Monthly Profit & Break-Even', icon: TrendingUp },
            { id: 'inventory-tracker', label: '4. Pantry Inventory Tracker', icon: Package },
            { id: 'brand-name', label: '5. Brand-Name Brainstormer', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 shadow-sm'
                    : 'bg-white/80 dark:bg-forest-900/60 text-slate-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-forest-800 border border-cream-200 dark:border-forest-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-lime-300 dark:text-forest-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================
           TAB 1: FOOD-COST CALCULATOR
        ============================================================ */}
        {activeTab === 'food-cost' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            {/* Left side: Inputs & Ingredients */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-5">
                
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cream-200 dark:border-forest-800">
                  <div>
                    <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                      Recipe Specification & Plate Cost Breakdown
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-cream-400">
                      List all raw ingredients, spices, and cooking yields per single plate portion.
                    </p>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="text-slate-400 hidden sm:inline">Presets:</span>
                    <button
                      type="button"
                      onClick={() => loadRecipePreset('paneer')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-forest-750 transition border border-cream-200 dark:border-forest-700 shadow-2xs group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=120&q=80"
                        alt="Paneer Masala"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-lime-500/50 group-hover:scale-110 transition"
                      />
                      <span>Paneer Masala</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadRecipePreset('biryani')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-forest-750 transition border border-cream-200 dark:border-forest-700 shadow-2xs group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=120&q=80"
                        alt="Dum Biryani"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-lime-500/50 group-hover:scale-110 transition"
                      />
                      <span>Dum Biryani</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => loadRecipePreset('chai')}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-forest-750 transition border border-cream-200 dark:border-forest-700 shadow-2xs group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=120&q=80"
                        alt="Masala Chai"
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-lime-500/50 group-hover:scale-110 transition"
                      />
                      <span>Masala Chai</span>
                    </button>
                  </div>
                </div>

                {/* Dish name & selling price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                      Dish Name / Menu Item
                    </label>
                    <input
                      type="text"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                      Current Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>
                </div>

                {/* Ingredients table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-forest-800 dark:text-lime-300">
                      Raw Ingredients per Portion ({ingredients.length} items)
                    </span>
                    <button
                      type="button"
                      onClick={addIngredientRow}
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 hover:bg-forest-900 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Ingredient
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-cream-200 dark:border-forest-800 text-slate-500 dark:text-cream-400">
                          <th className="pb-2 font-bold">Ingredient</th>
                          <th className="pb-2 font-bold w-24">Qty</th>
                          <th className="pb-2 font-bold w-16">Unit</th>
                          <th className="pb-2 font-bold w-28">Cost/Unit (₹)</th>
                          <th className="pb-2 font-bold w-24">Yield Loss %</th>
                          <th className="pb-2 font-bold w-20 text-right">Row Cost</th>
                          <th className="pb-2 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-100 dark:divide-forest-850">
                        {ingredients.map((item) => {
                          const effMultiplier = 1 / Math.max(0.01, 1 - item.yieldLossPercent / 100);
                          const rowCost = Math.round(item.quantity * item.costPerUnit * effMultiplier * 100) / 100;
                          return (
                            <tr key={item.id} className="group hover:bg-cream-50/50 dark:hover:bg-forest-950/50">
                              <td className="py-2 pr-2">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateIngredient(item.id, 'name', e.target.value)}
                                  className="w-full px-2 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 font-medium"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0.001"
                                  value={item.quantity}
                                  onChange={(e) => updateIngredient(item.id, 'quantity', Number(e.target.value))}
                                  className="w-full px-2 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 font-medium"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <select
                                  value={item.unit}
                                  onChange={(e) => updateIngredient(item.id, 'unit', e.target.value)}
                                  className="w-full px-1.5 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 font-medium"
                                >
                                  <option value="kg">kg</option>
                                  <option value="g">g</option>
                                  <option value="L">L</option>
                                  <option value="ml">ml</option>
                                  <option value="pcs">pcs</option>
                                </select>
                              </td>
                              <td className="py-2 pr-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.costPerUnit}
                                  onChange={(e) => updateIngredient(item.id, 'costPerUnit', Number(e.target.value))}
                                  className="w-full px-2 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 font-medium"
                                />
                              </td>
                              <td className="py-2 pr-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="90"
                                  value={item.yieldLossPercent}
                                  onChange={(e) => updateIngredient(item.id, 'yieldLossPercent', Number(e.target.value))}
                                  className="w-full px-2 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-750 font-medium"
                                  title="Shrinkage or peeling loss percentage"
                                />
                              </td>
                              <td className="py-2 pr-2 text-right font-bold text-forest-900 dark:text-cream-50">
                                ₹{rowCost.toFixed(2)}
                              </td>
                              <td className="py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeIngredientRow(item.id)}
                                  className="p-1 text-slate-400 hover:text-red-600 transition"
                                  title="Delete ingredient"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            </div>

            {/* Right side: Real-time Unit Economic Results */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-bold text-forest-950 dark:text-cream-50">
                    Live Plate Economics
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-800 dark:text-lime-300 font-bold">
                    Target: {targetFoodCostPct}%
                  </span>
                </div>

                {/* Big Metric: Actual Food Cost % */}
                <div className="p-5 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 text-center">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-cream-400 block mb-1">
                    Actual Food Cost Percentage
                  </span>
                  <div className="text-4xl sm:text-5xl font-display font-black text-forest-950 dark:text-cream-50">
                    {foodCostCalculations.actualFoodCostPct}%
                  </div>

                  {/* Benchmark pill */}
                  <div className="mt-3">
                    {foodCostCalculations.actualFoodCostPct <= 32 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Range (28% - 32%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Margin Leak (&gt; 32%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-Metrics list */}
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-850">
                    <span className="text-slate-600 dark:text-cream-300">True Raw Plate Cost:</span>
                    <span className="font-bold text-forest-950 dark:text-cream-50">
                      ₹{foodCostCalculations.rawPlateCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-850">
                    <span className="text-slate-600 dark:text-cream-300">Gross Margin per Plate:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{foodCostCalculations.grossProfitRupees.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-forest-50 dark:bg-forest-800/60 border border-forest-200 dark:border-forest-700">
                    <span className="font-semibold text-forest-900 dark:text-lime-300">
                      Recommended Price for {targetFoodCostPct}% Cost:
                    </span>
                    <span className="text-base font-extrabold text-forest-950 dark:text-lime-400">
                      ₹{foodCostCalculations.recommendedSellingPrice}
                    </span>
                  </div>
                </div>

                {/* Link to Menu Pricing */}
                <button
                  type="button"
                  onClick={() => {
                    setBasePlateCost(Math.round(foodCostCalculations.rawPlateCost));
                    handleTabChange('menu-pricing');
                  }}
                  className="w-full py-2.5 rounded-xl bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-forest-900 dark:hover:bg-lime-300 transition cursor-pointer"
                >
                  Transfer Plate Cost to Menu Pricing <ArrowRight className="w-4 h-4" />
                </button>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================
           TAB 2: MENU-PRICING CALCULATOR
        ============================================================ */}
        {activeTab === 'menu-pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-5">
                <div>
                  <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                    Dine-In vs Aggregator Delivery Pricing Formula
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-cream-400">
                    Stop letting Swiggy & Zomato commissions (22-26%) wipe out your profit. Calculate the exact delivery markup to protect your cash margin.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                      Raw Plate Cost (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={basePlateCost}
                      onChange={(e) => setBasePlateCost(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-lime-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Dine-In Gross Margin Goal ({dineInTargetMarginPct}%)
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="85"
                        value={dineInTargetMarginPct}
                        onChange={(e) => setDineInTargetMarginPct(Number(e.target.value))}
                        className="w-full accent-forest-700 dark:accent-lime-400"
                      />
                      <span className="text-[11px] text-slate-400">Food cost target: {100 - dineInTargetMarginPct}%</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Aggregator Commission Rate ({platformCommissionPct}%)
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="32"
                        value={platformCommissionPct}
                        onChange={(e) => setPlatformCommissionPct(Number(e.target.value))}
                        className="w-full accent-forest-700 dark:accent-lime-400"
                      />
                      <span className="text-[11px] text-slate-400">Standard Indian rate: 22% - 26%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Delivery Packaging Cost per Order (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={packagingContainerCost}
                        onChange={(e) => setPackagingContainerCost(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-semibold"
                      />
                      <span className="text-[11px] text-slate-400">Container, tamper tape & carry bag</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        GST Rate ({gstRatePct}%)
                      </label>
                      <select
                        value={gstRatePct}
                        onChange={(e) => setGstRatePct(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-semibold"
                      >
                        <option value="5">5% (Standard Restaurant flat rate, No ITC)</option>
                        <option value="18">18% (Hotel banquet / catering)</option>
                        <option value="0">0% (Unregistered / Composition scheme)</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right side: Comparative Pricing Output Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6">
                <h3 className="text-base font-display font-bold text-forest-950 dark:text-cream-50">
                  Recommended Channel Price Comparison
                </h3>

                {/* Dine in Card */}
                <div className="p-4 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-lime-300">
                      Channel A: Dine-In Menu
                    </span>
                    <span className="text-xs font-semibold text-slate-400">0% Commission</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-display font-black text-forest-950 dark:text-cream-50">
                      ₹{menuPricingResults.recommendedDineInPrice}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      + ₹{menuPricingResults.dineInGstAmount} GST (Total: ₹{menuPricingResults.dineInFinalCustomerPrice})
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-cream-300 pt-1 border-t border-cream-200 dark:border-forest-850 flex justify-between">
                    <span>Net Contribution Margin:</span>
                    <span className="font-bold text-forest-900 dark:text-cream-50">
                      ₹{menuPricingResults.dineInGrossProfit} ({dineInTargetMarginPct}%)
                    </span>
                  </div>
                </div>

                {/* Online Delivery Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-lime-500/15 via-forest-500/10 to-transparent dark:from-lime-950/40 dark:to-forest-900/40 border border-lime-300 dark:border-lime-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-lime-300">
                      Channel B: Swiggy / Zomato Listing
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-lime-200 dark:bg-lime-900 text-forest-950 dark:text-lime-300">
                      +{menuPricingResults.markupPct}% Markup Needed
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-display font-black text-forest-950 dark:text-cream-50">
                      ₹{menuPricingResults.recommendedOnlinePrice}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-cream-400">
                      Platform cuts: ₹{menuPricingResults.commissionRupees}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-cream-200 pt-2 border-t border-cream-200/80 dark:border-forest-700 space-y-1">
                    <div className="flex justify-between">
                      <span>Aggregator Commission ({platformCommissionPct}%):</span>
                      <span className="font-bold text-red-600 dark:text-red-400">-₹{menuPricingResults.commissionRupees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaging Materials:</span>
                      <span className="font-bold text-red-600 dark:text-red-400">-₹{packagingContainerCost}</span>
                    </div>
                    <div className="flex justify-between font-bold text-forest-900 dark:text-lime-300 pt-1 border-t border-cream-200 dark:border-forest-800">
                      <span>Preserved Profit in Hand:</span>
                      <span>₹{menuPricingResults.onlineNetRealization}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-cream-400 italic">
                  💡 By listing at ₹{menuPricingResults.recommendedOnlinePrice} online instead of ₹{menuPricingResults.recommendedDineInPrice}, you absorb the 24% platform cut and packaging without sacrificing your cash profit.
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================
           TAB 3: MONTHLY PROFIT & BREAK-EVEN TRACKER
        ============================================================ */}
        {activeTab === 'profit-tracker' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-5">
                <div>
                  <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                    Monthly Operating Expenses & Sales Inputs
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-cream-400">
                    Model your entire monthly cash flow to find out your true Net Margin and Daily Break-even covers.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Revenue & Food Cost */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Total Monthly Sales / Billing (₹)
                      </label>
                      <input
                        type="number"
                        min="10000"
                        step="5000"
                        value={monthlySales}
                        onChange={(e) => setMonthlySales(Math.max(1000, Number(e.target.value)))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Average Food Cost ({foodCostRatioPct}%)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="48"
                        value={foodCostRatioPct}
                        onChange={(e) => setFoodCostRatioPct(Number(e.target.value))}
                        className="w-full accent-forest-700 dark:accent-lime-400"
                      />
                      <span className="text-[11px] text-slate-400">Target is 28% - 32%</span>
                    </div>
                  </div>

                  {/* Delivery split & AOV */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Online Delivery Share ({deliverySharePct}% of sales)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={deliverySharePct}
                        onChange={(e) => setDeliverySharePct(Number(e.target.value))}
                        className="w-full accent-forest-700 dark:accent-lime-400"
                      />
                      <span className="text-[11px] text-slate-400">Dine-in is {100 - deliverySharePct}%</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                        Average Order Value / Ticket Size (₹)
                      </label>
                      <input
                        type="number"
                        min="50"
                        value={avgOrderValueAOV}
                        onChange={(e) => setAvgOrderValueAOV(Math.max(10, Number(e.target.value)))}
                        className="w-full px-3.5 py-2 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-forest-950 dark:text-cream-50 text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {/* Fixed Costs Section */}
                  <div className="pt-3 border-t border-cream-200 dark:border-forest-800 space-y-3">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-forest-800 dark:text-lime-300 block">
                      Fixed Monthly Overheads
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-cream-300 mb-1">
                          Monthly Rent (₹)
                        </label>
                        <input
                          type="number"
                          value={rentExpense}
                          onChange={(e) => setRentExpense(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-cream-300 mb-1">
                          Staff Salaries (₹)
                        </label>
                        <input
                          type="number"
                          value={staffSalariesExpense}
                          onChange={(e) => setStaffSalariesExpense(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-cream-300 mb-1">
                          LPG Gas, Power & Water (₹)
                        </label>
                        <input
                          type="number"
                          value={utilitiesExpense}
                          onChange={(e) => setUtilitiesExpense(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-cream-300 mb-1">
                          Owner Monthly Salary (₹)
                        </label>
                        <input
                          type="number"
                          value={ownerSalaryExpense}
                          onChange={(e) => setOwnerSalaryExpense(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right side: P&L Summary & Daily Break-even */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6 sticky top-24">
                
                {/* Net Profit Big Banner */}
                <div
                  className={`p-5 rounded-2xl border text-center ${
                    profitTrackerResults.netProfitRupees >= 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold tracking-wider block mb-1">
                    Estimated Monthly Net Profit
                  </span>
                  <div className="text-3xl sm:text-4xl font-display font-black">
                    ₹{profitTrackerResults.netProfitRupees.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs font-bold block mt-1">
                    Net Margin: {profitTrackerResults.netMarginPct}%
                  </span>
                </div>

                {/* Breakdown metrics */}
                <div className="space-y-2.5 text-xs sm:text-sm">
                  <div className="flex justify-between p-2.5 rounded-xl bg-cream-50 dark:bg-forest-950">
                    <span className="text-slate-600 dark:text-cream-300">Gross Profit (Sales - Food Cost):</span>
                    <span className="font-bold text-forest-950 dark:text-cream-50">
                      ₹{profitTrackerResults.grossProfitRupees.toLocaleString('en-IN')} ({profitTrackerResults.grossMarginPct}%)
                    </span>
                  </div>

                  <div className="flex justify-between p-2.5 rounded-xl bg-cream-50 dark:bg-forest-950">
                    <span className="text-slate-600 dark:text-cream-300">Fixed Overheads (Rent, Staff, Utilities):</span>
                    <span className="font-bold text-slate-800 dark:text-cream-100">
                      ₹{profitTrackerResults.fixedOverheads.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between p-2.5 rounded-xl bg-cream-50 dark:bg-forest-950">
                    <span className="text-slate-600 dark:text-cream-300">Delivery Platform Commissions & Packaging:</span>
                    <span className="font-bold text-slate-800 dark:text-cream-100">
                      ₹{(profitTrackerResults.platformCommissionExpense + profitTrackerResults.packagingExpense).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Daily Break-Even Target Card */}
                <div className="p-4 rounded-2xl bg-forest-900 dark:bg-forest-800 text-cream-50 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-lime-400 block">
                    Daily Survival Threshold (Break-Even)
                  </span>
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-forest-700">
                    <div>
                      <span className="text-[11px] text-cream-300 block">Daily Sales Target:</span>
                      <span className="text-lg font-bold text-lime-300">
                        ₹{profitTrackerResults.dailyBreakEvenSales.toLocaleString('en-IN')} / day
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-cream-300 block">Customer Covers Needed:</span>
                      <span className="text-lg font-bold text-cream-50">
                        {profitTrackerResults.dailyCoversNeeded} orders / day
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-cream-300 italic">
                    Hitting {profitTrackerResults.dailyCoversNeeded} orders at ₹{avgOrderValueAOV} AOV pays all salaries and rent without dipping into owner savings.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================
           TAB 4: PANTRY INVENTORY TRACKER
        ============================================================ */}
        {activeTab === 'inventory-tracker' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top stats bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-forest-900 p-5 rounded-2xl border border-cream-200 dark:border-forest-800 shadow-xs">
                <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-cream-400 block mb-1">
                  Total Pantry Stock Value
                </span>
                <span className="text-2xl sm:text-3xl font-display font-black text-forest-950 dark:text-cream-50">
                  ₹{pantryCalculations.totalStockValue.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 block mt-1">Across {pantryCalculations.totalItems} pantry SKUs</span>
              </div>

              <div className="bg-white dark:bg-forest-900 p-5 rounded-2xl border border-cream-200 dark:border-forest-800 shadow-xs">
                <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-cream-400 block mb-1">
                  Reorder Alerts Triggered
                </span>
                <span className="text-2xl sm:text-3xl font-display font-black text-amber-600 dark:text-amber-400">
                  {pantryCalculations.lowStockCount} Items
                </span>
                <span className="text-xs text-slate-400 block mt-1">At or below minimum stock threshold</span>
              </div>

              <div className="bg-white dark:bg-forest-900 p-5 rounded-2xl border border-cream-200 dark:border-forest-800 shadow-xs">
                <span className="text-xs uppercase font-extrabold text-slate-500 dark:text-cream-400 block mb-1">
                  Food Spoilage Logged
                </span>
                <span className="text-2xl sm:text-3xl font-display font-black text-red-600 dark:text-red-400">
                  ₹{wastageRupeesLogged.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 block mt-1">Discarded / sour batches logged</span>
              </div>
            </div>

            {/* Main Inventory Card */}
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-6">
              
              {/* Add Item form */}
              <form onSubmit={addPantryItem} className="p-4 rounded-2xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-800 space-y-3">
                <span className="text-xs uppercase font-extrabold tracking-wider text-forest-800 dark:text-lime-300 block">
                  Add New Ingredient / Stock Item
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Item name (e.g. Kasuri Methi)"
                      value={newPantryName}
                      onChange={(e) => setNewPantryName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <select
                      value={newPantryCategory}
                      onChange={(e) => setNewPantryCategory(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                    >
                      <option value="Dairy">Dairy</option>
                      <option value="Poultry">Poultry / Meat</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Grains">Grains & Flour</option>
                      <option value="Oils">Oils & Ghee</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Spices">Spices</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Cost / Unit (₹)"
                      value={newPantryCost}
                      onChange={(e) => setNewPantryCost(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Current Stock"
                      value={newPantryStock}
                      onChange={(e) => setNewPantryStock(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-forest-900 border border-cream-200 dark:border-forest-700 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-1.5 rounded-lg bg-forest-800 text-cream-50 dark:bg-lime-400 dark:text-forest-950 font-bold text-xs hover:bg-forest-900 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Save Item
                    </button>
                  </div>
                </div>
              </form>

              {/* Table of pantry items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-cream-200 dark:border-forest-800 text-slate-500 dark:text-cream-400">
                      <th className="pb-3 font-bold">Item Name</th>
                      <th className="pb-3 font-bold">Category</th>
                      <th className="pb-3 font-bold">Unit Cost</th>
                      <th className="pb-3 font-bold">Current In Stock</th>
                      <th className="pb-3 font-bold">Reorder Level</th>
                      <th className="pb-3 font-bold">Total Rupee Value</th>
                      <th className="pb-3 font-bold text-center">Stock Adjustment</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100 dark:divide-forest-850">
                    {pantryItems.map((item) => {
                      const isLow = item.currentStock <= item.minReorderLevel;
                      const lineValue = Math.round(item.currentStock * item.costPerUnit);
                      return (
                        <tr key={item.id} className="hover:bg-cream-50/50 dark:hover:bg-forest-950/50">
                          <td className="py-3 font-bold text-forest-950 dark:text-cream-50">
                            {item.name}
                            {isLow && (
                              <span className="ml-2 inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                                Reorder Needed
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-slate-500 dark:text-cream-400">{item.category}</td>
                          <td className="py-3 font-semibold">₹{item.costPerUnit} / {item.unit}</td>
                          <td className="py-3 font-bold text-forest-900 dark:text-lime-300">
                            {item.currentStock} {item.unit}
                          </td>
                          <td className="py-3 text-slate-500">{item.minReorderLevel} {item.unit}</td>
                          <td className="py-3 font-bold text-forest-950 dark:text-cream-50">₹{lineValue.toLocaleString('en-IN')}</td>
                          <td className="py-3 text-center">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updatePantryStock(item.id, -1)}
                                className="w-6 h-6 rounded bg-cream-100 dark:bg-forest-800 hover:bg-cream-200 font-bold"
                                title="Decrease stock by 1 unit"
                              >
                                -
                              </button>
                              <button
                                type="button"
                                onClick={() => updatePantryStock(item.id, 1)}
                                className="w-6 h-6 rounded bg-cream-100 dark:bg-forest-800 hover:bg-cream-200 font-bold"
                                title="Increase stock by 1 unit"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => logWastage(item)}
                                className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline"
                                title="Log spoilage/sour batch"
                              >
                                Waste
                              </button>
                              <button
                                type="button"
                                onClick={() => removePantryItem(item.id)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================
           TAB 5: BRAND-NAME BRAINSTORMING TOOL
        ============================================================ */}
        {activeTab === 'brand-name' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Filter controls */}
            <div className="bg-white dark:bg-forest-900 rounded-3xl p-6 sm:p-7 border border-cream-200 dark:border-forest-800 shadow-sm space-y-5">
              <div>
                <h3 className="text-lg font-display font-bold text-forest-950 dark:text-cream-50">
                  Culinary Concept & Brand Proposition Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-cream-400">
                  Generate memorable Indian restaurant names, taglines, hero dishes, and Instagram positioning pitches tailored to your culinary niche.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                    Cuisine / Specialty
                  </label>
                  <select
                    value={selectedCuisine}
                    onChange={(e) => setSelectedCuisine(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs sm:text-sm font-semibold"
                  >
                    <option value="North Indian & Mughlai">North Indian & Mughlai</option>
                    <option value="South Indian Tiffin & Filter Coffee">South Indian Tiffin & Filter Coffee</option>
                    <option value="Dum Biryani & Kebab Specialist">Dum Biryani & Kebab Specialist</option>
                    <option value="Chai & Street Food Snacks">Chai & Street Food Snacks</option>
                    <option value="Cloud Kitchen Burgers & Rolls">Cloud Kitchen Burgers & Rolls</option>
                    <option value="Indo-Chinese & Momos">Indo-Chinese & Momos</option>
                    <option value="Artisanal Cafe & Bakery">Artisanal Cafe & Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                    Brand Vibe / Concept
                  </label>
                  <select
                    value={selectedVibe}
                    onChange={(e) => setSelectedVibe(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs sm:text-sm font-semibold"
                  >
                    <option value="Heritage & Royal">Heritage & Royal Tradition</option>
                    <option value="Modern Quirky & Trendy">Modern Quirky & Trendy</option>
                    <option value="Farm Fresh & Organic">Farm Fresh & Desi Ghee</option>
                    <option value="Pocket-Friendly Dhaba">Pocket-Friendly Dhaba & Express</option>
                    <option value="Late Night Cravings">Late Night Street Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-cream-200 mb-1">
                    Target Region / Market
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-forest-950 border border-cream-200 dark:border-forest-700 text-xs sm:text-sm font-semibold"
                  >
                    <option value="Delhi-NCR">Delhi-NCR (Old Delhi & Cybercity)</option>
                    <option value="Mumbai & MMR">Mumbai & MMR (Coastal & Fast Paced)</option>
                    <option value="Bengaluru">Bengaluru (Tech Hub & Breweries)</option>
                    <option value="Hyderabad">Hyderabad (Deccani Flavors)</option>
                    <option value="Pune">Pune (College & IT Suburbs)</option>
                    <option value="Tier-2 Growth Towns">Tier-2 Growth Towns (High Street Hubs)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Generated brand concept tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandIdeas.map((brand, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-forest-900 rounded-3xl border border-cream-200 dark:border-forest-800 shadow-sm flex flex-col justify-between hover:shadow-md transition overflow-hidden group"
                >
                  {/* Photo Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-forest-950">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/30 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-forest-950/70 text-lime-300 backdrop-blur-xs border border-lime-400/30">
                        Concept #{idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-cream-100 bg-forest-950/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        {brand.igHandle}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <h4 className="text-xl sm:text-2xl font-display font-black text-cream-50 drop-shadow-sm">
                        {brand.name}
                      </h4>
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-cream-200 italic mb-3">
                        "{brand.tagline}"
                      </p>

                      <div className="pt-2 border-t border-cream-100 dark:border-forest-800 space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-forest-800 dark:text-lime-300 block">
                            Hero Signature Dish:
                          </span>
                          <span className="text-slate-700 dark:text-cream-100 font-medium">{brand.heroDish}</span>
                        </div>
                        <div>
                          <span className="font-bold text-forest-800 dark:text-lime-300 block">
                            Market Positioning Pitch:
                          </span>
                          <span className="text-slate-600 dark:text-cream-300 leading-relaxed">
                            {brand.positioning}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-cream-100 dark:border-forest-800">
                      <button
                        type="button"
                        onClick={() => copyBrandCard(brand, idx)}
                        className="w-full py-2.5 rounded-xl bg-cream-100 dark:bg-forest-800 text-forest-900 dark:text-cream-100 text-xs font-bold hover:bg-cream-200 dark:hover:bg-forest-750 transition flex items-center justify-center gap-1.5 cursor-pointer border border-cream-200/50 dark:border-forest-700/50"
                      >
                        {copiedBrandIdx === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" /> Copied Concept!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Brand Concept
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
