// app/page.tsx
"use client";

import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Home as HomeIcon } from "lucide-react";

// --- Type Definitions ---
interface CmsDetectionResponse {
  detectedCms?: string[];
  message?: string;
  error?: string;
}

// --- Sub-Components for better UX ---

/**
 * Represents a single CMS result with animations.
 */
const ResultItem = ({
  cms,
  isVisible,
  index,
}: {
  cms: string;
  isVisible: boolean;
  index: number;
}) => (
  <li
    className={`transition-all duration-500 ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
    style={{ transitionDelay: `${index * 75}ms` }}
  >
    <div className="group flex items-center justify-between bg-slate-100 dark:bg-slate-700/60 p-2.5 rounded-lg">
      <span className="break-all font-mono text-sm text-slate-600 dark:text-slate-300">
        {cms}
      </span>
    </div>
  </li>
);

// --- Main Component ---
export default function CmsDetectorPage() {
  const [url, setUrl] = useState("");
  const [cmsInfo, setCmsInfo] = useState<CmsDetectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");

  // State for animations
  const [resultsVisible, setResultsVisible] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

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
      setError("⚠️ Please enter a URL.");
      return;
    }
    if (!/^https?:\/\//i.test(urlToValidate)) {
      urlToValidate = `https://${urlToValidate}`;
    }

    try {
      new URL(urlToValidate);
    } catch {
      setError("⚠️ Please enter a valid URL format.");
      return;
    }

    setIsLoading(true);
    setSubmittedUrl(urlToValidate);

    try {
      const res = await fetch(
        `/api/custom-detect?url=${encodeURIComponent(urlToValidate)}`
      );
      const data: CmsDetectionResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }
      setCmsInfo(data);
      if (data.detectedCms && data.detectedCms.length > 0) {
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

  const showResults = cmsInfo?.detectedCms && cmsInfo.detectedCms.length > 0;
  const showNotFoundError =
    !isLoading && !error && submittedUrl && !showResults;

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
                CMS Detector
              </span>
            </li>
          </ol>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-500 dark:to-cyan-300 bg-clip-text text-transparent pb-2">
            CMS Detector
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Enter a website URL and we&apos;ll identify its CMS.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg dark:shadow-blue-500/10 w-full max-w-lg transition-all">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path>
                </svg>
                <input
                  type="text"
                  placeholder="example.com"
                  value={url}
                  onChange={handleUrlChange}
                  className="w-full pl-11 pr-10 py-3 border bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 transition-all"
                />
                {url && (
                  <button
                    type="button"
                    onClick={() => setUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
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
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex justify-center items-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-400 dark:disabled:bg-blue-500/50 disabled:cursor-wait"
              >
                {isLoading ? (
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Detect CMS"
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Found {cmsInfo.detectedCms?.length} result
                    {cmsInfo.detectedCms &&
                      cmsInfo.detectedCms.length > 1 &&
                      "s"}
                  </h2>
                </div>
                <ul className="space-y-2">
                  {cmsInfo.detectedCms?.map((cms, index) => (
                    <ResultItem
                      key={cms}
                      cms={cms}
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
                  No CMS Detected
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We couldn&apos;t identify a specific CMS for{" "}
                  <span className="font-mono text-slate-600 dark:text-slate-300">
                    {submittedUrl}
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
