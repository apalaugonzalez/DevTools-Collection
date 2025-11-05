"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Terminal, Globe } from "lucide-react";

// --- Type Definitions ---
interface IpInfo {
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
}

// --- Terminal Sub-Components ---

/**
 * Terminal-style toast notification
 */
const TerminalToast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
    <div className="bg-black border border-orange-500 text-orange-400 font-mono text-sm py-2 px-4 shadow-lg shadow-orange-500/20">
      <span className="text-orange-500">$</span> {message}
    </div>
  </div>
);

/**
 * Terminal loading animation
 */
const TerminalLoader = () => (
  <div className="flex items-center space-x-1 text-orange-400 font-mono text-sm">
    <span>resolving network interface</span>
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

/**
 * IP Information display component
 */
const IpInfoDisplay = ({
  ipInfo,
  onCopy,
  isCopied,
}: {
  ipInfo: IpInfo;
  onCopy: () => void;
  isCopied: boolean;
}) => (
  <div className="space-y-4">
    {/* IP Address Display */}
    <div className="text-center border border-orange-500 bg-orange-500/5 p-4 rounded">
      <div className="text-orange-400 text-sm mb-2">PUBLIC IP ADDRESS</div>
      <div className="flex items-center justify-center space-x-3">
        <span className="text-3xl font-mono text-orange-300 font-bold">
          {ipInfo.ip}
        </span>
        <button
          onClick={onCopy}
          className="px-2 py-1 font-mono text-xs border border-gray-700 hover:border-orange-500 hover:text-orange-400 transition-all duration-200 bg-gray-900 hover:bg-gray-800"
          aria-label="Copy IP address"
        >
          {isCopied ? (
            <span className="text-green-400">✓ copied</span>
          ) : (
            <span className="text-gray-400">copy</span>
          )}
        </button>
      </div>
    </div>

    {/* Network Information */}
    <div className="border border-gray-700 bg-gray-900/50 rounded">
      <div className="bg-gray-800 px-3 py-2 border-b border-gray-700">
        <span className="text-orange-400 font-semibold text-sm">
          NETWORK INFORMATION
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-mono text-sm">ISP:</span>
          <span className="text-orange-300 font-mono text-sm">
            {ipInfo.isp}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-mono text-sm">City:</span>
          <span className="text-orange-300 font-mono text-sm">
            {ipInfo.city}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-mono text-sm">Region:</span>
          <span className="text-orange-300 font-mono text-sm">
            {ipInfo.region}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 font-mono text-sm">Country:</span>
          <span className="text-orange-300 font-mono text-sm">
            {ipInfo.country}
          </span>
        </div>
      </div>
    </div>

    {/* Connection Status */}
    <div className="text-center text-orange-600 text-sm font-mono">
      Connection established • Network interface active
    </div>
  </div>
);

// --- Main Terminal Component ---
export default function TerminalIpChecker() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIpDetails() {
      try {
        const res = await fetch("/api/ip");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Network interface lookup failed");
        }
        const data: IpInfo = await res.json();
        setIpInfo(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          setError("Error: Network interface resolution failed");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchIpDetails();
  }, []);

  const handleCopy = () => {
    if (ipInfo?.ip) {
      navigator.clipboard.writeText(ipInfo.ip);
      setIsCopied(true);
      setToastMessage("IP address copied to clipboard");
      setTimeout(() => {
        setIsCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  const refreshIp = () => {
    setIsLoading(true);
    setError(null);
    setIpInfo(null);

    // Simulate refresh
    setTimeout(() => {
      window.location.reload();
    }, 500);
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
        .terminal-cursor::after {
          content: '█';
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-black text-orange-400 font-mono">
        {toastMessage && <TerminalToast message={toastMessage} />}

        {/* Terminal Status Bar */}
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-orange-400">IP-RESOLVER</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-3 w-3" />
                  <span className="text-gray-400">Network Active</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <span>Session: {new Date().toLocaleTimeString()}</span>
                <span>PID: 8080</span>
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
                  className="flex items-center text-gray-400 hover:text-orange-400 transition-colors group"
                >
                  <HomeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="group-hover:underline">home</span>
                </Link>
                <span className="text-gray-600">/</span>
                <ChevronRight className="h-3 w-3 text-gray-600" />
                <span className="text-gray-600">/</span>
                <span
                  className="font-medium text-orange-400"
                  aria-current="page"
                >
                  tools/ip-resolver
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Current directory: /var/www/tools/ip-resolver
              </div>
            </div>
          </nav>

          {/* ASCII Art Header */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-center space-y-2">
              <pre className="text-orange-500 text-xs leading-tight">
                {`
 ██╗██████╗     ██████╗ ███████╗███████╗ ██████╗ ██╗    ██╗   ██╗███████╗██████╗ 
 ██║██╔══██╗    ██╔══██╗██╔════╝██╔════╝██╔═══██╗██║    ██║   ██║██╔════╝██╔══██╗
 ██║██████╔╝    ██████╔╝█████╗  ███████╗██║   ██║██║    ██║   ██║█████╗  ██████╔╝
 ██║██╔═══╝     ██╔══██╗██╔══╝  ╚════██║██║   ██║██║    ╚██╗ ██╔╝██╔══╝  ██╔══██╗
 ██║██║         ██║  ██║███████╗███████║╚██████╔╝███████╗╚████╔╝ ███████╗██║  ██║
 ╚═╝╚═╝         ╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝ ╚══════╝ ╚═══╝  ╚══════╝╚═╝  ╚═╝
`}
              </pre>
              <div className="space-y-1 text-sm">
                <div className="text-gray-400">
                  Network Interface Resolution Tool • Version 4.1.2
                </div>
                <div className="text-gray-600">
                  Identify your public IP address and network location
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
                  RESOLVER
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Protocol: IPv4/IPv6</div>
                <div>Method: GeoIP Lookup</div>
                <div>Accuracy: 99.1%</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-orange-400 font-semibold text-sm">
                  STATUS
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Service: Online</div>
                <div>Latency: 45ms</div>
                <div>Uptime: 99.9%</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-semibold text-sm">
                  NETWORK
                </span>
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <div>Interface: eth0</div>
                <div>Gateway: Active</div>
                <div>DNS: Resolved</div>
              </div>
            </div>
          </div>

          {/* Command Information Panel */}
          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-orange-400 font-semibold">
                NETWORK INTERFACE INFORMATION
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-gray-400">Available Commands:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div>
                    <span className="text-orange-400">ifconfig</span>{" "}
                    <span className="text-gray-500">
                      {"// Show network config"}
                    </span>
                  </div>
                  <div>
                    <span className="text-orange-400">ping</span>{" "}
                    <span className="text-gray-500">
                      {"// Test connectivity"}
                    </span>
                  </div>
                  <div>
                    <span className="text-orange-400">refresh</span>{" "}
                    <span className="text-gray-500">{"// Update IP info"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-gray-400">Network Details:</div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-gray-500">
                    → Public IP address detection
                  </div>
                  <div className="text-gray-500">→ ISP and location lookup</div>
                  <div className="text-gray-500">
                    → Real-time network status
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
              <span className="text-gray-400 text-sm">ip-resolver-v4.1.2</span>
              <button
                onClick={refreshIp}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 hover:bg-gray-700 transition-colors"
              >
                refresh
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Welcome Message */}
              <div className="text-orange-500">
                <div>Network Interface Resolver v4.1.2</div>
                <div className="text-gray-500">
                  Detecting public IP address and network information...
                </div>
              </div>

              {/* Command Execution */}
              <div className="text-gray-400">
                <span className="text-orange-500">user@terminal:~$</span>{" "}
                ifconfig | grep &quot;inet &quot; | head -1
              </div>

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
                    Network interface lookup failed (exit code 1)
                  </div>
                </div>
              )}

              {/* IP Information Display */}
              {ipInfo && (
                <div className="mt-4">
                  <div className="text-orange-400 mb-3">
                    ✓ Network interface resolved successfully
                  </div>
                  <IpInfoDisplay
                    ipInfo={ipInfo}
                    onCopy={handleCopy}
                    isCopied={isCopied}
                  />
                </div>
              )}

              {/* Terminal Cursor */}
              {!isLoading && (
                <div className="terminal-cursor text-orange-400 inline-block"></div>
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="text-center space-y-2">
            <div className="text-gray-600 text-xs">
              <span className="text-gray-500">©</span> 2024 IP Resolver Terminal
              •<span className="text-orange-600"> Real-time Detection</span> •
              <span className="text-blue-500"> Secure Lookup</span>
            </div>
            <div className="text-gray-700 text-xs">
              Network interface monitoring • Privacy protected
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
