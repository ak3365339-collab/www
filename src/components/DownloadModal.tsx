import React, { useState, useEffect } from "react";
import { X, Download, Server, CheckCircle2, Copy, ExternalLink, ShieldCheck, Sparkles, HardDrive } from "lucide-react";
import { Movie } from "../types";

interface DownloadModalProps {
  movie: Movie;
  qualityKey: "quality4k" | "quality1080p" | "quality720p" | "quality480p";
  onClose: () => void;
}

const QUALITY_INFO = {
  quality4k: { label: "4K UHD (2160p)", defaultSize: "7.2GB", badgeColor: "bg-blue-600 text-white" },
  quality1080p: { label: "Full HD (1080p)", defaultSize: "1.8GB", badgeColor: "bg-indigo-600 text-white" },
  quality720p: { label: "HD (720p)", defaultSize: "846MB", badgeColor: "bg-emerald-600 text-white" },
  quality480p: { label: "Mobile HD (480p)", defaultSize: "309MB", badgeColor: "bg-purple-600 text-white" },
};

export const DownloadModal: React.FC<DownloadModalProps> = ({
  movie,
  qualityKey,
  onClose,
}) => {
  const [countdown, setCountdown] = useState<number>(3);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const info = QUALITY_INFO[qualityKey];
  const downloadData = movie.downloads?.[qualityKey];
  const downloadSize = downloadData?.size || info.defaultSize;
  const directUrl = downloadData?.url || `https://fastdownload.cloud/movies/${movie.id}-${qualityKey}.mkv`;

  useEffect(() => {
    // Notify server of download click
    fetch(`/api/movies/${movie.id}/download-click`, { method: "POST" }).catch(() => {});

    // Countdown simulation for link generation
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [movie.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerDownload = (targetUrl: string) => {
    // Simulate real download trigger or redirect
    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0D0E12] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-6">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded font-mono ${info.badgeColor}`}>
              {info.label}
            </span>
            <span className="text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
              Size: {downloadSize}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white truncate uppercase tracking-tight">
            {movie.title}
          </h2>
        </div>

        {/* Link Generation Countdown State */}
        {!isReady ? (
          <div className="bg-[#08080A]/80 border border-white/5 rounded-xl p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin mx-auto flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Generating High Speed Fast Server Link...
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Please wait <span className="text-blue-400 font-bold text-sm">{countdown}</span> seconds while we verify secure cloud mirrors.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Ready Banner */}
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-2 rounded-lg font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Link generated successfully! Direct high speed mirrors are ready.</span>
            </div>

            {/* Fast Download Servers */}
            <div className="space-y-2.5">
              {/* Server 1 - Cloud Direct */}
              <button
                onClick={() => handleTriggerDownload(directUrl)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-xl flex items-center justify-between shadow-lg shadow-blue-900/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Server className="w-5 h-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wider font-extrabold">
                      Server 1: Fast Direct Cloud
                    </div>
                    <div className="text-[11px] font-normal text-blue-100">
                      High Speed 1Gbps • Resume Supported
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-mono bg-black/30 px-2.5 py-1 rounded">
                  <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  <span>{downloadSize}</span>
                </div>
              </button>

              {/* Server 2 - Drive / Mirror */}
              <button
                onClick={() => handleTriggerDownload(downloadData?.mirrors?.[0]?.url || directUrl)}
                className="w-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-white font-semibold p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <HardDrive className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-200">
                      Server 2: Google Drive / Mega Mirror
                    </div>
                    <div className="text-[11px] font-normal text-slate-400">
                      Backup Cloud Storage • No Wait
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>

              {/* Server 3 - Torrent / Magnet */}
              <button
                onClick={() => handleTriggerDownload(`magnet:?xt=urn:btih:${movie.id}&dn=${encodeURIComponent(movie.title)}`)}
                className="w-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-white font-medium p-3 rounded-xl flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-200">
                      Server 3: Torrent / Magnet Link
                    </div>
                    <div className="text-[11px] font-normal text-slate-400">
                      P2P High Peer Seeder Network
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Copy Link Option */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directUrl}
                className="flex-1 bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Security & Verification Footer */}
        <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Scanned with Cloud Antivirus
          </span>
          <span>Fast CDN Acceleration</span>
        </div>
      </div>
    </div>
  );
};
