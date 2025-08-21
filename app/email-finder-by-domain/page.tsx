"use client";

import Link from "next/link";
import { Home as HomeIcon, ChevronRight, Terminal, Wifi } from "lucide-react";
import EmailFinderClient from "./EmailFinderClient";

export default function Page() {
  return (
    // Terminal-style full-page background
    <div className="w-full min-h-screen bg-black text-green-400 font-mono">
      {/* Terminal Status Bar */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-400">ONLINE</span>
              </div>
              <div className="flex items-center space-x-1">
                <Wifi className="h-3 w-3" />
                <span className="text-gray-400">Connected</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <span>Session: {new Date().toLocaleTimeString()}</span>
              <span>PID: 1337</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl">
        {/* Terminal-style Breadcrumbs Navigation */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <div className="bg-gray-900 border border-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">user@system:</span>
              <span className="text-blue-400">~</span>
              <span className="text-gray-400">/</span>
              <Link
                href="/"
                className="flex items-center text-gray-400 hover:text-green-400 transition-colors group"
              >
                <HomeIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="group-hover:underline">home</span>
              </Link>
              <span className="text-gray-600">/</span>
              <ChevronRight className="h-3 w-3 text-gray-600" />
              <span className="text-gray-600">/</span>
              <span className="font-medium text-green-400" aria-current="page">
                tools/email-finder
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-600">
              Current directory: /var/www/tools/email-finder
            </div>
          </div>
        </nav>

        {/* Terminal Header with ASCII Art */}
        <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
          <div className="text-center space-y-2">
            <pre className="text-green-500 text-xs leading-tight">
              {`
 ███████╗███╗   ███╗ █████╗ ██╗██╗         ███████╗██╗███╗   ██╗██████╗ ███████╗██████╗ 
 ██╔════╝████╗ ████║██╔══██╗██║██║         ██╔════╝██║████╗  ██║██╔══██╗██╔════╝██╔══██╗
 █████╗  ██╔████╔██║███████║██║██║         █████╗  ██║██╔██╗ ██║██║  ██║█████╗  ██████╔╝
 ██╔══╝  ██║╚██╔╝██║██╔══██║██║██║         ██╔══╝  ██║██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
 ███████╗██║ ╚═╝ ██║██║  ██║██║███████╗    ██║     ██║██║ ╚████║██████╔╝███████╗██║  ██║
 ╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
`}
            </pre>
            <div className="space-y-1 text-sm">
              <div className="text-gray-400">
                Advanced Email Discovery Tool • Version 2.1.0
              </div>
              <div className="text-gray-600">
                Scan domains for publicly accessible email addresses
              </div>
            </div>
          </div>
        </div>

        {/* System Information Panel */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <Terminal className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm">
                SYSTEM
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div>OS: Linux Ubuntu 22.04</div>
              <div>Shell: bash 5.1.16</div>
              <div>Node: v18.17.0</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-semibold text-sm">
                STATUS
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Service: Active</div>
              <div>Uptime: 99.9%</div>
              <div>Load: 0.23</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-green-400 font-semibold text-sm">
                NETWORK
              </span>
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Latency: 12ms</div>
              <div>Bandwidth: 1Gbps</div>
              <div>SSL: Enabled</div>
            </div>
          </div>
        </div>

        {/* Command Help Panel */}
        <div className="mb-6 bg-gray-900 border border-gray-700 p-4 rounded">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-cyan-400 font-semibold">
              USAGE INSTRUCTIONS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="text-gray-400">Available Commands:</div>
              <div className="space-y-1 text-xs font-mono">
                <div>
                  <span className="text-green-400">find-emails</span>{" "}
                  <span className="text-gray-500">
                    --url=&quot;domain.com&quot;
                  </span>
                </div>
                <div>
                  <span className="text-green-400">clear</span>{" "}
                  <span className="text-gray-500">{"// Reset terminal"}</span>
                </div>
                <div>
                  <span className="text-green-400">copy</span>{" "}
                  <span className="text-gray-500">{"// Copy results"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-gray-400">Examples:</div>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-gray-500">
                  $ find-emails --url=&quot;github.com&quot;
                </div>
                <div className="text-gray-500">
                  $ find-emails --url=&quot;stackoverflow.com&quot;
                </div>
                <div className="text-gray-500">
                  $ find-emails --url=&quot;company.com&quot;
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The main terminal tool component */}
        <EmailFinderClient />

        {/* Terminal Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-gray-600 text-xs">
            <span className="text-gray-500">©</span> 2024 Email Finder Terminal
            •<span className="text-green-600"> Open Source</span> •
            <span className="text-blue-500"> MIT License</span>
          </div>
          <div className="text-gray-700 text-xs">
            For support, type &apos;help&apos; or visit our documentation
          </div>
        </div>
      </div>
    </div>
  );
}
