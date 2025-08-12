// app/find-open-ports/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

// --- Type Definitions ---
interface PortScanResponse {
  openPorts?: number[];
  error?: string;
}

// --- Data for Common Ports ---
const commonPorts = [
  { name: "HTTP", port: "80" },
  { name: "HTTPS", port: "443" },
  { name: "FTP", port: "21" },
  { name: "SSH", port: "22" },
  { name: "Telnet", port: "23" },
  { name: "SMTP", port: "25" },
  { name: "DNS", port: "53" },
  { name: "RDP", port: "3389" },
  { name: "MySQL", port: "3306" },
  { name: "PostgreSQL", port: "5432" },
];

// --- Sub-Components ---
const ResultItem = ({
  port,
  isVisible,
  index,
}: {
  port: number;
  isVisible: boolean;
  index: number;
}) => (
  <li
    className={`transition-all duration-500 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/60 p-2.5 rounded-lg">
      <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
        Port {port}
      </span>
      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
        Open
      </span>
    </div>
  </li>
);

// --- Main Component ---
export default function PortScannerPage() {
  const [host, setHost] = useState("");
  const [ports, setPorts] = useState("80, 443, 8080");
  const [results, setResults] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchInitialIp() {
      try {
        const res = await fetch("/api/ip");
        if (res.ok) {
          const data = await res.json();
          if (data.ip) {
            setHost(data.ip);
          }
        }
      } catch (error) {
        console.error("Could not fetch initial IP:", error);
      }
    }
    fetchInitialIp();
  }, []);

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

  const handleCommonPortClick = (port: string) => {
    setPorts(port);
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

    if (!host.trim()) {
      setError("⚠️ Please enter a host or IP address.");
      return;
    }
    if (!ports.trim()) {
      setError("⚠️ Please enter ports to scan.");
      return;
    }

    setIsLoading(true);
    setSubmitted(true);

    try {
      const res = await fetch("/api/port-scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host: host.trim(), ports: ports.trim() }),
      });
      const data: PortScanResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }
      setResults(data.openPorts || []);
      if (data.openPorts && data.openPorts.length > 0) {
        setTimeout(() => setResultsVisible(true), 100);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (resultsVisible && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultsVisible]);

  const showResults = results !== null && results.length > 0;
  const showNotFoundError =
    submitted && !isLoading && !error && results?.length === 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto flex flex-col items-center justify-start p-6 pt-24 sm:pt-32">
        <nav className="w-full max-w-lg mb-8" aria-label="Breadcrumb">
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
                Port Scanner
              </span>
            </li>
          </ol>
        </nav>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-500 dark:to-cyan-300 bg-clip-text text-transparent pb-2">
            Port Scanner
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Check for open ports on a host or IP address.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg dark:shadow-blue-500/10 w-full max-w-lg transition-all">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="host-input"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Host / IP Address
                </label>
                <input
                  id="host-input"
                  type="text"
                  placeholder="Loading your IP..."
                  value={host}
                  onChange={handleInputChange(setHost)}
                  className="w-full px-4 py-3 border bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="ports-input"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Ports to Scan
                </label>
                <input
                  id="ports-input"
                  type="text"
                  placeholder="e.g., 80, 443, 8000-8080"
                  value={ports}
                  onChange={handleInputChange(setPorts)}
                  className="w-full px-4 py-3 border bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              {/* Common Ports Selection */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
                  Or select a common port:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {commonPorts.map((p) => (
                    <button
                      key={p.port}
                      type="button"
                      onClick={() => handleCommonPortClick(p.port)}
                      className="px-3 py-1 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex justify-center items-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-400 dark:disabled:bg-blue-500/50 disabled:cursor-wait"
              >
                {isLoading ? (
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Scan Ports"
                )}
              </button>
            </form>
          </div>
          <div className="px-6 sm:px-8 pb-6 min-h-[10rem]">
            {error && (
              <div className="mt-4 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-3 rounded-lg flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}
            {showResults && (
              <div ref={resultsRef} className="mt-6">
                <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4">
                  Open Ports:
                </h2>
                <ul className="space-y-2">
                  {results.map((port, index) => (
                    <ResultItem
                      key={port}
                      port={port}
                      isVisible={resultsVisible}
                      index={index}
                    />
                  ))}
                </ul>
              </div>
            )}
            {showNotFoundError && (
              <div className="mt-6 text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-md font-semibold text-slate-800 dark:text-white">
                  No Open Ports Found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  None of the specified ports appear to be open on{" "}
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {host}
                  </span>
                  .
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
