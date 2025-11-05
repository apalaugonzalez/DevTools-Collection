"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home as HomeIcon,
  Terminal,
  Search,
  Code,
  Database,
  Server,
} from "lucide-react";

// --- Type Definitions ---
interface IAnalysisResults {
  analyzedUrl: string;
  detected: string[];
}

interface Flash {
  type: "success" | "error" | "info";
  message: string;
}

// --- Data for Common URLs ---
const commonUrls = [
  { name: "Next.js", url: "nextjs.org", category: "framework" },
  { name: "React", url: "react.dev", category: "library" },
  { name: "Vue.js", url: "vuejs.org", category: "framework" },
  { name: "Angular", url: "angular.io", category: "framework" },
  { name: "Svelte", url: "svelte.dev", category: "framework" },
  { name: "WordPress", url: "wordpress.com", category: "cms" },
  { name: "Shopify", url: "shopify.com", category: "ecommerce" },
  { name: "GitHub", url: "github.com", category: "platform" },
  { name: "Vercel", url: "vercel.com", category: "hosting" },
  { name: "Netlify", url: "netlify.com", category: "hosting" },
];

// Technology categorization and styling
const techCategories: {
  [key: string]: { color: string; icon: string; category: string };
} = {
  "Next.js": { color: "text-white", icon: "⚛️", category: "Framework" },
  React: { color: "text-cyan-400", icon: "⚛️", category: "Library" },
  "Vue.js": { color: "text-green-400", icon: "🟢", category: "Framework" },
  Angular: { color: "text-red-400", icon: "🅰️", category: "Framework" },
  WordPress: { color: "text-blue-400", icon: "📝", category: "CMS" },
  Shopify: { color: "text-green-400", icon: "🛒", category: "E-commerce" },
  Wix: { color: "text-yellow-400", icon: "🎨", category: "Website Builder" },
  Squarespace: {
    color: "text-gray-400",
    icon: "⬛",
    category: "Website Builder",
  },
  Gatsby: { color: "text-purple-400", icon: "🚀", category: "Framework" },
  SvelteKit: { color: "text-orange-400", icon: "🔥", category: "Framework" },
  PHP: { color: "text-indigo-400", icon: "🐘", category: "Language" },
  "ASP.NET": { color: "text-blue-400", icon: "🔷", category: "Framework" },
  Express: { color: "text-gray-300", icon: "🚂", category: "Backend" },
  Nginx: { color: "text-green-400", icon: "🌐", category: "Server" },
  Apache: { color: "text-red-400", icon: "🪶", category: "Server" },
  Cloudflare: { color: "text-orange-400", icon: "☁️", category: "CDN" },
  Vercel: { color: "text-white", icon: "▲", category: "Hosting" },
  Netlify: { color: "text-teal-400", icon: "🌊", category: "Hosting" },
  Bootstrap: {
    color: "text-purple-400",
    icon: "🅱️",
    category: "CSS Framework",
  },
  "Tailwind CSS": {
    color: "text-cyan-400",
    icon: "💨",
    category: "CSS Framework",
  },
  "Google Analytics": {
    color: "text-yellow-400",
    icon: "📊",
    category: "Analytics",
  },
  "Generic HTML/JS": { color: "text-gray-400", icon: "📄", category: "Static" },
};

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
      className={`border font-mono text-sm py-2 px-4 shadow-lg flex items-center space-x-2 ${
        flash.type === "success"
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
    <div className="flex items-center space-x-1 text-green-400 font-mono text-sm">
      <span>scanning {url}</span>
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
      <div>→ analyzing http headers</div>
      <div>→ parsing html structure</div>
      <div>→ detecting javascript frameworks</div>
      <div>→ identifying server technologies</div>
    </div>
  </div>
);

/**
 * Terminal-style technology result display
 */
const TechResult = ({
  tech,
  isVisible,
  index,
}: {
  tech: string;
  isVisible: boolean;
  index: number;
}) => {
  const techInfo = techCategories[tech] || {
    color: "text-gray-400",
    icon: "🔧",
    category: "Unknown",
  };

  return (
    <li
      className={`transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="border border-gray-700 bg-gray-900/50 p-3 hover:border-green-500 transition-all group">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{techInfo.icon}</span>
            <div>
              <span className={`font-mono text-sm font-bold ${techInfo.color}`}>
                {tech}
              </span>
              <div className="text-xs text-gray-500 font-mono">
                {techInfo.category}
              </div>
            </div>
          </div>
          <div className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
            ✓
          </div>
        </div>
      </div>
    </li>
  );
};

/**
 * Terminal-style common URL selector
 */
const TerminalUrlSelector = ({
  urls,
  onSelect,
}: {
  urls: typeof commonUrls;
  onSelect: (url: string) => void;
}) => (
  <div className="space-y-2">
    <div className="text-gray-400 font-mono text-xs">quick_scan_targets:</div>
    <div className="grid grid-cols-2 gap-2">
      {urls.map((site) => (
        <button
          key={site.url}
          type="button"
          onClick={() => onSelect(site.url)}
          className="text-left px-3 py-2 border border-gray-700 bg-gray-900/30 hover:border-green-500 hover:bg-green-500/10 transition-all group font-mono text-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-300 group-hover:text-green-400">
              {site.name}
            </span>
            <span className="text-xs text-gray-600 group-hover:text-green-600">
              {site.category}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

// --- Main Terminal Component ---
export default function TerminalTechAnalyzer() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<IAnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (results || error) {
        setResults(null);
        setError(null);
        setSubmitted(false);
        setResultsVisible(false);
      }
    };

  const handleCommonUrlClick = (urlValue: string) => {
    setUrl(urlValue);
    if (results || error) {
      setResults(null);
      setError(null);
      setSubmitted(false);
      setResultsVisible(false);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setResults(null);
    setError(null);
    setResultsVisible(false);
    setSubmitted(false);

    if (!url.trim()) {
      setFlash({
        type: "error",
        message: "Error: URL parameter required for analysis",
      });
      return;
    }

    setIsLoading(true);
    setSubmitted(true);

    const command = `techscan --url ${url.trim()} --output json`;
    setCommandHistory((prev) => [...prev, command]);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || "Analysis failed with unknown error");
      }

      setResults(data);
      if (data.detected && data.detected.length > 0) {
        setFlash({
          type: "success",
          message: `Technology scan completed: ${data.detected.length} technologies detected`,
        });
        setTimeout(() => setResultsVisible(true), 100);
      } else {
        setFlash({
          type: "info",
          message: "Scan completed: No technologies detected in target",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        setFlash({
          type: "error",
          message: `Scan failed: ${err.message}`,
        });
      } else {
        setError("An unexpected error occurred.");
        setFlash({
          type: "error",
          message: "Scan failed: Unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const clearTerminal = () => {
    setResults(null);
    setError(null);
    setFlash(null);
    setCommandHistory([]);
    setUrl("");
    setSubmitted(false);
    setResultsVisible(false);
  };

  useEffect(() => {
    if (resultsVisible && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultsVisible]);

  const showResults = results !== null && results.detected.length > 0;
  const showNotFoundError =
    submitted && !isLoading && !error && results?.detected.length === 0;

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
        .terminal-cursor::after {
          content: '█';
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-black text-green-400 font-mono">
        {flash && (
          <TerminalToast flash={flash} onClose={() => setFlash(null)} />
        )}

        {/* Terminal Status Bar */}
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-green-400">TECHSCAN-V2.1</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Search className="h-3 w-3" />
                  <span className="text-gray-400">Technology Detection</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <span>Session: {new Date().toLocaleTimeString()}</span>
                <span>Engine: Wappalyzer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-6xl">
          {/* Terminal-style Breadcrumbs */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">user@techscan:</span>
                <span className="text-green-400">~</span>
                <span className="text-gray-400">/</span>
                <Link
                  href="/"
                  className="flex items-center text-gray-400 hover:text-green-400 transition-colors group"
                >
                  <HomeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="group-hover:underline">home</span>
                </Link>
                <span className="text-gray-600">/</span>
                <ChevronRight className="h-3 w-3 text-gray-600" />
                <span className="text-gray-600">/</span>
                <span
                  className="font-medium text-green-400"
                  aria-current="page"
                >
                  tools/techscan
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Current directory: /var/www/tools/techscan
              </div>
            </div>
          </nav>

          {/* ASCII Art Header */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-center space-y-2">
              <pre className="text-green-500 text-xs leading-tight">
                {`
████████╗███████╗ ██████╗██╗  ██╗███████╗ ██████╗ █████╗ ███╗   ██╗
╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔════╝██╔════╝██╔══██╗████╗  ██║
   ██║   █████╗  ██║     ███████║███████╗██║     ███████║██╔██╗ ██║
   ██║   ██╔══╝  ██║     ██╔══██║╚════██║██║     ██╔══██║██║╚██╗██║
   ██║   ███████╗╚██████╗██║  ██║███████║╚██████╗██║  ██║██║ ╚████║
   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝
`}
              </pre>
              <div className="space-y-1 text-sm">
                <div className="text-gray-400">
                  Website Technology Detection Tool • Version 2.1.0
                </div>
                <div className="text-gray-600">
                  Automated framework and library identification system
                </div>
              </div>
            </div>
          </div>

          {/* System Information Panels */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Code className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-semibold text-sm">
                  DETECTION
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Frameworks: React, Vue, Angular</div>
                <div>CMS: WordPress, Drupal, Joomla</div>
                <div>Libraries: jQuery, Bootstrap</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Server className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">
                  ANALYSIS
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Headers: HTTP Response Analysis</div>
                <div>DOM: HTML Structure Parsing</div>
                <div>Scripts: JavaScript Detection</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold text-sm">
                  STATUS
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Engine: Wappalyzer Core</div>
                <div>Database: 3000+ Technologies</div>
                <div>Accuracy: 95%+ Detection Rate</div>
              </div>
            </div>
          </div>

          {/* Scan Configuration Panel */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-green-400 font-semibold">
                SCAN CONFIGURATION
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-gray-400">Detection Categories:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div>
                    <span className="text-green-400">Frontend Frameworks</span>{" "}
                    <span className="text-gray-500">• React, Vue, Angular</span>
                  </div>
                  <div>
                    <span className="text-green-400">Content Management</span>{" "}
                    <span className="text-gray-500">• WordPress, Drupal</span>
                  </div>
                  <div>
                    <span className="text-green-400">E-commerce Platforms</span>{" "}
                    <span className="text-gray-500">
                      • Shopify, WooCommerce
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-400">Analysis Methods:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-gray-500">→ HTTP header inspection</div>
                  <div className="text-gray-500">→ HTML meta tag analysis</div>
                  <div className="text-gray-500">
                    → JavaScript library detection
                  </div>
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
                techscan-terminal-v2.1.0
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
              <div className="text-green-500">
                <div>TechScan v2.1.0 - Website Technology Detection Tool</div>
                <div className="text-gray-500">
                  Identify frameworks, libraries, and technologies used by any
                  website
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  Usage: techscan --url [target] --output [format]
                </div>
              </div>

              {/* Command History */}
              {commandHistory.map((cmd, index) => (
                <div key={index} className="text-gray-400">
                  <span className="text-green-500">user@techscan:~$</span> {cmd}
                </div>
              ))}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">user@techscan:~$</span>
                  <span className="text-gray-400">techscan --url</span>
                  <input
                    type="text"
                    value={url}
                    onChange={handleInputChange(setUrl)}
                    placeholder="example.com"
                    className="bg-transparent border-none outline-none text-green-400 font-mono placeholder-gray-600 flex-1"
                    disabled={isLoading}
                  />
                  <span className="text-gray-400">--output json</span>
                  {!isLoading && (
                    <button
                      type="submit"
                      className="text-gray-500 hover:text-green-400 transition-colors ml-4 px-2 py-1 border border-gray-700 hover:border-green-500 text-sm"
                    >
                      [SCAN]
                    </button>
                  )}
                </div>

                {/* Quick Scan Targets */}
                <div className="ml-8 mt-4">
                  <TerminalUrlSelector
                    urls={commonUrls}
                    onSelect={handleCommonUrlClick}
                  />
                </div>
              </form>

              {/* Loading State */}
              {isLoading && (
                <div className="mt-4 p-2 border-l-2 border-yellow-500 bg-yellow-500/5">
                  <TerminalLoader url={url} />
                </div>
              )}

              {/* Results Display */}
              {showResults && (
                <div ref={resultsRef} className="mt-6 space-y-4">
                  <div className="border border-green-500 bg-green-500/5">
                    <div className="bg-green-500/10 px-3 py-2 border-b border-green-500">
                      <span className="text-green-400 font-semibold">
                        ✓ Technology scan completed for: {results.analyzedUrl}
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="text-green-400 font-mono text-sm mb-3">
                        Detected Technologies ({results.detected.length}):
                      </div>
                      <ul className="space-y-2">
                        {results.detected.map((tech, index) => (
                          <TechResult
                            key={tech}
                            tech={tech}
                            isVisible={resultsVisible}
                            index={index}
                          />
                        ))}
                      </ul>
                    </div>
                    <div className="px-3 py-2 border-t border-green-600 text-green-600 text-sm">
                      Scan completed successfully (exit code 0)
                    </div>
                  </div>
                </div>
              )}

              {/* No Results Found */}
              {showNotFoundError && (
                <div className="mt-4 p-3 border border-yellow-500 bg-yellow-500/5 text-yellow-400">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>No technologies detected for target: {url}</span>
                  </div>
                  <div className="text-yellow-600 text-sm mt-1">
                    Target may be using custom solutions or blocking detection
                    methods
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 border border-red-500 bg-red-500/5 text-red-400">
                  <div className="flex items-center space-x-2">
                    <span>❌</span>
                    <span>Scan failed: {error}</span>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!results && !isLoading && !error && (
                <div className="mt-4 p-3 border border-gray-700 bg-gray-800/50 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4" />
                    <span>Ready for technology detection</span>
                  </div>
                  <div className="text-gray-600 text-sm mt-1">
                    Enter a URL to analyze website technologies and frameworks
                  </div>
                </div>
              )}

              {/* Terminal Cursor */}
              {!isLoading && (
                <div className="terminal-cursor text-green-400 inline-block"></div>
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="text-center space-y-2">
            <div className="text-gray-600 text-xs">
              <span className="text-gray-500">©</span> 2024 TechScan Terminal •
              <span className="text-green-600"> Technology Detection</span> •
              <span className="text-blue-500"> Website Analysis</span>
            </div>
            <div className="text-gray-700 text-xs">
              Powered by Wappalyzer • 3000+ Technology Signatures
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
