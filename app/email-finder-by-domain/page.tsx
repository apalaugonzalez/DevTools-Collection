"use client";

import Link from "next/link";
import { Home as HomeIcon, ChevronRight } from "lucide-react";
import EmailFinderClient from "./EmailFinderClient";

export default function Page() {
  return (
    // This wrapper provides the full-page gradient background, matching the other page
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
                Email Finder by Domain
              </span>
            </li>
          </ol>
        </nav>

        {/* The main tool component */}
        <EmailFinderClient />
      </div>
    </div>
  );
}
