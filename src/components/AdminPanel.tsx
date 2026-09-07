import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Database,
  Settings,
  Film,
  FolderPlus,
  Save,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  KeyRound,
  RefreshCw,
  List,
  Layers,
} from "lucide-react";
import { Movie, Category, SiteSettings } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  movies: Movie[];
  categories: Category[];
  settings: SiteSettings;
  onRefreshData: () => void;
}

const DEFAULT_LANGUAGES = [
  "English",
  "Hindi",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Korean",
  "Japanese",
  "Kannada",
  "Punjabi",
  "Bengali",
  "Marathi",
  "Spanish",
  "French",
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  movies,
  categories,
  settings,
  onRefreshData,
}) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("cineflix_admin_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  // Tabs
  const [activeTab, setActiveTab] = useState<"movies" | "categories" | "settings" | "database">("movies");

  // Movie Form State
  const [isMovieFormOpen, setIsMovieFormOpen] = useState<boolean>(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [movieSearchQuery, setMovieSearchQuery] = useState<string>("");

  // AI Scraper State
  const [aiScrapeQuery, setAiScrapeQuery] = useState<string>("");
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Movie Form Fields
  const [formTitle, setFormTitle] = useState<string>("");
  const [formImdbRating, setFormImdbRating] = useState<string>("7.5/10");
  const [formGenres, setFormGenres] = useState<string[]>(["Action", "Thriller"]);
  const [genreInput, setGenreInput] = useState<string>("");
  const [formLanguages, setFormLanguages] = useState<string[]>(["Hindi", "English"]);
  const [customLanguageInput, setCustomLanguageInput] = useState<string>("");
  const [formQuality, setFormQuality] = useState<string>("4K UHD | 1080p | 720p | 480p WEB-DL");
  const [formSize, setFormSize] = useState<string>("480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]");
  const [formDirector, setFormDirector] = useState<string>("");
  const [formWriters, setFormWriters] = useState<string>("");
  const [formStars, setFormStars] = useState<string>("");
  const [formStoryline, setFormStoryline] = useState<string>("");
  const [formPosterUrl, setFormPosterUrl] = useState<string>("");
  const [formBackdropUrl, setFormBackdropUrl] = useState<string>("");
  const [formReleaseYear, setFormReleaseYear] = useState<number>(2024);
  const [formCategories, setFormCategories] = useState<string[]>(["Latest Movies"]);
  const [formScreenshots, setFormScreenshots] = useState<string[]>([]);
  const [screenshotInput, setScreenshotInput] = useState<string>("");
  const [formDownloads, setFormDownloads] = useState({
    quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/movie-4k.mkv", enabled: true },
    quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/movie-1080p.mkv", enabled: true },
    quality720p: { size: "846MB", url: "https://fastdownload.cloud/movie-720p.mkv", enabled: true },
    quality480p: { size: "309MB", url: "https://fastdownload.cloud/movie-480p.mkv", enabled: true },
  });

  // Category Management State
  const [newCatName, setNewCatName] = useState<string>("");
  const [newCatDescription, setNewCatDescription] = useState<string>("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState<string>("");

  // Settings State
  const [formSettings, setFormSettings] = useState<SiteSettings>(settings);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string>("");

  const getAuthToken = () => {
    return sessionStorage.getItem("cineflix_token") || "admin-session-" + btoa("7011543055@@");
  };

  // Login Handler (Password strictly: 7011543055@@)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("cineflix_admin_auth", "true");
        sessionStorage.setItem("cineflix_token", data.token);
      } else {
        setLoginError(data.message || "Invalid password");
      }
    } catch {
      setLoginError("Failed to authenticate. Please check server.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cineflix_admin_auth");
    sessionStorage.removeItem("cineflix_token");
    setIsAuthenticated(false);
  };

  // AI Movie Scrape from Link or Title
  const handleAiScrape = async () => {
    if (!aiScrapeQuery.trim()) {
      setAiStatusMessage({ type: "error", text: "Please enter a movie link or title first." });
      return;
    }

    setIsScraping(true);
    setAiStatusMessage(null);

    try {
      const res = await fetch("/api/ai/scrape-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ query: aiScrapeQuery }),
      });

      const data = await res.json();
      if (data.success && data.movie) {
        const m = data.movie;
        if (m.title) setFormTitle(m.title);
        if (m.imdbRating) setFormImdbRating(m.imdbRating);
        if (m.genres && Array.isArray(m.genres)) setFormGenres(m.genres);
        if (m.languages && Array.isArray(m.languages)) setFormLanguages(m.languages);
        if (m.quality) setFormQuality(m.quality);
        if (m.size) setFormSize(m.size);
        if (m.director) setFormDirector(m.director);
        if (m.writers) setFormWriters(m.writers);
        if (m.stars) setFormStars(m.stars);
        if (m.storyline) setFormStoryline(m.storyline);
        if (m.posterUrl) setFormPosterUrl(m.posterUrl);
        if (m.backdropUrl) setFormBackdropUrl(m.backdropUrl);
        if (m.releaseYear) setFormReleaseYear(Number(m.releaseYear));
        if (m.categories && Array.isArray(m.categories)) setFormCategories(m.categories);
        if (m.screenshots && Array.isArray(m.screenshots)) setFormScreenshots(m.screenshots);
        if (m.downloads) {
          setFormDownloads({
            quality4k: { size: m.downloads.quality4k?.size || "7.2GB", url: m.downloads.quality4k?.url || "#", enabled: true },
            quality1080p: { size: m.downloads.quality1080p?.size || "1.8GB", url: m.downloads.quality1080p?.url || "#", enabled: true },
            quality720p: { size: m.downloads.quality720p?.size || "846MB", url: m.downloads.quality720p?.url || "#", enabled: true },
            quality480p: { size: m.downloads.quality480p?.size || "309MB", url: m.downloads.quality480p?.url || "#", enabled: true },
          });
        }

        setAiStatusMessage({
          type: "success",
          text: `Success! Auto-fetched authentic movie details for "${m.title}".`,
        });
      } else {
        setAiStatusMessage({ type: "error", text: data.message || "Could not auto-fetch movie details." });
      }
    } catch (err: any) {
      setAiStatusMessage({ type: "error", text: err.message || "Failed to contact AI scraper." });
    } finally {
      setIsScraping(false);
    }
  };

  // Open Movie Form for New or Edit
  const openNewMovieForm = () => {
    setEditingMovieId(null);
    setFormTitle("");
    setFormImdbRating("7.5/10");
    setFormGenres(["Action", "Thriller"]);
    setFormLanguages(["Hindi", "English"]);
    setFormQuality("4K UHD | 1080p | 720p | 480p WEB-DL");
    setFormSize("480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]");
    setFormDirector("");
    setFormWriters("");
    setFormStars("");
    setFormStoryline("");
    setFormPosterUrl("https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80");
    setFormBackdropUrl("");
    setFormReleaseYear(new Date().getFullYear());
    setFormCategories(["Latest Movies"]);
    setFormScreenshots([
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900&auto=format&fit=crop&q=80",
    ]);
    setFormDownloads({
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/movie-4k.mkv", enabled: true },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/movie-1080p.mkv", enabled: true },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/movie-720p.mkv", enabled: true },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/movie-480p.mkv", enabled: true },
    });
    setAiScrapeQuery("");
    setAiStatusMessage(null);
    setIsMovieFormOpen(true);
  };

  const openEditMovieForm = (m: Movie) => {
    setEditingMovieId(m.id);
    setFormTitle(m.title);
    setFormImdbRating(m.imdbRating || "7.5/10");
    setFormGenres(m.genres || []);
    setFormLanguages(m.languages || []);
    setFormQuality(m.quality || "4K UHD | 1080p | 720p | 480p");
    setFormSize(m.size || "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]");
    setFormDirector(m.director || "");
    setFormWriters(m.writers || "");
    setFormStars(m.stars || "");
    setFormStoryline(m.storyline || "");
    setFormPosterUrl(m.posterUrl || "");
    setFormBackdropUrl(m.backdropUrl || "");
    setFormReleaseYear(m.releaseYear || 2023);
    setFormCategories(m.categories || ["Latest Movies"]);
    setFormScreenshots(m.screenshots || []);
    setFormDownloads({
      quality4k: { size: m.downloads?.quality4k?.size || "7.2GB", url: m.downloads?.quality4k?.url || "#", enabled: true },
      quality1080p: { size: m.downloads?.quality1080p?.size || "1.8GB", url: m.downloads?.quality1080p?.url || "#", enabled: true },
      quality720p: { size: m.downloads?.quality720p?.size || "846MB", url: m.downloads?.quality720p?.url || "#", enabled: true },
      quality480p: { size: m.downloads?.quality480p?.size || "309MB", url: m.downloads?.quality480p?.url || "#", enabled: true },
    });
    setAiScrapeQuery("");
    setAiStatusMessage(null);
    setIsMovieFormOpen(true);
  };

  // Save Movie
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Movie Title is required!");
      return;
    }

    const payload = {
      title: formTitle.trim(),
      imdbRating: formImdbRating.trim(),
      genres: formGenres,
      languages: formLanguages,
      quality: formQuality.trim(),
      size: formSize.trim(),
      director: formDirector.trim(),
      writers: formWriters.trim(),
      stars: formStars.trim(),
      storyline: formStoryline.trim(),
      posterUrl: formPosterUrl.trim(),
      backdropUrl: formBackdropUrl.trim() || formPosterUrl.trim(),
      releaseYear: Number(formReleaseYear) || 2024,
      categories: formCategories,
      screenshots: formScreenshots,
      downloads: formDownloads,
    };

    try {
      const url = editingMovieId ? `/api/movies/${editingMovieId}` : "/api/movies";
      const method = editingMovieId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsMovieFormOpen(false);
        onRefreshData();
      } else {
        alert("Error saving movie: " + data.message);
      }
    } catch {
      alert("Server request failed while saving movie.");
    }
  };

  // Delete Movie
  const handleDeleteMovie = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      } else {
        alert("Error deleting movie: " + data.message);
      }
    } catch {
      alert("Server request failed while deleting movie.");
    }
  };

  // Category Actions
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ name: newCatName.trim(), description: newCatDescription.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCatName("");
        setNewCatDescription("");
        onRefreshData();
      } else {
        alert("Failed to create category: " + data.message);
      }
    } catch {
      alert("Failed to create category.");
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCatName.trim()) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ name: editingCatName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingCatId(null);
        setEditingCatName("");
        onRefreshData();
      }
    } catch {
      alert("Failed to update category.");
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        onRefreshData();
      }
    } catch {
      alert("Failed to delete category.");
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveMsg("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formSettings),
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSaveMsg("Settings saved successfully!");
        setTimeout(() => setSettingsSaveMsg(""), 3000);
        onRefreshData();
      } else {
        alert("Error saving settings: " + data.message);
      }
    } catch {
      alert("Failed to save settings.");
    }
  };

  // Toggle Category Selection
  const toggleCategorySelection = (catName: string) => {
    if (formCategories.includes(catName)) {
      if (formCategories.length > 1) {
        setFormCategories(formCategories.filter((c) => c !== catName));
      }
    } else {
      setFormCategories([...formCategories, catName]);
    }
  };

  // Toggle Language Selection
  const toggleLanguageSelection = (lang: string) => {
    if (formLanguages.includes(lang)) {
      if (formLanguages.length > 1) {
        setFormLanguages(formLanguages.filter((l) => l !== lang));
      }
    } else {
      setFormLanguages([...formLanguages, lang]);
    }
  };

  const handleAddCustomLanguage = () => {
    if (!customLanguageInput.trim()) return;
    const lang = customLanguageInput.trim();
    if (!formLanguages.includes(lang)) {
      setFormLanguages([...formLanguages, lang]);
    }
    setCustomLanguageInput("");
  };

  const handleAddGenre = () => {
    if (!genreInput.trim()) return;
    const g = genreInput.trim();
    if (!formGenres.includes(g)) {
      setFormGenres([...formGenres, g]);
    }
    setGenreInput("");
  };

  const handleAddScreenshot = () => {
    if (!screenshotInput.trim()) return;
    setFormScreenshots([...formScreenshots, screenshotInput.trim()]);
    setScreenshotInput("");
  };

  // Filter movies for list view
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(movieSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0D0E12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#08080A]/95 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Movie Portal Admin Dashboard
              </h2>
              <p className="text-[11px] text-slate-400">
                Manage movies, categories, AI auto-scraper, and MySQL export
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
              >
                Log Out
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto my-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-xl">
              <KeyRound className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Admin Authentication</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the designated administrator password to access movie management controls.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  className="w-full bg-[#08080A] border border-white/10 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
              >
                Access Admin Portal
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-[#08080A] shrink-0 overflow-x-auto">
              <button
                onClick={() => {
                  setActiveTab("movies");
                  setIsMovieFormOpen(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "movies"
                    ? "border-blue-500 text-blue-400 bg-white/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Film className="w-4 h-4" />
                Movies Management ({movies.length})
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-400 bg-white/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Layers className="w-4 h-4" />
                Categories ({categories.length})
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "settings"
                    ? "border-blue-500 text-blue-400 bg-white/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Settings className="w-4 h-4" />
                Website Settings & SEO
              </button>

              <button
                onClick={() => setActiveTab("database")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "database"
                    ? "border-blue-500 text-blue-400 bg-white/5"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Database className="w-4 h-4" />
                MySQL Database & Hosting
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* TAB 1: MOVIES MANAGEMENT */}
              {activeTab === "movies" && (
                <div className="space-y-6">
                  {/* If Movie Add/Edit Form is open */}
                  {isMovieFormOpen ? (
                    <div className="space-y-6 bg-white/[0.02] p-5 sm:p-6 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Film className="w-4 h-4 text-blue-400" />
                          {editingMovieId ? "Edit Movie Details" : "Add New Movie"}
                        </h3>
                        <button
                          onClick={() => setIsMovieFormOpen(false)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* AI AUTO-SCRAPER / AUTO-FETCH SECTION */}
                      <div className="bg-gradient-to-r from-blue-950/30 via-[#08080A] to-blue-950/20 border border-blue-500/30 rounded-xl p-4 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-300">
                            AI Movie Scraper & Auto-Fill
                          </h4>
                        </div>
                        <p className="text-xs text-slate-400">
                          Enter any movie link (IMDb, Wikipedia, or movie review link) or just enter the movie name (e.g., &quot;Kalki 2898 AD (2024)&quot;). Gemini AI will auto-extract title, rating, genres, audio, director, stars, storyline, poster, and download sizes!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={aiScrapeQuery}
                            onChange={(e) => setAiScrapeQuery(e.target.value)}
                            placeholder="Paste movie URL or type movie name e.g. Interstellar 2014..."
                            className="flex-1 bg-[#08080A] border border-white/10 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleAiScrape}
                            disabled={isScraping}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md shadow-blue-900/30"
                          >
                            {isScraping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                            <span>{isScraping ? "AI Scraping..." : "Auto-Fetch Details"}</span>
                          </button>
                        </div>

                        {aiStatusMessage && (
                          <div
                            className={`text-xs p-2.5 rounded-lg flex items-center gap-2 ${
                              aiStatusMessage.type === "success"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/10 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {aiStatusMessage.type === "success" ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 shrink-0" />
                            )}
                            <span>{aiStatusMessage.text}</span>
                          </div>
                        )}
                      </div>

                      {/* Main Movie Form */}
                      <form onSubmit={handleSaveMovie} className="space-y-5">
                        {/* Title & Release Year */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="sm:col-span-3">
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Movie Title (with year & audio tag) *
                            </label>
                            <input
                              type="text"
                              required
                              value={formTitle}
                              onChange={(e) => setFormTitle(e.target.value)}
                              placeholder="e.g. Animal (2023) Dual Audio [Hindi + Telugu]"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Release Year
                            </label>
                            <input
                              type="number"
                              value={formReleaseYear}
                              onChange={(e) => setFormReleaseYear(Number(e.target.value))}
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* IMDb Rating, Quality, Size */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-blue-400 block mb-1">
                              IMDb Rating *
                            </label>
                            <input
                              type="text"
                              value={formImdbRating}
                              onChange={(e) => setFormImdbRating(e.target.value)}
                              placeholder="e.g. 8.2/10"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Quality
                            </label>
                            <input
                              type="text"
                              value={formQuality}
                              onChange={(e) => setFormQuality(e.target.value)}
                              placeholder="4K UHD | 1080p | 720p | 480p"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Size
                            </label>
                            <input
                              type="text"
                              value={formSize}
                              onChange={(e) => setFormSize(e.target.value)}
                              placeholder="480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Multiple Categories Selection */}
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Select Categories (Multiple Select) *
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {categories.map((c) => {
                              const isSelected = formCategories.includes(c.name);
                              return (
                                <button
                                  type="button"
                                  key={c.id}
                                  onClick={() => toggleCategorySelection(c.name)}
                                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                    isSelected
                                      ? "bg-blue-600 text-white font-bold border-blue-500 shadow-sm"
                                      : "bg-[#08080A] text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {c.name} {isSelected && "✓"}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Multiple Languages Selection */}
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Languages (Multiple Select / Add custom) *
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {DEFAULT_LANGUAGES.map((lang) => {
                              const isSelected = formLanguages.includes(lang);
                              return (
                                <button
                                  type="button"
                                  key={lang}
                                  onClick={() => toggleLanguageSelection(lang)}
                                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                                    isSelected
                                      ? "bg-blue-600 text-white font-bold border-blue-500 shadow-sm"
                                      : "bg-[#08080A] text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {lang} {isSelected && "✓"}
                                </button>
                              );
                            })}
                          </div>
                          {/* Custom Language add */}
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={customLanguageInput}
                              onChange={(e) => setCustomLanguageInput(e.target.value)}
                              placeholder="Add another language e.g. Russian..."
                              className="bg-[#08080A] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomLanguage}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white"
                            >
                              Add Language
                            </button>
                          </div>
                        </div>

                        {/* Genres */}
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Genres
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {formGenres.map((g) => (
                              <span
                                key={g}
                                className="text-xs bg-[#08080A] text-slate-200 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1"
                              >
                                {g}
                                <button
                                  type="button"
                                  onClick={() => setFormGenres(formGenres.filter((item) => item !== g))}
                                  className="text-slate-500 hover:text-red-400"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 max-w-sm">
                            <input
                              type="text"
                              value={genreInput}
                              onChange={(e) => setGenreInput(e.target.value)}
                              placeholder="Add genre e.g. Sci-Fi, Horror..."
                              className="bg-[#08080A] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddGenre}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-2.5 py-1.5 rounded-lg text-white"
                            >
                              Add Genre
                            </button>
                          </div>
                        </div>

                        {/* Director, Writers, Stars */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Director:
                            </label>
                            <input
                              type="text"
                              value={formDirector}
                              onChange={(e) => setFormDirector(e.target.value)}
                              placeholder="Director name"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Writers:
                            </label>
                            <input
                              type="text"
                              value={formWriters}
                              onChange={(e) => setFormWriters(e.target.value)}
                              placeholder="Writers separated by comma"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Stars:
                            </label>
                            <input
                              type="text"
                              value={formStars}
                              onChange={(e) => setFormStars(e.target.value)}
                              placeholder="Leading cast members"
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Storyline */}
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1">
                            Storyline:
                          </label>
                          <textarea
                            rows={3}
                            value={formStoryline}
                            onChange={(e) => setFormStoryline(e.target.value)}
                            placeholder="Full plot synopsis..."
                            className="w-full bg-[#08080A] border border-white/10 rounded-lg p-3 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                          />
                        </div>

                        {/* Poster URL & Backdrop URL */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Poster Image URL
                            </label>
                            <input
                              type="text"
                              value={formPosterUrl}
                              onChange={(e) => setFormPosterUrl(e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-300 block mb-1">
                              Backdrop / Banner Image URL
                            </label>
                            <input
                              type="text"
                              value={formBackdropUrl}
                              onChange={(e) => setFormBackdropUrl(e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Screenshots Image Links */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-300 block">
                            Movie Screenshots Gallery (Image URLs)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formScreenshots.map((url, idx) => (
                              <div
                                key={idx}
                                className="relative w-24 h-14 rounded-lg overflow-hidden border border-white/10 group"
                              >
                                <img
                                  src={url}
                                  alt="Preview"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormScreenshots(formScreenshots.filter((_, i) => i !== idx))}
                                  className="absolute top-0.5 right-0.5 bg-black/80 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3 text-red-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={screenshotInput}
                              onChange={(e) => setScreenshotInput(e.target.value)}
                              placeholder="Paste screenshot image URL and click add..."
                              className="bg-[#08080A] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddScreenshot}
                              className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-3 py-1.5 rounded-lg text-white"
                            >
                              Add Screenshot
                            </button>
                          </div>
                        </div>

                        {/* Download Links Configuration (Exact sizes requested by user) */}
                        <div className="bg-[#08080A] p-4 rounded-xl border border-white/10 space-y-3">
                          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                            Download Links Setup (4K, 1080p, 720p, 480p)
                          </h4>

                          {/* 4K - 7.2GB */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                                4K
                              </span>
                              <span>Download in 4K – 7.2GB</span>
                            </div>
                            <input
                              type="text"
                              value={formDownloads.quality4k.size}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality4k: { ...formDownloads.quality4k, size: e.target.value },
                                })
                              }
                              placeholder="Size: 7.2GB"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                            <input
                              type="text"
                              value={formDownloads.quality4k.url}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality4k: { ...formDownloads.quality4k, url: e.target.value },
                                })
                              }
                              placeholder="Download URL"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                          </div>

                          {/* 1080p - 1.8GB */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="bg-indigo-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                                1080p
                              </span>
                              <span>Download in 1080p – 1.8GB</span>
                            </div>
                            <input
                              type="text"
                              value={formDownloads.quality1080p.size}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality1080p: { ...formDownloads.quality1080p, size: e.target.value },
                                })
                              }
                              placeholder="Size: 1.8GB"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                            <input
                              type="text"
                              value={formDownloads.quality1080p.url}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality1080p: { ...formDownloads.quality1080p, url: e.target.value },
                                })
                              }
                              placeholder="Download URL"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                          </div>

                          {/* 720p - 846MB */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                                720p
                              </span>
                              <span>Download in 720p – 846MB</span>
                            </div>
                            <input
                              type="text"
                              value={formDownloads.quality720p.size}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality720p: { ...formDownloads.quality720p, size: e.target.value },
                                })
                              }
                              placeholder="Size: 846MB"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                            <input
                              type="text"
                              value={formDownloads.quality720p.url}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality720p: { ...formDownloads.quality720p, url: e.target.value },
                                })
                              }
                              placeholder="Download URL"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                          </div>

                          {/* 480p - 309MB */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span className="bg-purple-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                                480p
                              </span>
                              <span>Download in 480p – 309MB</span>
                            </div>
                            <input
                              type="text"
                              value={formDownloads.quality480p.size}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality480p: { ...formDownloads.quality480p, size: e.target.value },
                                })
                              }
                              placeholder="Size: 309MB"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                            <input
                              type="text"
                              value={formDownloads.quality480p.url}
                              onChange={(e) =>
                                setFormDownloads({
                                  ...formDownloads,
                                  quality480p: { ...formDownloads.quality480p, url: e.target.value },
                                })
                              }
                              placeholder="Download URL"
                              className="bg-white/5 border border-white/10 rounded px-2.5 py-1 text-xs text-slate-200"
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => setIsMovieFormOpen(false)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs px-4 py-2 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-900/30"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingMovieId ? "Update Movie" : "Publish Movie"}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* Movies List View */
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-sm">
                          <input
                            type="text"
                            value={movieSearchQuery}
                            onChange={(e) => setMovieSearchQuery(e.target.value)}
                            placeholder="Filter listed movies..."
                            className="w-full bg-[#08080A] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>

                        <button
                          onClick={openNewMovieForm}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30 transition-all cursor-pointer shrink-0"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Movie</span>
                        </button>
                      </div>

                      {/* Movie Table / Card List */}
                      <div className="bg-[#08080A]/80 border border-white/10 rounded-xl overflow-hidden shadow-lg">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-slate-300">
                            <thead className="bg-white/5 text-slate-400 font-semibold border-b border-white/10 uppercase text-[10px] tracking-wider">
                              <tr>
                                <th className="p-3">Poster</th>
                                <th className="p-3">Title & Release</th>
                                <th className="p-3">IMDb</th>
                                <th className="p-3">Categories</th>
                                <th className="p-3">Audio</th>
                                <th className="p-3">Views / DL</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {filteredMovies.map((m) => (
                                <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                                  <td className="p-3">
                                    <img
                                      src={m.posterUrl}
                                      alt={m.title}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-14 object-cover rounded bg-[#08080A] border border-white/10 shrink-0"
                                    />
                                  </td>
                                  <td className="p-3 font-medium text-white max-w-xs">
                                    <div className="truncate font-bold">{m.title}</div>
                                    <div className="text-[10px] text-slate-400">
                                      {m.director ? `Dir: ${m.director}` : ""} ({m.releaseYear})
                                    </div>
                                  </td>
                                  <td className="p-3 font-bold text-blue-400 font-mono">
                                    {m.imdbRating}
                                  </td>
                                  <td className="p-3 text-[11px] text-slate-300 max-w-[140px] truncate">
                                    {m.categories.join(", ")}
                                  </td>
                                  <td className="p-3 text-[11px] text-slate-300 max-w-[120px] truncate">
                                    {m.languages.join(", ")}
                                  </td>
                                  <td className="p-3 text-[11px] font-mono text-slate-400">
                                    {m.views || 0} / {m.downloadsCount || 0}
                                  </td>
                                  <td className="p-3 text-right whitespace-nowrap">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button
                                        onClick={() => openEditMovieForm(m)}
                                        className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
                                        title="Edit Movie"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMovie(m.id, m.title)}
                                        className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 border border-white/10 text-slate-400 hover:text-red-400 transition-colors"
                                        title="Delete Movie"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CATEGORIES MANAGEMENT */}
              {activeTab === "categories" && (
                <div className="space-y-6">
                  {/* Add New Category */}
                  <div className="bg-[#08080A]/60 p-4 sm:p-5 rounded-xl border border-white/10 space-y-3">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <FolderPlus className="w-4 h-4 text-blue-400" />
                      Create New Category
                    </h3>
                    <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Category Name (e.g. Web Series, Anime, 4K Remux)..."
                        className="flex-1 bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newCatDescription}
                        onChange={(e) => setNewCatDescription(e.target.value)}
                        placeholder="Short description (optional)..."
                        className="flex-1 bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-md shadow-blue-900/30"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Category
                      </button>
                    </form>
                  </div>

                  {/* List Existing Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-400">
                      Existing Categories ({categories.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {categories.map((c) => (
                        <div
                          key={c.id}
                          className="bg-[#08080A]/80 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-2"
                        >
                          {editingCatId === c.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="text"
                                value={editingCatName}
                                onChange={(e) => setEditingCatName(e.target.value)}
                                className="flex-1 bg-[#08080A] border border-blue-500 rounded px-2 py-1 text-xs text-white"
                              />
                              <button
                                onClick={() => handleUpdateCategory(c.id)}
                                className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingCatId(null)}
                                className="text-xs text-slate-400 px-2 py-1"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="text-xs font-bold text-white">{c.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  Slug: {c.slug}
                                </div>
                                {c.description && (
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {c.description}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => {
                                    setEditingCatId(c.id);
                                    setEditingCatName(c.name);
                                  }}
                                  className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(c.id, c.name)}
                                  className="p-1 rounded bg-white/5 hover:bg-red-500/20 border border-white/10 text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SETTINGS & SEO */}
              {activeTab === "settings" && (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Website Name
                    </label>
                    <input
                      type="text"
                      value={formSettings.siteName}
                      onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                      className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Website Description (SEO Meta)
                    </label>
                    <textarea
                      rows={2}
                      value={formSettings.siteDescription}
                      onChange={(e) => setFormSettings({ ...formSettings, siteDescription: e.target.value })}
                      className="w-full bg-[#08080A] border border-white/10 rounded-lg p-3 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Website SEO Tags (comma separated keywords)
                    </label>
                    <textarea
                      rows={2}
                      value={formSettings.siteTags}
                      onChange={(e) => setFormSettings({ ...formSettings, siteTags: e.target.value })}
                      className="w-full bg-[#08080A] border border-white/10 rounded-lg p-3 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Top Announcement / Notice Bar Text
                    </label>
                    <input
                      type="text"
                      value={formSettings.announcement}
                      onChange={(e) => setFormSettings({ ...formSettings, announcement: e.target.value })}
                      placeholder="Special notice, holiday message, or new releases..."
                      className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Telegram Channel Link
                    </label>
                    <input
                      type="text"
                      value={formSettings.telegramLink || ""}
                      onChange={(e) => setFormSettings({ ...formSettings, telegramLink: e.target.value })}
                      placeholder="https://t.me/..."
                      className="w-full bg-[#08080A] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  {settingsSaveMsg && (
                    <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{settingsSaveMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Website Settings
                  </button>
                </form>
              )}

              {/* TAB 4: MYSQL DATABASE & HOSTING EXPORT */}
              {activeTab === "database" && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-gradient-to-r from-blue-950/40 via-[#0D0E12] to-[#08080A] border border-blue-500/30 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-400" />
                      <h3 className="text-sm font-bold text-white">
                        MySQL Database & Web Hosting Deployment
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      User requirement: &quot;aur usmein myquldata base bhi Hona chahie add karne ka option bhi Hona chahie Puri website hosting Mein upload karunga&quot;.
                      <br />
                      This tool automatically generates the complete MySQL Schema with `CREATE TABLE` and all `INSERT INTO` queries for movies, categories, and settings. You can download the `.sql` dump file and import it directly into phpMyAdmin, cPanel MySQL, or VPS!
                    </p>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href="/api/export/mysql"
                        download="cineflix_database.sql"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Download MySQL Database (.sql dump)
                      </a>
                    </div>
                  </div>

                  {/* MySQL Connection Config (For hosting setup) */}
                  <div className="bg-[#08080A]/60 border border-white/10 p-5 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      MySQL Connection Configuration (Optional Hosting Credentials)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1">MySQL Host</label>
                        <input
                          type="text"
                          value={formSettings.mysqlHost || "localhost"}
                          onChange={(e) => setFormSettings({ ...formSettings, mysqlHost: e.target.value })}
                          className="w-full bg-[#08080A] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">MySQL Port</label>
                        <input
                          type="number"
                          value={formSettings.mysqlPort || 3306}
                          onChange={(e) => setFormSettings({ ...formSettings, mysqlPort: Number(e.target.value) })}
                          className="w-full bg-[#08080A] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Database Name</label>
                        <input
                          type="text"
                          value={formSettings.mysqlDatabase || "cineflix_db"}
                          onChange={(e) => setFormSettings({ ...formSettings, mysqlDatabase: e.target.value })}
                          className="w-full bg-[#08080A] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Database User</label>
                        <input
                          type="text"
                          value={formSettings.mysqlUser || "root"}
                          onChange={(e) => setFormSettings({ ...formSettings, mysqlUser: e.target.value })}
                          className="w-full bg-[#08080A] border border-white/10 rounded px-2.5 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-3 py-1.5 rounded font-medium cursor-pointer"
                    >
                      Save Database Credentials
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
