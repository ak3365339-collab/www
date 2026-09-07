import React, { useState } from "react";
import { X, Download, Star, Film, Eye, ArrowDownCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Movie } from "../types";

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onDownloadClick: (movie: Movie, qualityKey: "quality4k" | "quality1080p" | "quality720p" | "quality480p") => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onDownloadClick,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0D0E12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Title and Close Button */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#08080A]/95 shrink-0">
          <div className="flex items-center gap-2 truncate pr-2">
            <Film className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-base sm:text-lg font-bold text-white truncate uppercase tracking-tight">
              {movie.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-7">
          {/* Top Section: Poster & Meta Details */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Poster Card */}
            <div className="w-full sm:w-60 shrink-0 rounded-xl overflow-hidden border border-white/10 shadow-xl bg-[#08080A]">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-84 object-cover"
              />
              <div className="p-3 bg-[#0D0E12] text-center border-t border-white/5 space-y-1">
                <span className="inline-block text-xs font-bold text-blue-400">
                  {movie.releaseYear} • {movie.categories.join(", ")}
                </span>
                <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" /> {movie.views?.toLocaleString() || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-slate-500" /> {movie.downloadsCount?.toLocaleString() || 0} downloads
                  </span>
                </div>
              </div>
            </div>

            {/* Exactly Specified Details Section */}
            <div className="flex-1 space-y-4 text-sm w-full">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {movie.title}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  High Definition Direct Fast Server Download
                </p>
              </div>

              {/* Exact user requested specs layout */}
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5 space-y-2.5">
                {/* IMDb Rating */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    IMDb Rating:
                  </span>
                  <span className="font-bold text-yellow-500 flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded w-fit text-xs">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    {movie.imdbRating || "N/A"}
                  </span>
                </div>

                {/* Genres */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Genres:
                  </span>
                  <span className="text-slate-200">
                    {movie.genres.join(", ")}
                  </span>
                </div>

                {/* Language */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Language:
                  </span>
                  <span className="text-blue-400 font-medium">
                    {movie.languages.join(", ")}
                  </span>
                </div>

                {/* Quality */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Quality:
                  </span>
                  <span className="text-slate-200 font-mono text-xs">
                    {movie.quality || "4K UHD | 1080p | 720p | 480p"}
                  </span>
                </div>

                {/* Size */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Size:
                  </span>
                  <span className="text-slate-200 font-mono text-xs">
                    {movie.size || "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]"}
                  </span>
                </div>

                {/* Director */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Director:
                  </span>
                  <span className="text-slate-200">
                    {movie.director || "N/A"}
                  </span>
                </div>

                {/* Writers */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Writers:
                  </span>
                  <span className="text-slate-200">
                    {movie.writers || "N/A"}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <span className="font-semibold text-slate-400 min-w-32 text-xs uppercase tracking-wider">
                    Stars:
                  </span>
                  <span className="text-slate-200">
                    {movie.stars || "N/A"}
                  </span>
                </div>

                {/* Storyline */}
                <div className="flex flex-col gap-1 pt-1">
                  <span className="font-semibold text-slate-400 text-xs uppercase tracking-wider">
                    Storyline:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm bg-[#08080A]/80 p-3 rounded-lg border border-white/5">
                    {movie.storyline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Screenshots Gallery Section */}
          {movie.screenshots && movie.screenshots.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Movie Screenshots / Sample Images
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {movie.screenshots.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="group relative rounded-xl overflow-hidden border border-white/10 aspect-video bg-[#08080A] cursor-pointer hover:border-blue-500/60 transition-all shadow-md"
                  >
                    <img
                      src={imgUrl}
                      alt={`Screenshot ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#08080A]/90 text-white text-xs px-2.5 py-1 rounded-md border border-white/10 shadow-md">
                        Click to view full
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DOWNLOAD LINKS SECTION (Exact sizes specified by user) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-black text-white uppercase tracking-wide">
                  Fast Direct Download Links
                </h3>
              </div>
              <span className="text-xs text-blue-400 font-mono">100% Virus-free & Verified</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Download in 4K – 7.2GB */}
              <div className="bg-gradient-to-br from-blue-600/20 via-[#0D0E12] to-[#0D0E12] border border-blue-500/40 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded font-mono">
                      ULTRA HD 2160p
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Download in 4K – 7.2GB
                    </h4>
                    <p className="text-xs text-slate-400">
                      HEVC 10-bit • Dolby Atmos Audio • HDR10
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400 bg-black/60 border border-blue-500/30 px-2 py-1 rounded">
                    7.2 GB
                  </span>
                </div>

                <button
                  onClick={() => onDownloadClick(movie, "quality4k")}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-900/40 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download in 4K – 7.2GB
                </button>
              </div>

              {/* Download in 1080p – 1.8GB */}
              <div className="bg-gradient-to-br from-indigo-500/15 via-[#0D0E12] to-[#0D0E12] border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded font-mono">
                      FULL HD 1080p
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Download in 1080p – 1.8GB
                    </h4>
                    <p className="text-xs text-slate-400">
                      x264 / x265 • 5.1 Surround Sound • Multi Subs
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-400 bg-black/60 border border-indigo-500/30 px-2 py-1 rounded">
                    1.8 GB
                  </span>
                </div>

                <button
                  onClick={() => onDownloadClick(movie, "quality1080p")}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-md shadow-indigo-900/40 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download in 1080p – 1.8GB
                </button>
              </div>

              {/* Download in 720p – 846MB */}
              <div className="bg-gradient-to-br from-emerald-500/15 via-[#0D0E12] to-[#0D0E12] border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded font-mono">
                      HD 720p
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Download in 720p – 846MB
                    </h4>
                    <p className="text-xs text-slate-400">
                      Standard HD • Clean Audio • Best Balance
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-black/60 border border-emerald-500/30 px-2 py-1 rounded">
                    846 MB
                  </span>
                </div>

                <button
                  onClick={() => onDownloadClick(movie, "quality720p")}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-900/40 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download in 720p – 846MB
                </button>
              </div>

              {/* Download in 480p – 309MB */}
              <div className="bg-gradient-to-br from-purple-500/15 via-[#0D0E12] to-[#0D0E12] border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600 text-white px-2 py-0.5 rounded font-mono">
                      MOBILE SD 480p
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      Download in 480p – 309MB
                    </h4>
                    <p className="text-xs text-slate-400">
                      Mobile Friendly • Low Data Saver • Fast Streaming
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-black/60 border border-purple-500/30 px-2 py-1 rounded">
                    309 MB
                  </span>
                </div>

                <button
                  onClick={() => onDownloadClick(movie, "quality480p")}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-md shadow-purple-900/40 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download in 480p – 309MB
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox for full screenshot zoom */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Enlarged screenshot"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[90vh] object-contain rounded-lg border border-zinc-800"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-zinc-900/90 text-white p-2 rounded-full border border-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
