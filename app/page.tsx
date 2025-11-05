"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Mail,
  Search,
  Layers,
  Globe,
  ScanLine,
  Monitor,
  Zap,
  Clock,
  TrendingUp,
  Shield,
  Code,
  Database,
  Wifi,
  Activity,
  ChevronRight,
  Sparkles,
  Terminal,
  Grid3X3,
  List,
  Filter,
} from "lucide-react";
import Link from "next/link";

// Tool categories for better organization
const toolCategories = {
  analysis: {
    name: "Analysis",
    icon: Monitor,
    color: "from-blue-500 to-cyan-400",
    count: 0,
  },
  network: {
    name: "Network",
    icon: Wifi,
    color: "from-green-500 to-emerald-400",
    count: 0,
  },
  communication: {
    name: "Communication",
    icon: Mail,
    color: "from-purple-500 to-pink-400",
    count: 0,
  },
  security: {
    name: "Security",
    icon: Shield,
    color: "from-red-500 to-orange-400",
    count: 0,
  },
};

// Enhanced tool data
const tools = [
  {
    id: "email-finder",
    name: "Email Finder",
    description: "Discover email addresses associated with any domain name",
    href: "/email-finder-by-domain",
    icon: Search,
    category: "communication",
    estimatedTime: "< 30s",
    tags: ["email", "domain", "lookup"],
  },
  {
    id: "html-email",
    name: "HTML Email Sender",
    description:
      "Compose and send beautiful HTML emails directly from your browser",
    href: "/send-html-email",
    icon: Mail,
    category: "communication",
    estimatedTime: "2-5 min",
    tags: ["email", "html", "send"],
  },
  {
    id: "cms-detector",
    name: "CMS Detector",
    description: "Identify the Content Management System powering any website",
    href: "/what-cms",
    icon: Layers,
    category: "analysis",
    estimatedTime: "< 15s",
    tags: ["cms", "website", "detect"],
  },
  {
    id: "ip-lookup",
    name: "IP Address Lookup",
    description:
      "Instantly discover your public IP address and network information",
    href: "/what-is-my-ip",
    icon: Globe,
    category: "network",
    estimatedTime: "Instant",
    tags: ["ip", "network", "location"],
  },
  {
    id: "port-scanner",
    name: "Port Scanner",
    description: "Scan and analyze open ports on any host or IP address",
    href: "/find-open-ports",
    icon: ScanLine,
    category: "security",
    estimatedTime: "30s - 2min",
    tags: ["port", "scan", "security"],
  },
  {
    id: "tech-scanner",
    name: "Tech Stack Analyzer",
    description:
      "Deep analysis of website technologies, frameworks, and libraries",
    href: "/analyzer",
    icon: Terminal,
    category: "analysis",
    estimatedTime: "< 20s",
    tags: ["tech", "framework", "analyze"],
  },
  {
    id: "pagespeed",
    name: "Performance Insights",
    description:
      "Comprehensive website performance, accessibility, and SEO analysis",
    href: "/pagespeed",
    icon: Zap,
    category: "analysis",
    estimatedTime: "30-60s",
    tags: ["performance", "seo", "speed"],
  },
];

// Update category counts
Object.keys(toolCategories).forEach((key) => {
  toolCategories[key as keyof typeof toolCategories].count = tools.filter(
    (tool) => tool.category === key
  ).length;
});

// Statistics for the dashboard
const stats = [
  { label: "Tools", value: tools.length.toString(), icon: Code },
  {
    label: "Categories",
    value: Object.keys(toolCategories).length.toString(),
    icon: Database,
  },
  { label: "Avg Time", value: "< 30s", icon: Activity },
  { label: "Uptime", value: "99.9%", icon: TrendingUp },
];

export default function SmartDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter tools based on category and search
  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      !selectedCategory || tool.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Load recently used tools from localStorage
  useEffect(() => {
    const recent = localStorage.getItem("recentlyUsedTools");
    if (recent) {
      setRecentlyUsed(JSON.parse(recent));
    }
  }, []);

  const handleToolClick = (toolId: string) => {
    const updatedRecent = [
      toolId,
      ...recentlyUsed.filter((id) => id !== toolId),
    ].slice(0, 4);
    setRecentlyUsed(updatedRecent);
    localStorage.setItem("recentlyUsedTools", JSON.stringify(updatedRecent));
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Compact Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
              <Sparkles className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Professional IT Tools
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent pb-3">
              IT Tools Hub
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              Professional tools for developers and IT professionals
            </p>

            {/* Compact Stats */}
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-slate-200 dark:border-slate-700"
                >
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Smart Control Bar */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-8 sticky top-4 z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-1 items-center space-x-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center space-x-2 ${
                  selectedCategory || showFilters
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-3">
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  Clear filters
                </button>
              )}

              <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters (Collapsible) */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-2">
                {Object.entries(toolCategories).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={key}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === key ? null : key
                        )
                      }
                      className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 text-sm ${
                        selectedCategory === key
                          ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      <IconComponent className="h-3 w-3" />
                      <span>{category.name}</span>
                      <span className="text-xs opacity-75">
                        ({category.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Recently Used (Compact) */}
        {recentlyUsed.length > 0 && !searchQuery && !selectedCategory && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Recently Used
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {recentlyUsed.slice(0, 4).map((toolId) => {
                const tool = tools.find((t) => t.id === toolId);
                if (!tool) return null;

                const category =
                  toolCategories[tool.category as keyof typeof toolCategories];
                const IconComponent = tool.icon;

                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={() => handleToolClick(tool.id)}
                    className="group block"
                  >
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-lg transition-all group-hover:scale-[1.02]">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}
                        >
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-800 dark:text-white text-sm truncate">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {tool.estimatedTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Tools Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              {selectedCategory
                ? `${
                    toolCategories[
                      selectedCategory as keyof typeof toolCategories
                    ].name
                  } Tools`
                : searchQuery
                ? `Search Results (${filteredTools.length})`
                : "All Tools"}
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                No tools found
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const category =
                  toolCategories[tool.category as keyof typeof toolCategories];
                const IconComponent = tool.icon;

                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={() => handleToolClick(tool.id)}
                    className="group block"
                  >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                          <Activity className="h-3 w-3" />
                          <span>{tool.estimatedTime}</span>
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          Launch →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTools.map((tool) => {
                const category =
                  toolCategories[tool.category as keyof typeof toolCategories];
                const IconComponent = tool.icon;

                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    onClick={() => handleToolClick(tool.id)}
                    className="group block"
                  >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all group-hover:scale-[1.01]">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${category.color} flex-shrink-0`}
                        >
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                              {tool.name}
                            </h3>
                            <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                              <span>{tool.estimatedTime}</span>
                              <ChevronRight className="h-4 w-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
