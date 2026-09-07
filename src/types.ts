export interface DownloadOption {
  size: string;
  url: string;
  enabled: boolean;
  mirrors?: { name: string; url: string }[];
}

export interface MovieDownloads {
  quality4k: DownloadOption;    // e.g., 7.2GB
  quality1080p: DownloadOption; // e.g., 1.8GB
  quality720p: DownloadOption;  // e.g., 846MB
  quality480p: DownloadOption;  // e.g., 309MB
}

export interface Movie {
  id: string;
  title: string;
  imdbRating: string;
  genres: string[];
  languages: string[];
  quality: string;
  size: string;
  director: string;
  writers: string;
  stars: string;
  storyline: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseYear: number;
  categories: string[];
  screenshots: string[];
  downloads: MovieDownloads;
  createdAt: string;
  views: number;
  downloadsCount: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteTags: string;
  announcement: string;
  telegramLink?: string;
  customApiKey?: string;
  mysqlHost?: string;
  mysqlPort?: number;
  mysqlUser?: string;
  mysqlPassword?: string;
  mysqlDatabase?: string;
}
