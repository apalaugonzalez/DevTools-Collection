"use client";

import { useState, FormEvent, useEffect, useRef } from "react";

// --- Sub-Components for Terminal UX ---

/**
 * Terminal-style toast notification
 */
const TerminalToast = ({ message }: { message: string }) => (
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
    <div className="bg-black border border-green-500 text-green-400 font-mono text-sm py-2 px-4 shadow-lg shadow-green-500/20">
      <span className="text-green-500">$</span> {message}
    </div>
  </div>
);

/**
 * Terminal-style email result item
 */
const TerminalResultItem = ({
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
  <div
    className={`transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <div className="group flex items-center justify-between hover:bg-gray-900/50 p-2 border-l-2 border-transparent hover:border-green-500 transition-all duration-200">
      <div className="flex items-center space-x-2 flex-1">
        <span className="text-green-500 font-mono text-sm">→</span>
        <span className="font-mono text-sm text-green-400 break-all">
          {email}
        </span>
      </div>
      <button
        onClick={() => onCopy(email)}
        className="ml-4 px-2 py-1 font-mono text-xs border border-gray-700 hover:border-green-500 hover:text-green-400 transition-all duration-200 bg-gray-900 hover:bg-gray-800"
        aria-label={`Copy email ${email}`}
      >
        {isCopied ? (
          <span className="text-green-400">✓ copied</span>
        ) : (
          <span className="text-gray-400">copy</span>
        )}
      </button>
    </div>
  </div>
);

/**
 * Terminal loading animation
 */
const TerminalLoader = () => (
  <div className="flex items-center space-x-1 text-green-400 font-mono text-sm">
    <span>scanning</span>
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
export default function TerminalEmailFinder() {
  const [url, setUrl] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // State for copy feedback and animations
  const [copiedIdentifier, setCopiedIdentifier] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);

  const [cursorPos, setCursorPos] = useState(0);

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateCursor = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setCursorPos(target.selectionStart || 0);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEmails([]);
    setResultsVisible(false);
    setSubmittedUrl("");

    if (!url.trim()) {
      setError("Error: URL parameter required");
      return;
    }

    const command = `find-emails --url="${url.trim()}"`;
    setCommandHistory((prev) => [...prev, command]);
    setLoading(true);
    setSubmittedUrl(url.trim());
    // Reset cursor position on submit as input might clear or lose focus logic
    setCursorPos(0);

    try {
      const res = await fetch("/api/find-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Process terminated with error code 1");
      }
      setEmails(json.emails);
      if (json.emails.length > 0) {
        setTimeout(() => setResultsVisible(true), 200);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Error: ${message}`);
    } finally {
      setLoading(false);
      // Refocus input after loading
      setTimeout(() => {
        inputRef.current?.focus();
        // We might want to restore cursor position if we kept the URL, 
        // but here we might want to start fresh or keep it. 
        // The URL state is preserved, so let's update cursor to end.
        if (inputRef.current) {
          setCursorPos(inputRef.current.value.length);
        }
      }, 0);
    }
  }

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIdentifier(identifier);
    setToastMessage(
      identifier === "all"
        ? `Copied ${emails.length} emails to clipboard`
        : "Email copied to clipboard"
    );
    setTimeout(() => {
      setCopiedIdentifier(null);
      setToastMessage(null);
    }, 2500);
  };

  const clearTerminal = () => {
    setEmails([]);
    setError(null);
    setCommandHistory([]);
    setSubmittedUrl("");
    setUrl("");
    setCursorPos(0);
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
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      <div className="min-h-screen bg-black text-green-400 font-mono p-4">
        {toastMessage && <TerminalToast message={toastMessage} />}

        <div className="max-w-4xl mx-auto">
          {/* Terminal Header */}
          <div className="border border-gray-700 bg-gray-900 mb-4">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm">email-finder-v2.1.0</span>
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
                <div>Email Finder Terminal v2.1.0</div>
                <div className="text-gray-500">
                  Type a URL to scan for email addresses
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  Usage: find-emails --url=&quot;domain.com&quot;
                </div>
              </div>

              {/* Command History */}
              {commandHistory.map((cmd, index) => (
                <div key={index} className="text-gray-400">
                  <span className="text-green-500">user@terminal:~$</span> {cmd}
                </div>
              ))}

              {/* Current Command Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center space-x-2"
              >
                <span className="text-green-500">user@terminal:~$</span>
                <span className="text-gray-400">find-emails --url=&quot;</span>
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
                    placeholder="example.com"
                    className="w-full bg-transparent border-none outline-none text-green-400 font-mono placeholder-gray-600 caret-transparent"
                    disabled={loading}
                    autoComplete="off"
                  />
                  {!loading && (
                    <div
                      className="absolute top-0 pointer-events-none text-green-400 animate-blink"
                      style={{ left: `${cursorPos}ch` }}
                    >
                      █
                    </div>
                  )}
                </div>
                <span className="text-gray-400">&quot;</span>
                {!loading && (
                  <button
                    type="submit"
                    className="text-gray-500 hover:text-green-400 transition-colors ml-4 px-2 py-1 border border-gray-700 hover:border-green-500 text-sm"
                  >
                    [ENTER]
                  </button>
                )}
              </form>

              {/* Loading State */}
              {loading && (
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
                  className="mt-6 border border-green-500 bg-green-500/5"
                >
                  <div className="bg-green-500/10 px-3 py-2 border-b border-green-500 flex justify-between items-center">
                    <span className="text-green-400 font-semibold">
                      ✓ Scan complete: {emails.length} email
                      {emails.length !== 1 ? "s" : ""} found
                    </span>
                    <button
                      onClick={() => handleCopy(emails.join("\n"), "all")}
                      className="text-xs px-2 py-1 border border-green-600 hover:bg-green-500/20 transition-colors"
                    >
                      {copiedIdentifier === "all" ? "✓ copied all" : "copy all"}
                    </button>
                  </div>
                  <div className="p-3 space-y-1">
                    {emails.map((email, index) => (
                      <TerminalResultItem
                        key={email}
                        email={email}
                        onCopy={() => handleCopy(email, email)}
                        isCopied={copiedIdentifier === email}
                        isVisible={resultsVisible}
                        index={index}
                      />
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-green-600 text-green-600 text-sm">
                    Process completed successfully (exit code 0)
                  </div>
                </div>
              )}

              {/* No Results Found */}
              {showNotFoundError && (
                <div className="mt-4 p-3 border border-yellow-500 bg-yellow-500/10 text-yellow-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">⚠</span>
                    <span>No email addresses found at {submittedUrl}</span>
                  </div>
                  <div className="text-yellow-600 text-sm mt-1">
                    The target may not have publicly accessible emails
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Footer */}
          <div className="text-gray-600 text-sm text-center space-y-1">
            <div>
              Press Ctrl+C to interrupt • Type &apos;clear&apos; to reset
              terminal
            </div>
            <div className="text-gray-700">
              Built with ❤️ for developers • Status: Online
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
