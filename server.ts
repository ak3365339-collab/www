import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import {
  getMovies,
  saveMovies,
  getCategories,
  saveCategories,
  getSettings,
  saveSettings,
  generateMysqlDump,
} from "./server/dataStore.js";
import { scrapeMovieWithAI } from "./server/geminiScraper.js";
import { Movie, Category } from "./src/types.js";

dotenv.config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "7011543055@@";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Admin login endpoint
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      // In production/cloud run, return a simple signed/session token
      const token = "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64");
      return res.json({ success: true, token, message: "Admin authenticated successfully" });
    }
    return res.status(401).json({ success: false, message: "Galat password! Please enter correct admin password." });
  });

  // Get all movies with optional search, category, language filter
  app.get("/api/movies", (req, res) => {
    const { search, category, language, sort } = req.query;
    let movies = getMovies();

    if (search && typeof search === "string" && search.trim()) {
      const q = search.toLowerCase().trim();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.stars.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q)) ||
          m.languages.some((l) => l.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === "string" && category !== "all") {
      movies = movies.filter((m) =>
        m.categories.some(
          (c) => c.toLowerCase() === category.toLowerCase() || c.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (language && typeof language === "string" && language !== "all") {
      movies = movies.filter((m) =>
        m.languages.some((l) => l.toLowerCase() === language.toLowerCase())
      );
    }

    // Sorting
    if (sort === "views") {
      movies.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === "downloads") {
      movies.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
    } else if (sort === "rating") {
      movies.sort((a, b) => {
        const rA = parseFloat(a.imdbRating) || 0;
        const rB = parseFloat(b.imdbRating) || 0;
        return rB - rA;
      });
    } else {
      // Default: newest first
      movies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    res.json({ success: true, movies, total: movies.length });
  });

  // Get single movie details and increment view
  app.get("/api/movies/:id", (req, res) => {
    const { id } = req.params;
    const movies = getMovies();
    const movieIndex = movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    // Increment view count
    movies[movieIndex].views = (movies[movieIndex].views || 0) + 1;
    saveMovies(movies);

    res.json({ success: true, movie: movies[movieIndex] });
  });

  // Track download clicks
  app.post("/api/movies/:id/download-click", (req, res) => {
    const { id } = req.params;
    const movies = getMovies();
    const movie = movies.find((m) => m.id === id);
    if (movie) {
      movie.downloadsCount = (movie.downloadsCount || 0) + 1;
      saveMovies(movies);
      return res.json({ success: true, downloadsCount: movie.downloadsCount });
    }
    res.status(404).json({ success: false, message: "Movie not found" });
  });

  // Add new movie (Admin)
  app.post("/api/movies", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const movieData: Movie = req.body;
    if (!movieData.title) {
      return res.status(400).json({ success: false, message: "Movie title is required" });
    }

    const movies = getMovies();
    const newMovie: Movie = {
      ...movieData,
      id: "mov-" + Date.now(),
      createdAt: new Date().toISOString(),
      views: 0,
      downloadsCount: 0,
      downloads: movieData.downloads || {
        quality4k: { size: "7.2GB", url: "#", enabled: true },
        quality1080p: { size: "1.8GB", url: "#", enabled: true },
        quality720p: { size: "846MB", url: "#", enabled: true },
        quality480p: { size: "309MB", url: "#", enabled: true },
      },
    };

    movies.unshift(newMovie);
    saveMovies(movies);

    res.json({ success: true, movie: newMovie, message: "Movie added successfully!" });
  });

  // Update existing movie (Admin)
  app.put("/api/movies/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;
    const updateData: Partial<Movie> = req.body;
    const movies = getMovies();
    const index = movies.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    movies[index] = {
      ...movies[index],
      ...updateData,
      id, // protect id
    };

    saveMovies(movies);
    res.json({ success: true, movie: movies[index], message: "Movie updated successfully!" });
  });

  // Delete movie (Admin)
  app.delete("/api/movies/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;
    let movies = getMovies();
    const beforeCount = movies.length;
    movies = movies.filter((m) => m.id !== id);

    if (movies.length === beforeCount) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }

    saveMovies(movies);
    res.json({ success: true, message: "Movie deleted successfully!" });
  });

  // Categories CRUD
  app.get("/api/categories", (_req, res) => {
    const categories = getCategories();
    res.json({ success: true, categories });
  });

  app.post("/api/categories", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const categories = getCategories();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newCategory: Category = {
      id: "cat-" + Date.now(),
      name,
      slug,
      description: description || "",
    };

    categories.push(newCategory);
    saveCategories(categories);
    res.json({ success: true, category: newCategory, message: "Category created!" });
  });

  app.put("/api/categories/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;
    const { name, description } = req.body;
    const categories = getCategories();
    const index = categories.findIndex((c) => c.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (name) {
      categories[index].name = name;
      categories[index].slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }
    if (description !== undefined) {
      categories[index].description = description;
    }

    saveCategories(categories);
    res.json({ success: true, category: categories[index], message: "Category updated!" });
  });

  app.delete("/api/categories/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;
    let categories = getCategories();
    categories = categories.filter((c) => c.id !== id);
    saveCategories(categories);
    res.json({ success: true, message: "Category deleted!" });
  });

  // Settings Endpoints
  app.get("/api/settings", (_req, res) => {
    const settings = getSettings();
    // Do not expose database password in plain client requests if any
    const safeSettings = { ...settings };
    if (safeSettings.mysqlPassword) {
      safeSettings.mysqlPassword = "********";
    }
    res.json({ success: true, settings: safeSettings });
  });

  app.post("/api/settings", (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : "";
    if (token !== "admin-session-" + Buffer.from(ADMIN_PASSWORD).toString("base64")) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const newSettings = req.body;
    const current = getSettings();
    // If password is masked, keep old password
    if (newSettings.mysqlPassword === "********") {
      newSettings.mysqlPassword = current.mysqlPassword;
    }

    const updated = { ...current, ...newSettings };
    saveSettings(updated);
    res.json({ success: true, settings: updated, message: "Settings saved successfully!" });
  });

  // AI Movie Scraper
  app.post("/api/ai/scrape-movie", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ success: false, message: "Please provide a movie link or title." });
      }

      const settings = getSettings();
      const movieData = await scrapeMovieWithAI(query.trim(), settings.customApiKey);
      res.json({ success: true, movie: movieData });
    } catch (error: any) {
      console.error("AI Scraper error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to auto-scrape movie details via AI.",
      });
    }
  });

  // Export MySQL SQL dump (.sql file)
  app.get("/api/export/mysql", (_req, res) => {
    try {
      const sqlDump = generateMysqlDump();
      res.setHeader("Content-Type", "application/sql");
      res.setHeader("Content-Disposition", 'attachment; filename="cineflix_database.sql"');
      res.send(sqlDump);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Vite Middleware for development / Static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Movie Download Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
