"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Shield } from "lucide-react";

// --- Type Definitions ---
interface ScanResult {
  port: number;
  status: "open" | "closed" | "filtered";
}

// --- Terminal Sub-Components ---

/**
 * Terminal loading animation
 */
const TerminalLoader = () => (
  <div className="flex items-center space-x-1 text-red-400 font-mono text-sm">
    <span>scanning target</span>
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
 * Port scan result item
 */
const ResultItem = ({
  result,
  index,
}: {
  result: ScanResult;
  index: number;
}) => {
  const statusColor =
    result.status === "open"
      ? "text-green-400"
      : result.status === "closed"
      ? "text-gray-500"
      : "text-yellow-400";

  return (
    <div
      className="flex items-center space-x-4 font-mono text-sm"
      style={{
        animation: `fadeIn 0.5s ease-out ${index * 50}ms forwards`,
        opacity: 0,
      }}
    >
      <span className="text-red-500">→</span>
      <span className="w-16">PORT {result.port}</span>
      <span className={`font-semibold ${statusColor}`}>
        {result.status.toUpperCase()}
      </span>
    </div>
  );
};

// --- Main Terminal Component ---
export default function TerminalPortScanner() {
  const [target, setTarget] = useState("");
  const [ports, setPorts] = useState("80,443,8080,22,3306");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResults([]);

    if (!target.trim()) {
      setError("Error: Target host or IP required");
      return;
    }

    const command = `nmap -p ${ports.trim()} ${target.trim()}`;
    setCommandHistory((prev) => [...prev, command]);
    setIsLoading(true);

    try {
      // In a real scenario, this would call a backend API
      // Here, we simulate the API call and results
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const portArray = ports
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((p) => !isNaN(p));

      const simulatedResults: ScanResult[] = portArray.map((port) => {
        const rand = Math.random();
        let status: "open" | "closed" | "filtered" = "closed";
        if (rand > 0.8) status = "open";
        else if (rand < 0.1) status = "filtered";
        return { port, status };
      });

      setResults(simulatedResults);
    } catch {
      setError("Error: Scan failed to execute. Check target and permissions.");
    } finally {
      setIsLoading(false);
    }
  }

  const clearTerminal = () => {
    setResults([]);
    setError(null);
    setCommandHistory([]);
    setTarget("");
    setPorts("80,443,8080,22,3306");
  };

  useEffect(() => {
    if (results.length > 0 || error) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [results, error]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="min-h-screen bg-black text-red-400 font-mono">
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-red-400">PORT-SCANNER</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span className="text-gray-400">Secure Mode</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <span>Session: {new Date().toLocaleTimeString()}</span>
                <span>PID: 404</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl">
          <nav className="mb-6" aria-label="Breadcrumb">
            <div className="bg-gray-900 border border-gray-700 p-3 rounded">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">root@system:</span>
                <span className="text-blue-400">~</span>
                <span className="text-gray-400">/</span>
                <Link
                  href="/"
                  className="flex items-center text-gray-400 hover:text-red-400 transition-colors group"
                >
                  <HomeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="group-hover:underline">home</span>
                </Link>
                <span className="text-gray-600">/</span>
                <ChevronRight className="h-3 w-3 text-gray-600" />
                <span className="text-gray-600">/</span>
                <span className="font-medium text-red-400" aria-current="page">
                  tools/port-scanner
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-600">
                Current directory: /var/www/tools/port-scanner
              </div>
            </div>
          </nav>

          <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
            <div className="text-center space-y-2">
              <pre className="text-red-500 text-xs leading-tight">
                {`
██████╗  ██████╗ ██████╗ ████████╗    ███████╗ ██████╗  █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗ 
██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔════╝██╔════╝ ██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
██████╔╝██║   ██║██████╔╝   ██║       ███████╗██║  ███╗███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
██╔═══╝ ██║   ██║██╔══██╗   ██║       ╚════██║██║   ██║██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
██║     ╚██████╔╝██║  ██║   ██║       ███████║╚██████╔╝██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
`}
              </pre>
              <div className="space-y-1 text-sm">
                <div className="text-gray-400">
                  Network Port Scanning Utility • Version 1.5.0
                </div>
                <div className="text-gray-600">
                  Probe a server or host for open ports
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-700 bg-gray-900 mb-4">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">port-scanner-v1.5.0</span>
              <button
                onClick={clearTerminal}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 hover:bg-gray-700 transition-colors"
              >
                clear
              </button>
            </div>

            <div className="p-4 space-y-3" ref={resultsRef}>
              <div className="text-red-500">
                <div>Port Scanning Terminal v1.5.0</div>
                <div className="text-gray-500">
                  Enter a target and comma-separated ports to scan.
                </div>
              </div>

              {commandHistory.map((cmd, index) => (
                <div key={index} className="text-gray-400">
                  <span className="text-red-500">root@terminal:~#</span> {cmd}
                </div>
              ))}

              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <span className="text-red-500">root@terminal:~#</span>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="scanme.nmap.org"
                  className="bg-transparent border-b border-gray-700 outline-none text-red-400 flex-1 font-mono placeholder-gray-600"
                  disabled={isLoading}
                />
                <span className="text-gray-500">-p</span>
                <input
                  type="text"
                  value={ports}
                  onChange={(e) => setPorts(e.target.value)}
                  placeholder="e.g., 80,443"
                  className="bg-transparent border-b border-gray-700 outline-none text-red-400 w-48 font-mono placeholder-gray-600"
                  disabled={isLoading}
                />
                {!isLoading && (
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-red-400 transition-colors ml-4 px-2 py-1 border border-gray-700 hover:border-red-500 text-sm"
                  >
                    [SCAN]
                  </button>
                )}
              </form>

              {isLoading && (
                <div className="mt-4 p-2">
                  <TerminalLoader />
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 border border-red-500 bg-red-500/10 text-red-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500">✗</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div className="mt-4">
                  <div className="text-green-400 mb-2">
                    ✓ Scan complete for {target}.
                  </div>
                  <div className="p-3 border-t border-b border-gray-700 space-y-1">
                    {results.map((result, index) => (
                      <ResultItem
                        key={result.port}
                        result={result}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
