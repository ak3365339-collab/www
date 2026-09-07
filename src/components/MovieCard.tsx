import React from "react";
import { Download, Star, Eye, Film } from "lucide-react";
import { Movie } from "../types";

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onQuickDownload: (movie: Movie, qualityKey: "quality4k" | "quality1080p" | "quality720p" | "quality480p") => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onQuickDownload,
}) => {
  return (
    <div className="group relative bg-[#0D0E12] rounded-2xl border border-white/5 overflow-hidden hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col">
      {/* Poster Image Container */}
      <div
        onClick={() => onSelectMovie(movie)}
        className="relative aspect-[2/3] w-full overflow-hidden bg-[#08080A] cursor-pointer"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-[#0D0E12]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
          {/* Quality Badge */}
          <span className="bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded shadow-md tracking-wider">
            4K UHD
          </span>

          {/* Rating */}
          <span className="bg-[#08080A]/85 backdrop-blur-xs border border-white/10 text-yellow-500 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            {movie.imdbRating || "N/A"}
          </span>
        </div>

        {/* Year & Audio Overlay at bottom of poster */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-medium text-slate-300">
          <span className="bg-[#0D0E12]/90 border border-white/10 px-2 py-0.5 rounded text-slate-300">
            {movie.releaseYear}
          </span>
          <span className="bg-[#0D0E12]/90 border border-white/10 px-2 py-0.5 rounded text-blue-400 font-semibold truncate max-w-[120px]">
            {movie.languages.slice(0, 2).join("+")}{movie.languages.length > 2 ? ` +${movie.languages.length - 2}` : ""}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div onClick={() => onSelectMovie(movie)} className="cursor-pointer">
          <h2 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
            {movie.title}
          </h2>

          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            <span className="text-slate-500">Cast:</span> {movie.stars}
          </p>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-[10px] bg-white/5 text-slate-300 px-1.5 py-0.5 rounded border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Quality Download Buttons */}
        <div className="pt-2 border-t border-white/5 space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono font-semibold">
            <button
              onClick={() => onQuickDownload(movie, "quality4k")}
              className="bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 hover:border-blue-500 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all cursor-pointer truncate"
              title="Download in 4K – 7.2GB"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span>4K • 7.2GB</span>
            </button>

            <button
              onClick={() => onQuickDownload(movie, "quality1080p")}
              className="bg-white/5 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 hover:border-slate-500 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all cursor-pointer truncate"
              title="Download in 1080p – 1.8GB"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span>1080p • 1.8GB</span>
            </button>

            <button
              onClick={() => onQuickDownload(movie, "quality720p")}
              className="bg-emerald-500/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all cursor-pointer truncate"
              title="Download in 720p – 846MB"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span>720p • 846MB</span>
            </button>

            <button
              onClick={() => onQuickDownload(movie, "quality480p")}
              className="bg-purple-500/15 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 hover:border-purple-500 py-1.5 px-1 rounded flex items-center justify-center gap-1 transition-all cursor-pointer truncate"
              title="Download in 480p – 309MB"
            >
              <Download className="w-3 h-3 shrink-0" />
              <span>480p • 309MB</span>
            </button>
          </div>

          {/* Full Details link */}
          <button
            onClick={() => onSelectMovie(movie)}
            className="w-full text-center text-[11px] text-slate-400 hover:text-blue-400 py-1 transition-colors font-medium flex items-center justify-center gap-1 cursor-pointer"
          >
            <Film className="w-3 h-3" /> View Screenshots & Info
          </button>
        </div>
      </div>
    </div>
  );
};
