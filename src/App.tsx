import React, { useState, useEffect } from "react";
import {
  Film,
  Search,
  Filter,
  Flame,
  ArrowUpDown,
  Clapperboard,
  Sparkles,
  Download,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { MovieCard } from "./components/MovieCard";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { DownloadModal } from "./components/DownloadModal";
import { AdminPanel } from "./components/AdminPanel";
import { Footer } from "./components/Footer";
import { Movie, Category, SiteSettings } from "./types";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "CineFlix Movies",
    siteDescription: "Download 4K, 1080p, 720p, 480p Movies in Dual Audio",
    siteTags: "4k movies download, 1080p hdrip, bollywood movies, hollywood hindi dubbed",
    announcement: "⚡ Welcome to CineFlix! Direct High-Speed Download Links (4K, 1080p, 720p, 480p) Available.",
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "views" | "downloads" | "rating">("newest");

  // Modals state
  const [activeMovieDetail, setActiveMovieDetail] = useState<Movie | null>(null);
  const [downloadModalData, setDownloadModalData] = useState<{
    movie: Movie;
    qualityKey: "quality4k" | "quality1080p" | "quality720p" | "quality480p";
  } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [moviesRes, catsRes, settingsRes] = await Promise.all([
        fetch("/api/movies"),
        fetch("/api/categories"),
        fetch("/api/settings"),
      ]);

      if (moviesRes.ok) {
        const mData = await moviesRes.json();
        if (mData.success) setMovies(mData.movies);
      }
      if (catsRes.ok) {
        const cData = await catsRes.json();
        if (cData.success) setCategories(cData.categories);
      }
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        if (sData.success) setSettings(sData.settings);
      }
    } catch (err) {
      console.error("Failed to load initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and Sort Movies
  const filteredMovies = movies.filter((movie) => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchStars = movie.stars?.toLowerCase().includes(q);
      const matchDirector = movie.director?.toLowerCase().includes(q);
      const matchGenres = movie.genres?.some((g) => g.toLowerCase().includes(q));
      const matchLang = movie.languages?.some((l) => l.toLowerCase().includes(q));
      if (!matchTitle && !matchStars && !matchDirector && !matchGenres && !matchLang) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== "all") {
      const targetCat = selectedCategory.toLowerCase();
      const matchCategory = movie.categories?.some(
        (c) => c.toLowerCase() === targetCat || c.toLowerCase().includes(targetCat)
      );
      if (!matchCategory) return false;
    }

    // Language filter
    if (selectedLanguage !== "All") {
      const matchLang = movie.languages?.some(
        (l) => l.toLowerCase() === selectedLanguage.toLowerCase()
      );
      if (!matchLang) return false;
    }

    return true;
  });

  // Sort Movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "views") return (b.views || 0) - (a.views || 0);
    if (sortBy === "downloads") return (b.downloadsCount || 0) - (a.downloadsCount || 0);
    if (sortBy === "rating") {
      const rA = parseFloat(a.imdbRating) || 0;
      const rB = parseFloat(b.imdbRating) || 0;
      return rB - rA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Featured Movie for Hero Banner
  const featuredMovie =
    movies.find((m) => m.featured) || (movies.length > 0 ? movies[0] : null);

  const handleOpenDownloadModal = (
    movie: Movie,
    qualityKey: "quality4k" | "quality1080p" | "quality720p" | "quality480p"
  ) => {
    setDownloadModalData({ movie, qualityKey });
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Immersive UI Radial Atmospheric Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Navigation Bar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => setSelectedLanguage(lang)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        settings={settings}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Featured Hero Banner (shown when browsing all and no active search) */}
        {featuredMovie && selectedCategory === "all" && !searchQuery && (
          <HeroBanner
            movie={featuredMovie}
            onSelectMovie={(m) => setActiveMovieDetail(m)}
            onQuickDownload={handleOpenDownloadModal}
          />
        )}

        {/* Section Heading & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {selectedCategory === "all"
                  ? "Explore All Movies"
                  : selectedCategory}
              </h2>
              <span className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                {sortedMovies.length} Available
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Select any movie to access direct 4K (7.2GB), 1080p (1.8GB), 720p (846MB), and 480p (309MB) downloads.
            </p>
          </div>

          {/* Controls: Sorting & Filter Chips */}
          <div className="flex items-center gap-2.5 shrink-0 text-xs">
            <span className="text-slate-400 hidden sm:inline flex items-center gap-1 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#0D0E12] border border-white/10 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors shadow-sm"
            >
              <option value="newest" className="bg-[#0D0E12] text-slate-200">Latest Uploads</option>
              <option value="rating" className="bg-[#0D0E12] text-slate-200">Highest IMDb Rating</option>
              <option value="downloads" className="bg-[#0D0E12] text-slate-200">Most Downloaded</option>
              <option value="views" className="bg-[#0D0E12] text-slate-200">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
            <span className="text-xs font-mono tracking-wider">Loading fast server catalogue...</span>
          </div>
        ) : sortedMovies.length > 0 ? (
          /* Movie Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {sortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={(m) => setActiveMovieDetail(m)}
                onQuickDownload={handleOpenDownloadModal}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0D0E12] border border-white/10 flex items-center justify-center mx-auto text-slate-500 shadow-xl">
              <Clapperboard className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">No Movies Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                No titles matched your current category or search criteria.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedLanguage("All");
                setSearchQuery("");
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-5 py-2.5 rounded-xl transition-all font-semibold cursor-pointer shadow-lg shadow-blue-900/30"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      {activeMovieDetail && (
        <MovieDetailModal
          movie={activeMovieDetail}
          onClose={() => setActiveMovieDetail(null)}
          onDownloadClick={handleOpenDownloadModal}
        />
      )}

      {/* Download Action & Fast Cloud Server Modal */}
      {downloadModalData && (
        <DownloadModal
          movie={downloadModalData.movie}
          qualityKey={downloadModalData.qualityKey}
          onClose={() => setDownloadModalData(null)}
        />
      )}

      {/* Admin Panel (Password: 7011543055@@) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          movies={movies}
          categories={categories}
          settings={settings}
          onRefreshData={fetchData}
        />
      )}

      {/* Footer */}
      <Footer
        categories={categories}
        settings={settings}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
