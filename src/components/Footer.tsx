import React from "react";
import { Film, Shield, Send, Heart, Download } from "lucide-react";
import { Category, SiteSettings } from "../types";

interface FooterProps {
  categories: Category[];
  settings: SiteSettings;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  categories,
  settings,
  onSelectCategory,
  onOpenAdmin,
}) => {
  return (
    <footer className="mt-16 bg-[#050507] border-t border-white/5 text-slate-400 text-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.4)]">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-tight">
                {settings.siteName || "CineFlix"}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {settings.siteDescription ||
                "High-speed movie download portal providing 4K, 1080p, 720p, and 480p prints in Dual Audio (Hindi, English, Tamil, Telugu, Korean, and Japanese). Enjoy seamless direct cloud streaming and downloads."}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-blue-400">
                4K UHD [7.2GB]
              </span>
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-slate-300">
                1080p [1.8GB]
              </span>
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-emerald-400">
                720p [846MB]
              </span>
              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded text-purple-400">
                480p [309MB]
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Browse Categories
            </h4>
            <div className="flex flex-col space-y-1.5">
              {categories.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCategory(c.name)}
                  className="text-left text-slate-400 hover:text-blue-400 transition-colors text-xs cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Portal Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Portal Links
            </h4>
            <div className="flex flex-col space-y-2 text-xs">
              {settings.telegramLink && (
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline font-semibold"
                >
                  <Send className="w-3.5 h-3.5" /> Official Telegram
                </a>
              )}
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer text-left"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Admin Access
              </button>
              <div className="pt-2 text-[11px] text-slate-500 leading-normal">
                Disclaimer: All movies and media links are indexed from third-party public cloud servers for educational & evaluation purposes.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} {settings.siteName || "CineFlix"}. All Rights Reserved. Responsive Fast Cloud Architecture.
          </div>
          <div className="text-slate-400 flex items-center gap-1">
            Built with ultra-fast direct cloud download engine
          </div>
        </div>
      </div>
    </footer>
  );
};
