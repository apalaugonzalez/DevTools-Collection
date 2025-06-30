// app/page.tsx
"use client";

// Import the necessary icons from lucide-react
import { ArrowRight, Mail, Search, Layers } from "lucide-react";

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
            <a
              href="/email-finder-by-domain"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </a>
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
            <a
              href="/send-html-email"
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          {/* CMS Detector Card (New) */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              {/* Using 'Layers' icon for CMS/tech stack detection */}
              <Layers className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              CMS Detector
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Identify the Content Management System of any website.
            </p>
            <a
              href="/what-cms" // This link should point to your tool's page
              className="inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Open Tool <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
