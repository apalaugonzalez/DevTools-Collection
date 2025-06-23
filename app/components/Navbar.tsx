import Link from "next/link";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Site Title */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-slate-800 dark:text-slate-200"
            >
              IT Tools
            </Link>
          </div>

          {/* Navigation Links (add more here as needed) */}
          <nav className="hidden md:flex md:space-x-8">
            <Link
              href="/email-finder-by-domain"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Email Finder
            </Link>
          </nav>

          {/* Theme Switcher on the right */}
          <div className="flex items-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
