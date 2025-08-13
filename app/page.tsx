// app/page.tsx
"use client";

// Import the necessary icons from lucide-react
import {
  ArrowRight,
  Mail,
  Search,
  Layers,
  Globe,
  ScanLine,
  Monitor,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    // Explicitly set light and dark background colors for the page
    <main className="bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300">
      <div className="w-full max-w-6xl text-center">
        {/* Main heading for the tools page */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent pb-3">
            IT Tools
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mt-2">
            A collection of useful tools for developers and IT professionals.
          </p>
        </div>

        {/* Responsive grid for the tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Email Finder by Domain Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <Search className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              Email Finder by Domain
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Discover email addresses associated with a specific domain name.
            </p>
            <Link
              href="/email-finder-by-domain"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Send HTML Email Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              Send HTML Email
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Compose and send HTML emails directly from your browser.
            </p>
            <Link
              href="/send-html-email"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* CMS Detector Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <Layers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              CMS Detector
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Identify the Content Management System of any website.
            </p>
            <Link
              href="/what-cms"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* What Is My IP Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <Globe className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              What Is My IP?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Quickly find and copy your public IP address.
            </p>
            <Link
              href="/what-is-my-ip"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Port Scanner Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <ScanLine className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              Port Scanner
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Check for open ports on a specific host or IP address.
            </p>
            <Link
              href="/find-open-ports"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Website Tech Scanner Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <Monitor className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              Website Tech Scanner
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Analyze websites to detect technologies, frameworks, and tools
              used.
            </p>
            <Link
              href="/analyzer"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* PageSpeed Insights Card (New) */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              PageSpeed Insights
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Analyze website performance, accessibility, and SEO metrics with
              Google Lighthouse.
            </p>
            <Link
              href="/pagespeed"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
