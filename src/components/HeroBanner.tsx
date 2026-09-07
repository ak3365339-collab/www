import React from "react";
import { Download, Star, Info, Play, Sparkles } from "lucide-react";
import { Movie } from "../types";

interface HeroBannerProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onQuickDownload: (movie: Movie, qualityKey: "quality4k" | "quality1080p" | "quality720p" | "quality480p") => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onSelectMovie,
  onQuickDownload,
}) => {
  const bgImage = movie.backdropUrl || movie.posterUrl;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 border border-white/5 shadow-2xl bg-[#0D0E12]">
      {/* Background with Dark Cinema Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 transform scale-105 filter blur-xs transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-[#08080A]/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="max-w-2xl space-y-3">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-md font-extrabold flex items-center gap-1 shadow-sm uppercase tracking-wider text-[11px]">
              <Sparkles className="w-3 h-3" /> FEATURED PREMIERE
            </span>
            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-0.5 rounded-md flex items-center gap-1 font-bold">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              {movie.imdbRating}
            </span>
            <span className="bg-white/5 text-slate-300 border border-white/10 px-2.5 py-0.5 rounded-md">
              {movie.releaseYear}
            </span>
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-md font-mono">
              4K UHD + 1080p
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {movie.title}
          </h1>

          {/* Languages & Genres */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="font-semibold text-blue-400">Audio:</span>
            <span>{movie.languages.join(" • ")}</span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-slate-400">Genres:</span>
            <span>{movie.genres.join(", ")}</span>
          </div>

          {/* Storyline */}
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-xl">
            {movie.storyline}
          </p>

          {/* Quality & Sizes Banner */}
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 font-sans">Available:</span>
            <span className="bg-blue-600/15 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded">
              4K [7.2GB]
            </span>
            <span className="bg-white/5 text-slate-300 border border-white/10 px-2 py-0.5 rounded">
              1080p [1.8GB]
            </span>
            <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
              720p [846MB]
            </span>
            <span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
              480p [309MB]
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onQuickDownload(movie, "quality4k")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-900/30 transition-all hover:scale-102 cursor-pointer text-sm"
            >
              <Download className="w-4 h-4" />
              Download in 4K – 7.2GB
            </button>

            <button
              onClick={() => onSelectMovie(movie)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 font-medium border border-white/10 px-4 py-2.5 rounded-xl transition-all hover:border-white/20 text-sm cursor-pointer"
            >
              <Info className="w-4 h-4 text-slate-400" />
              View Full Details & All Qualities
            </button>
          </div>
        </div>

        {/* Poster Thumbnail */}
        <div
          onClick={() => onSelectMovie(movie)}
          className="hidden md:block shrink-0 w-44 rounded-xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer hover:border-blue-500/60 transition-all hover:scale-103"
        >
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-64 object-cover group-hover:brightness-110 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
