"use client";

import { useState, FormEvent, useEffect, useRef } from "react";

// --- Sub-Components for better UX ---

/**
 * A toast notification component for user feedback.
 */
const Toast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
    <div className="bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-800 text-sm font-semibold py-2 px-4 rounded-full shadow-lg">
      {message}
    </div>
  </div>
);

/**
 * Represents a single email result with animations.
 */
const ResultItem = ({
  email,
  onCopy,
  isCopied,
  isVisible,
  index,
}: {
  email: string;
  onCopy: (email: string) => void;
  isCopied: boolean;
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
        {email}
      </span>
      <button
        onClick={() => onCopy(email)}
        className="ml-4 p-1.5 rounded-full transition-all duration-200 hover:scale-110 hover:bg-slate-200 dark:hover:bg-slate-600/50"
        aria-label={`Copy email ${email}`}
      >
        {isCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-500"
          >
            <path d="M20 6 9 17l-5-5"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50 group-hover:opacity-100 transition-opacity"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
          </svg>
        )}
      </button>
    </div>
  </li>
);

// --- Main Component ---
export default function EmailFinderClient() {
  const [url, setUrl] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");

  // State for copy feedback and animations
  const [copiedIdentifier, setCopiedIdentifier] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEmails([]);
    setResultsVisible(false); // Reset animation state
    setSubmittedUrl("");

    if (!url.trim()) {
      setError("⚠️ Please enter a URL.");
      return;
    }
    setLoading(true);
    setSubmittedUrl(url.trim());
    try {
      const res = await fetch("/api/find-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "An unknown error occurred.");
      }
      setEmails(json.emails);
      if (json.emails.length > 0) {
        setTimeout(() => setResultsVisible(true), 100); // Trigger animation after a short delay
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdentifier(identifier);
    setToastMessage(
      identifier === "all" ? "All emails copied!" : "Email copied!"
    );
    setTimeout(() => {
      setCopiedIdentifier(null);
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    if (resultsVisible && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [resultsVisible]);

  const showResults = emails.length > 0;
  const showNotFoundError =
    !loading && !error && submittedUrl && emails.length === 0;

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
      `}</style>
      <div className="container mx-auto flex flex-col items-center justify-start p-6 pt-24 sm:pt-32 min-h-screen">
        {toastMessage && <Toast message={toastMessage} />}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-blue-500 dark:to-cyan-300 bg-clip-text text-transparent pb-2">
            Instant Email Finder
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Enter a website URL and we&apos;ll find the emails for you.
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
                  onChange={(e) => setUrl(e.target.value)}
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
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex justify-center items-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:bg-blue-400 dark:disabled:bg-blue-500/50 disabled:cursor-wait"
              >
                {loading ? (
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Find Emails"
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
                    Found {emails.length} email{emails.length > 1 && "s"}
                  </h2>
                  <button
                    onClick={() => handleCopy(emails.join(", "), "all")}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {copiedIdentifier === "all" ? "Copied!" : "Copy All"}
                  </button>
                </div>
                <ul className="space-y-2">
                  {emails.map((email, index) => (
                    <ResultItem
                      key={email}
                      email={email}
                      onCopy={() => handleCopy(email, email)}
                      isCopied={copiedIdentifier === email}
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
                  No emails found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We couldn&apos;t find any public emails at{" "}
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
    </>
  );
}
