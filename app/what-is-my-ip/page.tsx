// app/what-is-my-ip/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon, Copy, Check } from "lucide-react";

// --- Type Definitions ---
interface IpInfo {
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
}

// --- Main Component ---
export default function WhatIsMyIpPage() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchIpDetails() {
      try {
        const res = await fetch("/api/ip");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch IP address details.");
        }
        const data: IpInfo = await res.json();
        setIpInfo(data);
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

    fetchIpDetails();
  }, []);

  const handleCopy = () => {
    if (ipInfo?.ip) {
      navigator.clipboard.writeText(ipInfo.ip);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto flex flex-col items-center justify-start p-6 pt-24 sm:pt-32">
        {/* Breadcrumb Navigation */}
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
                What Is My IP
              </span>
            </li>
          </ol>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-500 dark:to-cyan-300 bg-clip-text text-transparent pb-2">
            What Is My IP Address?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Your public IP address and location details are displayed below.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg dark:shadow-blue-500/10 w-full max-w-lg transition-all p-8">
          <div className="min-h-[12rem] flex items-center justify-center">
            {isLoading && (
              <div className="h-8 w-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            )}
            {error && (
              <div className="text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10 p-3 rounded-lg flex items-center space-x-2">
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
            {ipInfo && (
              <div className="w-full text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your public IP address is:
                </p>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <p className="text-3xl md:text-4xl font-mono font-bold text-slate-800 dark:text-slate-100">
                    {ipInfo.ip}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-full transition-all duration-200 hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-700"
                    aria-label="Copy IP address"
                  >
                    {isCopied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">
                      ISP:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {ipInfo.isp}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">
                      City:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {ipInfo.city}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">
                      Region:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {ipInfo.region}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">
                      Country:
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {ipInfo.country}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
