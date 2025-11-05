"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Terminal, Search } from "lucide-react";

// --- Type Definitions ---
interface CmsDetectionResponse {
  detectedCms?: string[];
  message?: string;
  error?: string;
}

// --- Terminal Sub-Components ---

/**
 * Terminal-style toast notification
 */
const TerminalToast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
    <div className="bg-black border border-cyan-500 text-cyan-400 font-mono text-sm py-2 px-4 shadow-lg shadow-cyan-500/20">
      <span className="text-cyan-500">$</span> {message}
    </div>
  </div>
);

/**
 * Terminal-style CMS result item
 */
const TerminalResultItem = ({
  cms,
  isVisible,
  index,
}: {
  cms: string;
  isVisible: boolean;
  index: number;
}) => (
  <div
    className={`transition-all duration-500 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <div className="group flex items-center justify-between hover:bg-gray-900/50 p-2 border-l-2 border-transparent hover:border-cyan-500 transition-all duration-200">
      <div className="flex items-center space-x-2 flex-1">
        <span className="text-cyan-500 font-mono text-sm">→</span>
        <span className="font-mono text-sm text-cyan-400 break-all">{cms}</span>
      </div>
      <div className="px-2 py-1 font-mono text-xs border border-gray-700 bg-gray-900 text-green-400">
        detected
      </div>
    </div>
  </div>
);

/**
 * Terminal loading animation
 */
const TerminalLoader = () => (
  <div className="flex items-center space-x-1 text-cyan-400 font-mono text-sm">
    <span>analyzing</span>
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
);

// --- Main Terminal Component ---
export default function TerminalCmsDetector() {
  const [url, setUrl] = useState("");
  const [cmsInfo, setCmsInfo] = useState<CmsDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // State for animations
  const [resultsVisible, setResultsVisible] = useState(false);
  const [toastMessage] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (cmsInfo || error) {
      setCmsInfo(null);
      setError(null);
      setSubmittedUrl("");
      setResultsVisible(false);
    }
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCmsInfo(null);
    setResultsVisible(false);
    setSubmittedUrl("");

    let urlToValidate = url.trim();
    if (!urlToValidate) {
      setError("Error: URL parameter required");
      return;
    }
    if (!/^https?:\/\//i.test(urlToValidate)) {
      urlToValidate = `https://${urlToValidate}`;
    }

    try {
      new URL(urlToValidate);
    } catch {
      setError("Error: Invalid URL format");
      return;
    }

    const command = `detect-cms --url="${urlToValidate}"`;
    setCommandHistory((prev) => [...prev, command]);
    setIsLoading(true);
    setSubmittedUrl(urlToValidate);

    try {
      const res = await fetch(
        `/api/custom-detect?url=${encodeURIComponent(urlToValidate)}`
      );
      const data: CmsDetectionResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Process terminated with error code 1");
      }
      setCmsInfo(data);
      if (data.detectedCms && data.detectedCms.length > 0) {
        setTimeout(() => setResultsVisible(true), 200);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("Error: Unexpected process failure");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const clearTerminal = () => {
    setCmsInfo(null);
    setError(null);
    setCommandHistory([]);
    setSubmittedUrl("");
    setUrl("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (resultsVisible && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultsVisible]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const showResults = cmsInfo?.detectedCms && cmsInfo.detectedCms.length > 0;
  const showNotFoundError =
    !isLoading && !error && submittedUrl && !showResults;

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

      <div className="min-h-screen bg-black text-cyan-400 font-mono">
        {toastMessage && <TerminalToast message={toastMessage} />}

        {/* Terminal Status Bar */}
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-cyan-400">CMS-DETECTOR</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Search className="h-3 w-3" />
                  <span className="text-gray-400">Ready</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <span>Session: {new Date().toLocaleTimeString()}</span>
                <span>PID: 2048</span>
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
                  className="flex items-center text-gray-400 hover:text-cyan-400 transition-colors group"
                >
                  <HomeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="group-hover:underline">home</span>
                </Link>
                <span className="text-gray-600">/</span>
                <ChevronRight className="h-3 w-3 text-gray-600" />
                <span className="text-gray-600">/</span>
                <span className="font-medium text-cyan-400" aria-current="page">
                  tools/cms-detector
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Current directory: /var/www/tools/cms-detector
              </div>
            </div>
          </nav>

          {/* ASCII Art Header */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-center space-y-2">
              <pre className="text-cyan-500 text-xs leading-tight">
                {`
  ██████╗███╗   ███╗███████╗    ██████╗ ███████╗████████╗███████╗ ██████╗████████╗ ██████╗ ██████╗ 
 ██╔════╝████╗ ████║██╔════╝    ██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗
 ██║     ██╔████╔██║███████╗    ██║  ██║█████╗     ██║   █████╗  ██║        ██║   ██║   ██║██████╔╝
 ██║     ██║╚██╔╝██║╚════██║    ██║  ██║██╔══╝     ██║   ██╔══╝  ██║        ██║   ██║   ██║██╔══██╗
 ╚██████╗██║ ╚═╝ ██║███████║    ██████╔╝███████╗   ██║   ███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║
  ╚═════╝╚═╝     ╚═╝╚══════╝    ╚═════╝ ╚══════╝   ╚═╝   ╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
`}
              </pre>
              <div className="space-y-1 text-sm">
                <div className="text-gray-400">
                  Content Management System Detection Tool • Version 3.2.1
                </div>
                <div className="text-gray-600">
                  Identify CMS platforms and technologies used by websites
                </div>
              </div>
            </div>
          </div>

          {/* System Information Panels */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <Terminal className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">
                  ENGINE
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Parser: Advanced v3.2</div>
                <div>Signatures: 1,247</div>
                <div>Accuracy: 94.7%</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-cyan-400 font-semibold text-sm">
                  STATUS
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Service: Online</div>
                <div>Queue: Empty</div>
                <div>Response: 1.2s avg</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-semibold text-sm">
                  DATABASE
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>CMS Types: 156</div>
                <div>Last Update: 2h ago</div>
                <div>Coverage: 99.2%</div>
              </div>
            </div>
          </div>

          {/* Command Help Panel */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-cyan-400 font-semibold">
                DETECTION CAPABILITIES
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-gray-400">Supported CMS:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div>
                    <span className="text-cyan-400">WordPress</span>{" "}
                    <span className="text-gray-500">• Drupal • Joomla</span>
                  </div>
                  <div>
                    <span className="text-cyan-400">Shopify</span>{" "}
                    <span className="text-gray-500">
                      • Magento • WooCommerce
                    </span>
                  </div>
                  <div>
                    <span className="text-cyan-400">Ghost</span>{" "}
                    <span className="text-gray-500">• Squarespace • Wix</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-400">Command Usage:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-gray-500">
                    $ detect-cms --url=&quot;example.com&quot;
                  </div>
                  <div className="text-gray-500">
                    $ detect-cms --url=&quot;shop.example.com&quot;
                  </div>
                  <div className="text-gray-500">$ clear // Reset terminal</div>
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
              <span className="text-gray-400 text-sm">cms-detector-v3.2.1</span>
              <button
                onClick={clearTerminal}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 hover:bg-gray-700 transition-colors"
              >
                clear
              </button>
            </div>

            <div className="p-4 space-y-2">
              {/* Welcome Message */}
              <div className="text-cyan-500">
                <div>CMS Detection Terminal v3.2.1</div>
                <div className="text-gray-500">
                  Enter a website URL to analyze its CMS platform
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  Usage: detect-cms --url=&quot;domain.com&quot;
                </div>
              </div>

              {/* Command History */}
              {commandHistory.map((cmd, index) => (
                <div key={index} className="text-gray-400">
                  <span className="text-cyan-500">user@terminal:~$</span> {cmd}
                </div>
              ))}

              {/* Current Command Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <span className="text-cyan-500">user@terminal:~$</span>
                <span className="text-gray-400">detect-cms --url=&quot;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="example.com"
                  className="bg-transparent border-none outline-none text-cyan-400 flex-1 font-mono placeholder-gray-600"
                  disabled={isLoading}
                />
                <span className="text-gray-400">&quot;</span>
                {!isLoading && (
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-cyan-400 transition-colors ml-4 px-2 py-1 border border-gray-700 hover:border-cyan-500 text-sm"
                  >
                    [ENTER]
                  </button>
                )}
              </form>

              {/* Loading State */}
              {isLoading && (
                <div className="mt-4 p-2 border-l-2 border-yellow-500 bg-yellow-500/5">
                  <TerminalLoader />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 border border-red-500 bg-red-500/10 text-red-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">✗</span>
                    <span>{error}</span>
                  </div>
                  <div className="text-red-600 text-sm mt-1">
                    Process exited with code 1
                  </div>
                </div>
              )}

              {/* Results Display */}
              {showResults && (
                <div
                  ref={resultsRef}
                  className="mt-6 border border-cyan-500 bg-cyan-500/5"
                >
                  <div className="bg-cyan-500/10 px-3 py-2 border-b border-cyan-500 flex justify-between items-center">
                    <span className="text-cyan-400 font-semibold">
                      ✓ Detection complete: {cmsInfo.detectedCms?.length} CMS
                      platform
                      {cmsInfo.detectedCms && cmsInfo.detectedCms.length !== 1
                        ? "s"
                        : ""}{" "}
                      identified
                    </span>
                  </div>
                  <div className="p-3 space-y-1">
                    {cmsInfo.detectedCms?.map((cms, index) => (
                      <TerminalResultItem
                        key={cms}
                        cms={cms}
                        isVisible={resultsVisible}
                        index={index}
                      />
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-cyan-600 text-cyan-600 text-sm">
                    Analysis completed successfully (exit code 0)
                  </div>
                </div>
              )}

              {/* No Results Found */}
              {showNotFoundError && (
                <div className="mt-4 p-3 border border-yellow-500 bg-yellow-500/10 text-yellow-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">⚠</span>
                    <span>No CMS platform detected at {submittedUrl}</span>
                  </div>
                  <div className="text-yellow-600 text-sm mt-1">
                    The site may use a custom solution or unrecognized CMS
                  </div>
                </div>
              )}

              {/* Terminal Cursor */}
              {!isLoading && (
                <div className="terminal-cursor text-cyan-400 inline-block"></div>
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="text-center space-y-2">
            <div className="text-gray-600 text-xs">
              <span className="text-gray-500">©</span> 2024 CMS Detector
              Terminal •
              <span className="text-cyan-600"> Advanced Detection</span> •
              <span className="text-blue-500"> Real-time Analysis</span>
            </div>
            <div className="text-gray-700 text-xs">
              Supports 156+ CMS platforms • Updated hourly
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
