import fs from "fs";
import path from "path";
import { Movie, Category, SiteSettings } from "../src/types.js";

const DATA_DIR = path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MOVIES_FILE = path.join(DATA_DIR, "movies.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Latest Movies", slug: "latest-movies", description: "Newly released blockbusters and trending hits" },
  { id: "cat-2", name: "Bollywood Movies", slug: "bollywood-movies", description: "Top Hindi cinema movies and premieres" },
  { id: "cat-3", name: "Hollywood Movies", slug: "hollywood-movies", description: "English and international blockbusters" },
  { id: "cat-4", name: "South Movies", slug: "south-movies", description: "Tamil, Telugu, Malayalam, and Kannada cinema" },
  { id: "cat-5", name: "Hindi Dubbed Movies", slug: "hindi-dubbed-movies", description: "Hollywood & South films dubbed in Hindi Dual Audio" },
  { id: "cat-6", name: "Korean Movies", slug: "korean-movies", description: "K-Drama, thriller, and action cinema from Korea" },
];

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "CineFlix Movies",
  siteDescription: "Download 4K, 1080p, 720p, 480p HD Movies in Dual Audio (Hindi, English, Tamil, Telugu, Korean, Japanese)",
  siteTags: "4k movies download, 1080p hdrip, bollywood movies, hollywood hindi dubbed, south movies hindi dubbed, korean movies, fast direct download",
  announcement: "⚡ Welcome to CineFlix Portal! Direct High-Speed Download Links (4K, 1080p, 720p, 480p) Available. Join our official Telegram channel for daily updates!",
  telegramLink: "https://t.me/cineflix_movies_official",
  mysqlHost: "localhost",
  mysqlPort: 3306,
  mysqlUser: "root",
  mysqlPassword: "",
  mysqlDatabase: "cineflix_db"
};

export const DEFAULT_MOVIES: Movie[] = [
  {
    id: "mov-1",
    title: "Jawan (2023) Dual Audio [Hindi + Tamil + Telugu]",
    imdbRating: "7.0/10",
    genres: ["Action", "Thriller", "Drama"],
    languages: ["Hindi", "Tamil", "Telugu"],
    quality: "4K UHD | 1080p | 720p | 480p WEB-DL x264/HEVC",
    size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
    director: "Atlee",
    writers: "Atlee, S. Ramana Girivasan, Sumit Arora",
    stars: "Shah Rukh Khan, Nayanthara, Vijay Sethupathi, Deepika Padukone",
    storyline: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society. Driven by a personal vendetta while upholding a promise made years ago, he faces a monstrous outlaw with no fear.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1600&auto=format&fit=crop&q=80",
    releaseYear: 2023,
    categories: ["Latest Movies", "Bollywood Movies", "South Movies", "Hindi Dubbed Movies"],
    screenshots: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=900&auto=format&fit=crop&q=80"
    ],
    downloads: {
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/jawan-4k-hdr.mkv", enabled: true, mirrors: [{ name: "High Speed Server 1", url: "https://fastdownload.cloud/jawan-4k-hdr.mkv" }, { name: "Cloud Drive Mirror", url: "https://drive.mirror.net/jawan4k" }] },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/jawan-1080p-web.mkv", enabled: true, mirrors: [{ name: "High Speed Server 1", url: "https://fastdownload.cloud/jawan-1080p-web.mkv" }] },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/jawan-720p-web.mkv", enabled: true, mirrors: [{ name: "High Speed Server 1", url: "https://fastdownload.cloud/jawan-720p-web.mkv" }] },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/jawan-480p-mobile.mkv", enabled: true, mirrors: [{ name: "High Speed Server 1", url: "https://fastdownload.cloud/jawan-480p-mobile.mkv" }] },
    },
    createdAt: new Date().toISOString(),
    views: 45200,
    downloadsCount: 19800,
    featured: true
  },
  {
    id: "mov-2",
    title: "Oppenheimer (2023) [English + Hindi Dubbed]",
    imdbRating: "8.9/10",
    genres: ["Biography", "Drama", "History"],
    languages: ["English", "Hindi"],
    quality: "4K IMAX UHD | 1080p | 720p | 480p BluRay",
    size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
    director: "Christopher Nolan",
    writers: "Christopher Nolan, Kai Bird, Martin Sherwin",
    stars: "Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr., Florence Pugh",
    storyline: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral dilemmas and political consequences that followed.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    releaseYear: 2023,
    categories: ["Latest Movies", "Hollywood Movies", "Hindi Dubbed Movies"],
    screenshots: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80"
    ],
    downloads: {
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/oppenheimer-4k.mkv", enabled: true },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/oppenheimer-1080p.mkv", enabled: true },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/oppenheimer-720p.mkv", enabled: true },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/oppenheimer-480p.mkv", enabled: true },
    },
    createdAt: new Date().toISOString(),
    views: 68100,
    downloadsCount: 31200,
    featured: true
  },
  {
    id: "mov-3",
    title: "Parasite (2019) Dual Audio [Korean + Hindi + English]",
    imdbRating: "8.5/10",
    genres: ["Drama", "Thriller", "Black Comedy"],
    languages: ["Korean", "Hindi", "English"],
    quality: "4K UHD | 1080p | 720p | 480p BluRay Remux",
    size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
    director: "Bong Joon Ho",
    writers: "Bong Joon Ho, Han Jin-won",
    stars: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik, Park So-dam",
    storyline: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan in this Oscar-winning masterpiece.",
    posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1600&auto=format&fit=crop&q=80",
    releaseYear: 2019,
    categories: ["Korean Movies", "Hindi Dubbed Movies", "Hollywood Movies"],
    screenshots: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=900&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900&auto=format&fit=crop&q=80"
    ],
    downloads: {
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/parasite-4k.mkv", enabled: true },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/parasite-1080p.mkv", enabled: true },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/parasite-720p.mkv", enabled: true },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/parasite-480p.mkv", enabled: true },
    },
    createdAt: new Date().toISOString(),
    views: 39400,
    downloadsCount: 16400,
    featured: false
  },
  {
    id: "mov-4",
    title: "Salaar: Part 1 – Ceasefire (2023) [Telugu + Hindi + Tamil + Malayalam]",
    imdbRating: "6.5/10",
    genres: ["Action", "Crime", "Drama"],
    languages: ["Telugu", "Hindi", "Tamil", "Malayalam"],
    quality: "4K UHD | 1080p | 720p | 480p WEB-DL",
    size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
    director: "Prashanth Neel",
    writers: "Prashanth Neel",
    stars: "Prabhas, Prithviraj Sukumaran, Shruti Haasan, Jagapathi Babu",
    storyline: "In the dystopian city-state of Khansaar, a prince relies on his estranged childhood friend to help him reclaim his rightful throne amidst bloody tribal conflicts.",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80",
    releaseYear: 2023,
    categories: ["Latest Movies", "South Movies", "Hindi Dubbed Movies"],
    screenshots: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80"
    ],
    downloads: {
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/salaar-4k.mkv", enabled: true },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/salaar-1080p.mkv", enabled: true },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/salaar-720p.mkv", enabled: true },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/salaar-480p.mkv", enabled: true },
    },
    createdAt: new Date().toISOString(),
    views: 52000,
    downloadsCount: 28900,
    featured: true
  },
  {
    id: "mov-5",
    title: "Train to Busan (2016) [Korean + Hindi Dubbed + English]",
    imdbRating: "7.6/10",
    genres: ["Action", "Horror", "Thriller"],
    languages: ["Korean", "Hindi", "English"],
    quality: "4K Remastered | 1080p | 720p | 480p BluRay",
    size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
    director: "Yeon Sang-ho",
    writers: "Park Joo-suk",
    stars: "Gong Yoo, Jung Yu-mi, Ma Dong-seok, Kim Su-an",
    storyline: "While a zombie virus breaks out in South Korea, passengers on a train from Seoul to Busan struggle to survive the harrowing journey.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    releaseYear: 2016,
    categories: ["Korean Movies", "Hindi Dubbed Movies"],
    screenshots: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80"
    ],
    downloads: {
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/train-to-busan-4k.mkv", enabled: true },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/train-to-busan-1080p.mkv", enabled: true },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/train-to-busan-720p.mkv", enabled: true },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/train-to-busan-480p.mkv", enabled: true },
    },
    createdAt: new Date().toISOString(),
    views: 31200,
    downloadsCount: 14500,
    featured: false
  },
  {
    id: "mov-6",
    title: "Avengers: Endgame (2019) Dual Audio [English + Hindi + Tamil + Telugu]",
    imdbRating: "8.4/10",
    genres: ["Action", "Adventure", "Sci-Fi"],
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    quality: "4K UHD HDR | 1080p | 720p | 480p BluRay",
    size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
    director: "Anthony Russo, Joe Russo",
    writers: "Christopher Markus, Stephen McFeely, Stan Lee",
    stars: "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson",
    storyline: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    posterUrl: "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1600&auto=format&fit=crop&q=80",
    releaseYear: 2019,
    categories: ["Hollywood Movies", "Hindi Dubbed Movies", "Latest Movies"],
    screenshots: [
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=900&auto=format&fit=crop&q=80"
    ],
    downloads: {
      quality4k: { size: "7.2GB", url: "https://fastdownload.cloud/avengers-endgame-4k.mkv", enabled: true },
      quality1080p: { size: "1.8GB", url: "https://fastdownload.cloud/avengers-endgame-1080p.mkv", enabled: true },
      quality720p: { size: "846MB", url: "https://fastdownload.cloud/avengers-endgame-720p.mkv", enabled: true },
      quality480p: { size: "309MB", url: "https://fastdownload.cloud/avengers-endgame-480p.mkv", enabled: true },
    },
    createdAt: new Date().toISOString(),
    views: 89000,
    downloadsCount: 52100,
    featured: true
  }
];

export function getMovies(): Movie[] {
  if (!fs.existsSync(MOVIES_FILE)) {
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(DEFAULT_MOVIES, null, 2), "utf-8");
    return DEFAULT_MOVIES;
  }
  try {
    const raw = fs.readFileSync(MOVIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MOVIES;
  }
}

export function saveMovies(movies: Movie[]): void {
  fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2), "utf-8");
}

export function getCategories(): Category[] {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(DEFAULT_CATEGORIES, null, 2), "utf-8");
    return DEFAULT_CATEGORIES;
  }
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

export function getSettings(): SiteSettings {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
    return DEFAULT_SETTINGS;
  }
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SiteSettings): void {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}

/**
 * Generates ready-to-run MySQL Schema + INSERT Statements SQL Dump
 * Exactly what user needs for hosting in MySQL database!
 */
export function generateMysqlDump(): string {
  const movies = getMovies();
  const categories = getCategories();
  const settings = getSettings();

  let sql = `-- ========================================================\n`;
  sql += `-- CineFlix Movie Portal MySQL Database Dump\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n`;
  sql += `-- Compatible with MySQL 5.7, 8.0, MariaDB & phpMyAdmin\n`;
  sql += `-- ========================================================\n\n`;

  sql += `CREATE DATABASE IF NOT EXISTS \`${settings.mysqlDatabase || "cineflix_db"}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
  sql += `USE \`${settings.mysqlDatabase || "cineflix_db"}\`;\n\n`;

  // Categories Table
  sql += `-- Table structure for categories\n`;
  sql += `DROP TABLE IF EXISTS \`categories\`;\n`;
  sql += `CREATE TABLE \`categories\` (\n`;
  sql += `  \`id\` VARCHAR(64) NOT NULL,\n`;
  sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`slug\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`description\` TEXT,\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  UNIQUE KEY \`unique_slug\` (\`slug\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  // Insert Categories
  sql += `-- Dumping data for categories\n`;
  if (categories.length > 0) {
    const catInserts = categories.map(c => {
      const escapeStr = (s: string = "") => s.replace(/'/g, "\\'").replace(/"/g, '\\"');
      return `('${escapeStr(c.id)}', '${escapeStr(c.name)}', '${escapeStr(c.slug)}', '${escapeStr(c.description || "")}')`;
    });
    sql += `INSERT INTO \`categories\` (\`id\`, \`name\`, \`slug\`, \`description\`) VALUES\n  ` + catInserts.join(",\n  ") + `;\n\n`;
  }

  // Movies Table
  sql += `-- Table structure for movies\n`;
  sql += `DROP TABLE IF EXISTS \`movies\`;\n`;
  sql += `CREATE TABLE \`movies\` (\n`;
  sql += `  \`id\` VARCHAR(64) NOT NULL,\n`;
  sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
  sql += `  \`imdb_rating\` VARCHAR(32) DEFAULT 'N/A',\n`;
  sql += `  \`genres\` TEXT,\n`;
  sql += `  \`languages\` TEXT,\n`;
  sql += `  \`quality\` VARCHAR(255) DEFAULT '4K | 1080p | 720p | 480p',\n`;
  sql += `  \`size\` VARCHAR(255) DEFAULT '480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]',\n`;
  sql += `  \`director\` VARCHAR(255),\n`;
  sql += `  \`writers\` VARCHAR(255),\n`;
  sql += `  \`stars\` TEXT,\n`;
  sql += `  \`storyline\` LONGTEXT,\n`;
  sql += `  \`poster_url\` TEXT,\n`;
  sql += `  \`backdrop_url\` TEXT,\n`;
  sql += `  \`release_year\` INT(4),\n`;
  sql += `  \`categories\` TEXT,\n`;
  sql += `  \`screenshots\` LONGTEXT,\n`;
  sql += `  \`downloads_json\` LONGTEXT,\n`;
  sql += `  \`views\` INT(11) DEFAULT 0,\n`;
  sql += `  \`downloads_count\` INT(11) DEFAULT 0,\n`;
  sql += `  \`featured\` TINYINT(1) DEFAULT 0,\n`;
  sql += `  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
  sql += `  PRIMARY KEY (\`id\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  // Insert Movies
  sql += `-- Dumping data for movies\n`;
  if (movies.length > 0) {
    const movieInserts = movies.map(m => {
      const escapeStr = (s: string = "") => s.replace(/'/g, "\\'").replace(/"/g, '\\"');
      return `('${escapeStr(m.id)}', '${escapeStr(m.title)}', '${escapeStr(m.imdbRating)}', '${escapeStr(JSON.stringify(m.genres))}', '${escapeStr(JSON.stringify(m.languages))}', '${escapeStr(m.quality)}', '${escapeStr(m.size)}', '${escapeStr(m.director)}', '${escapeStr(m.writers)}', '${escapeStr(m.stars)}', '${escapeStr(m.storyline)}', '${escapeStr(m.posterUrl)}', '${escapeStr(m.backdropUrl || "")}', ${m.releaseYear || 2024}, '${escapeStr(JSON.stringify(m.categories))}', '${escapeStr(JSON.stringify(m.screenshots))}', '${escapeStr(JSON.stringify(m.downloads))}', ${m.views || 0}, ${m.downloadsCount || 0}, ${m.featured ? 1 : 0})`;
    });
    sql += `INSERT INTO \`movies\` (\`id\`, \`title\`, \`imdb_rating\`, \`genres\`, \`languages\`, \`quality\`, \`size\`, \`director\`, \`writers\`, \`stars\`, \`storyline\`, \`poster_url\`, \`backdrop_url\`, \`release_year\`, \`categories\`, \`screenshots\`, \`downloads_json\`, \`views\`, \`downloads_count\`, \`featured\`) VALUES\n  ` + movieInserts.join(",\n  ") + `;\n\n`;
  }

  // Site Settings Table
  sql += `-- Table structure for settings\n`;
  sql += `DROP TABLE IF EXISTS \`settings\`;\n`;
  sql += `CREATE TABLE \`settings\` (\n`;
  sql += `  \`setting_key\` VARCHAR(128) NOT NULL,\n`;
  sql += `  \`setting_value\` LONGTEXT,\n`;
  sql += `  PRIMARY KEY (\`setting_key\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  sql += `INSERT INTO \`settings\` (\`setting_key\`, \`setting_value\`) VALUES\n`;
  sql += `  ('site_name', '${(settings.siteName || "").replace(/'/g, "\\'")}'),\n`;
  sql += `  ('site_description', '${(settings.siteDescription || "").replace(/'/g, "\\'")}'),\n`;
  sql += `  ('site_tags', '${(settings.siteTags || "").replace(/'/g, "\\'")}'),\n`;
  sql += `  ('announcement', '${(settings.announcement || "").replace(/'/g, "\\'")}'),\n`;
  sql += `  ('telegram_link', '${(settings.telegramLink || "").replace(/'/g, "\\'")}');\n\n`;

  return sql;
}
