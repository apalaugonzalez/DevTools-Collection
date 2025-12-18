"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  ChevronRight,
  Zap,
  Eye,
  Shield,
  Search,
  Activity,
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

// --- Terminal Sub-Components ---

/**
 * Terminal-style toast notification
 */
const TerminalToast = ({
  flash,
  onClose,
}: {
  flash: Flash;
  onClose: () => void;
}) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
    <div
      className={`border font-mono text-sm py-2 px-4 shadow-lg flex items-center space-x-2 ${flash.type === "success"
        ? "bg-black border-green-500 text-green-400 shadow-green-500/20"
        : flash.type === "error"
          ? "bg-black border-red-500 text-red-400 shadow-red-500/20"
          : "bg-black border-blue-500 text-blue-400 shadow-blue-500/20"
        }`}
    >
      <span
        className={
          flash.type === "success"
            ? "text-green-500"
            : flash.type === "error"
              ? "text-red-500"
              : "text-blue-500"
        }
      >
        $
      </span>
      <span>{flash.message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        ✕
      </button>
    </div>
  </div>
);

/**
 * Terminal loading animation
 */
const TerminalLoader = ({ url }: { url: string }) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-1 text-blue-400 font-mono text-sm">
      <span>analyzing {url}</span>
      <div className="flex space-x-1">
        <span className="animate-pulse">.</span>
        <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>
          .
        </span>
        <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>
          .
        </span>
      </div>
    </div>
    <div className="text-gray-500 font-mono text-xs space-y-1">
      <div>→ lighthouse audit initiated</div>
      <div>→ performance metrics collection</div>
      <div>→ accessibility evaluation</div>
      <div>→ seo analysis in progress</div>
    </div>
    {/* New Progress Bar */}
    <div className="w-full bg-gray-800 border border-gray-700 mt-2 p-0.5">
      <div className="bg-blue-500 h-1 animate-progress"></div>
    </div>
    <div className="text-blue-600 text-xs text-center">
      [ AUDIT IN PROGRESS ]
    </div>
  </div>
);

/**
 * Terminal-style performance score display
 */
const TerminalScore = ({
  title,
  score,
  icon,
  metric,
}: {
  title: string;
  score: number | undefined;
  icon: React.ReactNode;
  metric: string;
}) => {
  const scoreIn100 = Math.round((score || 0) * 100);

  const getScoreStatus = (s: number) => {
    if (s >= 90)
      return {
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500",
        status: "EXCELLENT",
      };
    if (s >= 50)
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500",
        status: "NEEDS WORK",
      };
    return {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500",
      status: "POOR",
    };
  };

  const { color, bg, border, status } = getScoreStatus(scoreIn100);

  return (
    <div
      className={`border ${border} ${bg} p-4 transition-all hover:bg-opacity-20`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-gray-400">{icon}</div>
          <span className="font-mono text-sm text-gray-300">{metric}</span>
        </div>
        <div className={`font-mono text-lg font-bold ${color}`}>
          {scoreIn100}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-gray-400">{title}</span>
        <span
          className={`font-mono text-xs px-2 py-1 border ${border} ${color}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

/**
 * Terminal-style Core Web Vitals display
 */
const TerminalVital = ({
  name,
  value,
  description,
  color,
}: {
  name: string;
  value: string;
  description: string;
  color: string;
}) => (
  <div
    className={`border border-gray-700 bg-gray-900/50 p-4 hover:border-${color}-500 transition-all group`}
  >
    <div className="flex items-center justify-between mb-2">
      <div
        className={`px-2 py-1 font-mono text-xs border border-${color}-500 text-${color}-400 bg-${color}-500/10`}
      >
        {name}
      </div>
      <div className={`font-mono text-lg font-bold text-${color}-400`}>
        {value || "N/A"}
      </div>
    </div>
    <div className="font-mono text-xs text-gray-500">{description}</div>
  </div>
);

// --- Main Terminal Component ---
export default function TerminalPerformanceChecker() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<LighthouseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateCursor = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCursorPos(target.selectionStart || 0);
  };

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

    const startTime = Date.now();
    const minLoadingTime = 4000; // Match CSS animation duration

    const normalizedUrl = normalizeUrl(url);

    if (!normalizedUrl || !isValidUrl(normalizedUrl)) {
      setFlash({
        type: "error",
        message:
          "Error: Invalid URL format. Use example.com or https://example.com",
      });
      setLoading(false);
      return;
    }

    const command = `lighthouse ${normalizedUrl} --output=json`;
    setCommandHistory((prev) => [...prev, command]);
    setCursorPos(0);

    try {
      const response = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(normalizedUrl)}`
      );
      const data: LighthouseResult = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      if (!data.lighthouseResult) {
        throw new Error(
          "Analysis failed. Target may be blocking automated tools or not publicly accessible."
        );
      }
      setResults(data);
      setFlash({
        type: "success",
        message: "Performance audit completed successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        setFlash({ type: "error", message: `Error: ${err.message}` });
      } else {
        setFlash({ type: "error", message: "Error: Unknown analysis failure" });
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = minLoadingTime - elapsedTime;

      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          inputRef.current?.focus();
          if (inputRef.current) {
            setCursorPos(inputRef.current.value.length);
          }
        }, 0);
      }, Math.max(0, remainingTime));
    }
  };

  const clearTerminal = () => {
    setResults(null);
    setFlash(null);
    setCommandHistory([]);
    setUrl("");
    setCursorPos(0);
    inputRef.current?.focus();
  };

  return (
    <>
      <style>{`
        @keyframes toast-in {
          from {
            transform: translate(-50%, 20px);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-toast-in {
          animation: toast-in 0.5s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress-bar 4s ease-out forwards;
        }
        @keyframes result-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-result-fade-in {
          animation: result-fade-in 0.5s ease-out forwards;
        }
      `}</style>

      <div className="min-h-screen bg-black text-blue-400 font-mono">
        {flash && (
          <TerminalToast flash={flash} onClose={() => setFlash(null)} />
        )}

        {/* Terminal Status Bar */}
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-blue-400">LIGHTHOUSE-AUDIT</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span className="text-gray-400">Performance Analysis</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <span>Session: {new Date().toLocaleTimeString()}</span>
                <span>Engine: Lighthouse v11</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl">
          {/* Terminal-style Breadcrumbs */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">user@system:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400">/</span>
                <Link
                  href="/"
                  className="flex items-center text-gray-400 hover:text-blue-400 transition-colors group"
                >
                  <HomeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="group-hover:underline">home</span>
                </Link>
                <span className="text-gray-600">/</span>
                <ChevronRight className="h-3 w-3 text-gray-600" />
                <span className="text-gray-600">/</span>
                <span className="font-medium text-blue-400" aria-current="page">
                  tools/lighthouse
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Current directory: /var/www/tools/lighthouse
              </div>
            </div>
          </nav>

          {/* ASCII Art Header */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-center space-y-2">
              <pre className="text-blue-500 text-xs leading-tight">
                {`
 ██╗     ██╗ ██████╗ ██╗  ██╗████████╗██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗
 ██║     ██║██╔════╝ ██║  ██║╚══██╔══╝██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝
 ██║     ██║██║  ███╗███████║   ██║   ███████║██║   ██║██║   ██║███████╗█████╗  
 ██║     ██║██║   ██║██╔══██║   ██║   ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝  
 ███████╗██║╚██████╔╝██║  ██║   ██║   ██║  ██║╚██████╔╝╚██████╔╝███████║███████╗
 ╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝
`}
              </pre>
              <div className="space-y-1 text-sm">
                <div className="text-gray-400">
                  Website Performance Audit Tool • Version 11.7.1
                </div>
                <div className="text-gray-600">
                  Automated performance, accessibility, and SEO analysis
                </div>
              </div>
            </div>
          </div>

          {/* Audit Configuration Panel */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-blue-400 font-semibold">
                AUDIT CONFIGURATION
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-gray-400">Performance Metrics:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div>
                    <span className="text-blue-400">
                      First Contentful Paint
                    </span>{" "}
                    <span className="text-gray-500">• Initial render time</span>
                  </div>
                  <div>
                    <span className="text-blue-400">
                      Largest Contentful Paint
                    </span>{" "}
                    <span className="text-gray-500">• Main content load</span>
                  </div>
                  <div>
                    <span className="text-blue-400">
                      Cumulative Layout Shift
                    </span>{" "}
                    <span className="text-gray-500">• Visual stability</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-400">Analysis Categories:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-gray-500">
                    → Performance optimization
                  </div>
                  <div className="text-gray-500">
                    → Accessibility compliance
                  </div>
                  <div className="text-gray-500">→ SEO best practices</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Terminal Interface */}
          <div className="border border-gray-700 bg-gray-900 mb-4">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">
                lighthouse-audit-v11.7.1
              </span>
              <button
                onClick={clearTerminal}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 hover:bg-gray-700 transition-colors"
              >
                clear
              </button>
            </div>

            <div className="p-4 space-y-2">
              {/* Welcome Message */}
              <div className="text-blue-500">
                <div>Lighthouse Performance Audit Tool v11.7.1</div>
                <div className="text-gray-500">
                  Configure target URL for comprehensive website analysis
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  Usage: lighthouse [url] --output=json
                  --chrome-flags=&quot;--headless&quot;
                </div>
              </div>

              {/* Command History */}
              {commandHistory.map((cmd, index) => (
                <div key={index} className="text-gray-400">
                  <span className="text-blue-500">user@lighthouse:~$</span>{" "}
                  {cmd}
                </div>
              ))}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">user@lighthouse:~$</span>
                  <span className="text-gray-400">lighthouse</span>
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        updateCursor(e);
                      }}
                      onSelect={updateCursor}
                      onKeyUp={updateCursor}
                      onClick={updateCursor}
                      placeholder="https://example.com"
                      className="w-full bg-transparent border-none outline-none text-blue-400 font-mono placeholder-gray-600 caret-transparent"
                      disabled={loading}
                      autoComplete="off"
                    />
                    {!loading && (
                      <div
                        className="absolute top-0 pointer-events-none text-blue-400 animate-blink"
                        style={{ left: `${cursorPos}ch` }}
                      >
                        █
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400">--output=json</span>
                  {!loading && (
                    <button
                      type="submit"
                      className="text-gray-500 hover:text-blue-400 transition-colors ml-4 px-2 py-1 border border-gray-700 hover:border-blue-500 text-sm"
                    >
                      [RUN]
                    </button>
                  )}
                </div>
              </form>

              {/* Loading State */}
              {loading && (
                <div className="mt-4 p-2 border-l-2 border-yellow-500 bg-yellow-500/5">
                  <TerminalLoader url={url} />
                </div>
              )}

              {/* Results Display */}
              {results?.lighthouseResult && !loading && (
                <div className="mt-6 space-y-4 animate-result-fade-in">
                  {/* Performance Scores */}
                  <div className="border border-blue-500 bg-blue-500/5">
                    <div className="bg-blue-500/10 px-3 py-2 border-b border-blue-500">
                      <span className="text-blue-400 font-semibold">
                        ✓ Performance audit completed
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <TerminalScore
                        title="Performance"
                        score={
                          results.lighthouseResult?.categories?.performance
                            ?.score
                        }
                        icon={<Zap className="h-4 w-4" />}
                        metric="PERF"
                      />
                      <TerminalScore
                        title="Accessibility"
                        score={
                          results.lighthouseResult?.categories?.accessibility
                            ?.score
                        }
                        icon={<Eye className="h-4 w-4" />}
                        metric="A11Y"
                      />
                      <TerminalScore
                        title="Best Practices"
                        score={
                          results.lighthouseResult?.categories?.[
                            "best-practices"
                          ]?.score
                        }
                        icon={<Shield className="h-4 w-4" />}
                        metric="BP"
                      />
                      <TerminalScore
                        title="SEO"
                        score={results.lighthouseResult?.categories?.seo?.score}
                        icon={<Search className="h-4 w-4" />}
                        metric="SEO"
                      />
                    </div>
                  </div>

                  {/* Core Web Vitals */}
                  <div className="border border-green-500 bg-green-500/5">
                    <div className="bg-green-500/10 px-3 py-2 border-b border-green-500">
                      <span className="text-green-400 font-semibold">
                        ⚡ Core Web Vitals Analysis
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <TerminalVital
                        name="LCP"
                        value={
                          results.lighthouseResult?.audits?.[
                            "largest-contentful-paint"
                          ]?.displayValue || "N/A"
                        }
                        description="Largest Contentful Paint"
                        color="blue"
                      />
                      <TerminalVital
                        name="FCP"
                        value={
                          results.lighthouseResult?.audits?.[
                            "first-contentful-paint"
                          ]?.displayValue || "N/A"
                        }
                        description="First Contentful Paint"
                        color="green"
                      />
                      <TerminalVital
                        name="CLS"
                        value={
                          results.lighthouseResult?.audits?.[
                            "cumulative-layout-shift"
                          ]?.displayValue || "N/A"
                        }
                        description="Cumulative Layout Shift"
                        color="purple"
                      />
                      <TerminalVital
                        name="TBT"
                        value={
                          results.lighthouseResult?.audits?.[
                            "total-blocking-time"
                          ]?.displayValue || "N/A"
                        }
                        description="Total Blocking Time"
                        color="orange"
                      />
                    </div>
                  </div>

                  <div className="px-3 py-2 border-t border-green-600 text-green-600 text-sm">
                    Lighthouse audit completed successfully (exit code 0)
                  </div>
                </div>
              )}



            </div>
          </div>

          {/* Terminal Footer */}
          <div className="text-center space-y-2">
            <div className="text-gray-600 text-xs">
              <span className="text-gray-500">©</span> 2024 Lighthouse Audit
              Terminal •
              <span className="text-blue-600"> Performance Analysis</span> •
              <span className="text-green-500"> Web Optimization</span>
            </div>
            <div className="text-gray-700 text-xs">
              Powered by Google Lighthouse • Chrome DevTools Protocol
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
