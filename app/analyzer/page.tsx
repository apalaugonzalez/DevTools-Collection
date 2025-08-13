/*
 * =======================================================================
 * FILE: app/analyzer/page.tsx (Updated)
 * =======================================================================
 *
 * This is the frontend page for the Website Technology Analyzer.
 * It provides a UI to send a URL to the `/api/analyze` endpoint
 * and displays the results.
 *
 * - It's a Client Component, allowing for state and user interaction.
 * - It manages state for the input URL, loading status, errors, and results.
 * - It uses Tailwind CSS for styling to create a modern, responsive layout.
 * - This version includes TypeScript fixes for type safety.
 *
 */
"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

// --- Type Definitions ---
interface IAnalysisResults {
  analyzedUrl: string;
  detected: string[];
}

// --- Data for Common URLs ---
const commonUrls = [
  { name: "Next.js", url: "nextjs.org" },
  { name: "React", url: "react.dev" },
  { name: "Vue.js", url: "vuejs.org" },
  { name: "Angular", url: "angular.io" },
  { name: "Svelte", url: "svelte.dev" },
  { name: "WordPress", url: "wordpress.com" },
  { name: "Shopify", url: "shopify.com" },
  { name: "GitHub", url: "github.com" },
  { name: "Vercel", url: "vercel.com" },
  { name: "Netlify", url: "netlify.com" },
];

// A map to associate technology names with potential logo components or colors
const techColorMap: { [key: string]: string } = {
  "Next.js": "border-l-white",
  React: "border-l-cyan-400",
  WordPress: "border-l-blue-500",
  Shopify: "border-l-green-500",
  "Vue.js": "border-l-emerald-500",
  Angular: "border-l-red-600",
  Wix: "border-l-yellow-500",
  Squarespace: "border-l-gray-400",
  Gatsby: "border-l-purple-500",
  SvelteKit: "border-l-orange-500",
  "Generic HTML/JS": "border-l-gray-600",
  PHP: "border-l-indigo-400",
  "ASP.NET": "border-l-blue-400",
  Express: "border-l-gray-300",
  Nginx: "border-l-green-400",
  Apache: "border-l-red-500",
  Cloudflare: "border-l-orange-500",
  Vercel: "border-l-white",
  Netlify: "border-l-teal-400",
  WooCommerce: "border-l-purple-500",
  Joomla: "border-l-orange-400",
  Drupal: "border-l-blue-600",
  Ghost: "border-l-slate-300",
  Bootstrap: "border-l-purple-600",
  "Tailwind CSS": "border-l-cyan-500",
  "Google Analytics": "border-l-yellow-400",
};

// --- Sub-Components ---
const ResultItem = ({
  tech,
  isVisible,
  index,
}: {
  tech: string;
  isVisible: boolean;
  index: number;
}) => (
  <li
    className={`transition-all duration-500 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
    style={{ transitionDelay: `${index * 50}ms` }}
  >
    <div
      className={`bg-slate-100 dark:bg-slate-700/60 p-2.5 rounded-lg border-l-4 ${
        techColorMap[tech] || "border-l-gray-500"
      }`}
    >
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {tech}
      </span>
    </div>
  </li>
);

// --- Main Component ---
export default function AnalyzerPage() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<IAnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
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
      setError("⚠️ Please enter a URL to analyze.");
      return;
    }

    setIsLoading(true);
    setSubmitted(true);

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
        throw new Error(data.details || "An unknown error occurred.");
      }

      setResults(data);
      if (data.detected && data.detected.length > 0) {
        setTimeout(() => setResultsVisible(true), 100);
      }
    } catch (err: unknown) {
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

  const showResults = results !== null && results.detected.length > 0;
  const showNotFoundError =
    submitted && !isLoading && !error && results?.detected.length === 0;

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
                Website Analyzer
              </span>
            </li>
          </ol>
        </nav>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-500 dark:to-cyan-300 bg-clip-text text-transparent pb-2">
            Website Tech Scanner
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Enter a URL to see what framework it&apos;s built with.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg dark:shadow-blue-500/10 w-full max-w-lg transition-all">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="url-input"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Website URL
                </label>
                <input
                  id="url-input"
                  type="text"
                  placeholder="e.g., nextjs.org"
                  value={url}
                  onChange={handleInputChange(setUrl)}
                  className="w-full px-4 py-3 border bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 transition-all"
                />
              </div>

              {/* Common URLs Selection */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-3">
                  Or select a popular website:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {commonUrls.map((site) => (
                    <button
                      key={site.url}
                      type="button"
                      onClick={() => handleCommonUrlClick(site.url)}
                      className="px-3 py-1 text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {site.name}
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
                  "Analyze Website"
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
                  Detected Technologies:
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                  Results for:{" "}
                  <a
                    href={results.analyzedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
                  >
                    {results.analyzedUrl}
                  </a>
                </p>
                <ul className="space-y-2">
                  {results.detected.map((tech, index) => (
                    <ResultItem
                      key={tech}
                      tech={tech}
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
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2-2H5a2 2 0 01-2-2z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-md font-semibold text-slate-800 dark:text-white">
                  No Technologies Detected
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Unable to detect any technologies for{" "}
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {url}
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
