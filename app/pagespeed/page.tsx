"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  ChevronRight,
  Globe,
  Zap,
  Eye,
  Shield,
  Search,
} from "lucide-react";

// Define a more robust type for the results. All properties are optional
// to prevent crashes if the API response is missing data.
interface LighthouseResult {
  lighthouseResult?: {
    categories?: {
      performance?: { score: number };
      accessibility?: { score: number };
      "best-practices"?: { score: number };
      seo?: { score: number };
    };
    audits?: {
      "largest-contentful-paint"?: { displayValue: string };
      "cumulative-layout-shift"?: { displayValue: string };
      "total-blocking-time"?: { displayValue: string };
      "first-contentful-paint"?: { displayValue: string };
    };
  };
  // Add a property to catch errors returned by the Google API itself
  error?: {
    message: string;
  };
}

interface Flash {
  type: "success" | "error" | "info";
  message: string;
}

export default function PageSpeedPage() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<LighthouseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<Flash | null>(null);

  // Helper function to normalize URL
  const normalizeUrl = (inputUrl: string): string => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return "";

    // If it already has a protocol, return as is
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    // Add https:// by default
    return `https://${trimmed}`;
  };

  // Helper function to validate URL
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    setFlash(null);

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl || !isValidUrl(normalizedUrl)) {
      setFlash({
        type: "error",
        message:
          "Please enter a valid URL (e.g., example.com or https://www.example.com)",
      });
      setLoading(false);
      return;
    }

    try {
      // Call our internal API route with the normalized URL
      const response = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(normalizedUrl)}`
      );

      const data: LighthouseResult = await response.json();

      // Handle errors returned within the API response body
      if (data.error) {
        throw new Error(data.error.message);
      }

      // Handle cases where the analysis runs but produces no results
      if (!data.lighthouseResult) {
        throw new Error(
          "Analysis failed. The website might be blocking automated tools or is not publicly accessible."
        );
      }

      setResults(data);
      setFlash({
        type: "success",
        message: "Website analysis completed successfully!",
      });
    } catch (err) {
      // Type-safe error handling to resolve the 'no-explicit-any' ESLint rule.
      if (err instanceof Error) {
        setFlash({ type: "error", message: err.message });
      } else {
        setFlash({ type: "error", message: "An unknown error occurred." });
      }
    } finally {
      setLoading(false);
    }
  };

  // A helper component to display scores safely
  const Score = ({
    title,
    score,
    icon,
  }: {
    title: string;
    score: number | undefined;
    icon: React.ReactNode;
  }) => {
    // Default to 0 if the score is missing, preventing a crash
    const scoreIn100 = Math.round((score || 0) * 100);
    const getScoreColor = (s: number) => {
      if (s >= 90) return "text-green-600 dark:text-green-400";
      if (s >= 50) return "text-yellow-500 dark:text-yellow-400";
      return "text-red-600 dark:text-red-400";
    };

    const getScoreBg = (s: number) => {
      if (s >= 90)
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      if (s >= 50)
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    };

    return (
      <div
        className={`p-6 rounded-xl border shadow-lg transition-all hover:shadow-xl ${getScoreBg(
          scoreIn100
        )}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
            {icon}
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(scoreIn100)}`}>
            {scoreIn100}
          </div>
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-6xl">
        {/* Breadcrumbs Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <HomeIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </li>
            <li>
              <span
                className="font-medium text-slate-700 dark:text-slate-200"
                aria-current="page"
              >
                Performance Checker
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Website Performance Checker
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Analyze your website&apos;s performance, accessibility, and SEO
                metrics
              </p>
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {flash && (
          <div
            className={`mb-6 rounded-xl p-4 shadow-lg border-l-4 transition-all duration-300 ${
              flash.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-300"
                : flash.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-300"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {flash.type === "success" ? (
                  <span className="text-lg">✅</span>
                ) : flash.type === "error" ? (
                  <span className="text-lg">❌</span>
                ) : (
                  <span className="text-lg">ℹ️</span>
                )}
                <span className="font-medium">{flash.message}</span>
              </div>
              <button
                onClick={() => setFlash(null)}
                className="hover:opacity-70 transition-opacity"
              >
                <span className="text-lg">✖️</span>
              </button>
            </div>
          </div>
        )}

        {/* Analysis Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 lg:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <span>🔍</span>
            Analyze Website
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website URL *
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com or https://www.example.com"
                  className="flex-1 p-3 lg:p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !url}
                  className="px-6 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg min-w-[140px]"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Analyze
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter a domain (example.com) or full URL (https://example.com).
                HTTPS will be used by default.
              </p>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {results?.lighthouseResult && (
          <div className="space-y-8 animate-fade-in">
            {/* Performance Scores */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span>📊</span>
                Performance Scores
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Score
                  title="Performance"
                  score={
                    results.lighthouseResult?.categories?.performance?.score
                  }
                  icon={
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  }
                />
                <Score
                  title="Accessibility"
                  score={
                    results.lighthouseResult?.categories?.accessibility?.score
                  }
                  icon={
                    <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                  }
                />
                <Score
                  title="Best Practices"
                  score={
                    results.lighthouseResult?.categories?.["best-practices"]
                      ?.score
                  }
                  icon={
                    <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  }
                />
                <Score
                  title="SEO"
                  score={results.lighthouseResult?.categories?.seo?.score}
                  icon={
                    <Search className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  }
                />
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span>⚡</span>
                Core Web Vitals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <span className="text-white text-sm font-bold">LCP</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Largest Contentful Paint
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {results.lighthouseResult?.audits?.[
                      "largest-contentful-paint"
                    ]?.displayValue ?? "N/A"}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <span className="text-white text-sm font-bold">FCP</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        First Contentful Paint
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">
                    {results.lighthouseResult?.audits?.[
                      "first-contentful-paint"
                    ]?.displayValue ?? "N/A"}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <span className="text-white text-sm font-bold">CLS</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cumulative Layout Shift
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                    {results.lighthouseResult?.audits?.[
                      "cumulative-layout-shift"
                    ]?.displayValue ?? "N/A"}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <span className="text-white text-sm font-bold">TBT</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Blocking Time
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {results.lighthouseResult?.audits?.["total-blocking-time"]
                      ?.displayValue ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Enter a website URL above to get detailed performance
                  insights, accessibility scores, and SEO recommendations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
