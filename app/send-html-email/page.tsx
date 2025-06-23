"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";
import { Home as HomeIcon, ChevronRight } from "lucide-react";

interface Flash {
  type: "success" | "error" | "info";
  message: string;
}

export default function EmailSender() {
  const [templates, setTemplates] = useState<string[]>([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [flash, setFlash] = useState<Flash | null>(null);
  const [sending, setSending] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load available templates
  useEffect(() => {
    fetch("/api/templates")
      .then((res) => res.json())
      .then((data: string[]) => setTemplates(data))
      .catch(() => setTemplates([]));
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Scales the preview to fit its container width
  useEffect(() => {
    const container = previewContainerRef.current;
    const preview = previewRef.current;

    if (!container || !preview || !htmlContent) {
      setPreviewScale(1);
      return;
    }

    const observer = new ResizeObserver(() => {
      const containerWidth = container.clientWidth;
      const contentWidth = preview.scrollWidth;

      if (contentWidth > 0 && containerWidth > 0) {
        setPreviewScale(Math.min(1, containerWidth / contentWidth));
      }
    });

    observer.observe(container);
    observer.observe(preview);

    setTimeout(() => {
      const containerWidth = container.clientWidth;
      const contentWidth = preview.scrollWidth;
      if (contentWidth > 0 && containerWidth > 0) {
        setPreviewScale(Math.min(1, containerWidth / contentWidth));
      }
    }, 50);

    return () => observer.disconnect();
  }, [htmlContent]);

  // Handle template change
  const handleTemplateChange = async (tmpl: string) => {
    setTemplate(tmpl);
    if (!tmpl || tmpl === "blank") {
      setHtmlContent("");
      return;
    }
    setLoadingTemplate(true);
    try {
      const res = await fetch(`/api/load-template/${tmpl}`);
      const html = await res.text();
      setHtmlContent(html);
    } catch {
      setFlash({ type: "error", message: "Failed to load template." });
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));
    if (imageFile) {
      handleImage(imageFile);
    }
  };

  // Handle image upload embedding
  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgTag = `<img src="${reader.result}" style="max-width:100%; border-radius:8px; margin: 16px 0;" alt="" />`;
      setHtmlContent((prev) => prev + "\n" + imgTag);
    };
    reader.readAsDataURL(file);
  };

  // Send email via API
  const sendEmail = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFlash(null);

    try {
      const payload = { to, subject, template, message: htmlContent };
      const res = await fetch("/api/send-html-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFlash({
          type: "success",
          message: "Emails sent successfully!",
        });
        setTo("");
        setSubject("");
        setTemplate("");
        setHtmlContent("");
      } else {
        const errMsg = data.error || "Send failed";
        throw new Error(errMsg);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFlash({ type: "error", message: msg });
    } finally {
      setSending(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const fullscreenTarget = document.querySelector("#preview-section");
    if (!document.fullscreenElement) {
      fullscreenTarget?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 max-w-7xl">
        {/* Breadcrumbs Navigation */}
        <nav className="mb-8" aria-label="Breadcrumb">
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
                Send HTML Email
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <span className="text-white text-2xl">📧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Email Sender
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and send beautiful HTML emails with live preview
              </p>
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {flash && (
          <div
            className={`mb-6 rounded-xl p-4 shadow-lg border-l-4 transition-all duration-300 ${
              flash.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-300"
                : flash.type === "error"
                ? "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-300"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {flash.type === "success" ? (
                  <span className="text-lg">✅</span>
                ) : flash.type === "error" ? (
                  <span className="text-lg">❌</span>
                ) : (
                  <span className="text-lg">ℹ️</span>
                )}
                <span className="font-medium">{flash.message}</span>
              </div>
              <button
                onClick={() => setFlash(null)}
                className="hover:opacity-70 transition-opacity"
              >
                <span className="text-lg">✖️</span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 lg:p-8 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <span>💻</span>
              Compose Email
            </h2>

            <form onSubmit={sendEmail} className="space-y-6">
              {/* Recipients */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>👥</span>
                  Recipients *
                </label>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="john@example.com, maria@example.com"
                  className="w-full p-3 lg:p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Separate multiple emails with commas
                </p>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>📝</span>
                  Subject *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 lg:p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter email subject..."
                  required
                />
              </div>

              {/* Template */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>🎨</span>
                  Email Template
                </label>
                <select
                  value={template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full p-3 lg:p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={loadingTemplate}
                >
                  <option value="">Choose a template...</option>
                  <option value="blank">Blank Template</option>
                  {templates.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {loadingTemplate && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <span className="animate-spin">⏳</span>
                    Loading template...
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>🖼️</span>
                  Add Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 lg:p-8 text-center relative transition-all ${
                    dragOver
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      e.target.files?.[0] && handleImage(e.target.files[0])
                    }
                  />
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📤</span>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-300 text-sm lg:text-base">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* HTML Content */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span>💻</span>
                  HTML Content *
                </label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  rows={12}
                  className="w-full p-3 lg:p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
                  placeholder="Enter your HTML content here..."
                  required
                />
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{htmlContent.length} characters</span>
                  <span>HTML will be rendered in preview</span>
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={sending || !to || !subject || !htmlContent}
                className="w-full py-3 lg:py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                {sending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Send Email
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview Section */}
          <div
            id="preview-section"
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>👁️</span>
                Live Preview
              </h2>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <span className="text-lg">🗗</span>
                ) : (
                  <span className="text-lg">🗖</span>
                )}
              </button>
            </div>

            {/* Preview Container - Full Height */}
            <div
              ref={previewContainerRef}
              className="border border-gray-200 dark:border-gray-600 rounded-xl overflow-auto bg-gray-50 dark:bg-slate-900 relative flex-1"
              style={{ minHeight: "600px" }}
            >
              <div
                ref={previewRef}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                className="bg-white"
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                  width: `${(1 / previewScale) * 100}%`,
                  height: `${(1 / previewScale) * 100}%`,
                  scrollbarWidth: "none",
                }}
              />

              {!htmlContent && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-4">
                  <span className="text-6xl mb-4">📧</span>
                  <p className="text-base lg:text-lg font-medium text-center">
                    Your email preview will appear here
                  </p>
                  <p className="text-sm text-center">
                    Start typing or select a template to see the magic
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
