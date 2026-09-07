import React, { useState } from "react";
import { Film, Search, Shield, X, Sparkles, Send, Clapperboard, Globe } from "lucide-react";
import { Category, SiteSettings } from "../types";

interface NavbarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdmin: () => void;
  settings: SiteSettings;
}

const COMMON_LANGUAGES = [
  "All",
  "Hindi",
  "English",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Korean",
  "Japanese"
];

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  onOpenAdmin,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#08080A]/90 backdrop-blur-md border-b border-white/5 shadow-2xl">
      {/* Announcement Bar */}
      {settings.announcement && (
        <div className="bg-gradient-to-r from-blue-950/80 via-blue-900/50 to-blue-950/80 border-b border-blue-500/20 text-slate-200 text-xs py-1.5 px-4 font-medium text-center flex items-center justify-center gap-2 overflow-hidden shadow-inner">
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse text-blue-400" />
          <span className="truncate">{settings.announcement}</span>
          {settings.telegramLink && (
            <a
              href={settings.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-2 font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 shrink-0"
            >
              <Send className="w-3 h-3" /> Join Telegram
            </a>
          )}
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo */}
          <div
            onClick={() => {
              onSelectCategory("all");
              onSelectLanguage("All");
              onSearchChange("");
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1 uppercase">
                {settings.siteName || "CineFlix"}{" "}
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  4K
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">
                Fast Direct Downloads
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search movies by title, actors, director, or genres..."
                className="w-full bg-[#0D0E12] text-slate-100 placeholder-slate-500 text-sm rounded-full pl-11 pr-10 py-2.5 border border-white/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative hidden lg:flex items-center gap-1.5 bg-[#0D0E12] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value)}
                className="bg-transparent border-none text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                {COMMON_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-[#0D0E12] text-slate-200">
                    {lang === "All" ? "All Languages" : lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-blue-900/30 cursor-pointer"
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search movies, actors, 4K, 1080p..."
              className="w-full bg-[#0D0E12] text-slate-100 placeholder-slate-500 text-xs rounded-lg pl-9 pr-8 py-2 border border-white/10 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Scroll Bar */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto scrollbar-none border-t border-white/5 text-xs font-medium">
          <button
            onClick={() => onSelectCategory("all")}
            className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-blue-600/15 text-blue-400 font-bold border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                : "bg-[#0D0E12]/80 text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-white/5"
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            All Movies
          </button>

          {categories.map((cat) => {
            const isActive =
              selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
              selectedCategory.toLowerCase() === cat.slug.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 font-bold border border-blue-500/40 shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                    : "bg-[#0D0E12]/80 text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-white/5"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
