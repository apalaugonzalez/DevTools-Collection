import { ArrowRight, Mail, Search } from "lucide-react";

export default function Home() {
  return (
    // Explicitly set light and dark background colors for the page
    <main className="bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center min-h-screen p-4 transition-colors duration-300">
      <div className="w-full max-w-4xl text-center">
        {/* Tools Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Email Finder by Domain Card */}
          <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6 mx-auto">
              {/* Contrasting icon colors */}
              <Search className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            {/* Contrasting heading colors */}
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              Email Finder by Domain
            </h2>
            {/* Contrasting paragraph colors */}
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
              {/* Contrasting icon colors */}
              <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            {/* Contrasting heading colors */}
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-3">
              Send HTML Email
            </h2>
            {/* Contrasting paragraph colors */}
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
        </div>
      </div>
    </main>
  );
}
