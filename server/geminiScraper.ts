import { GoogleGenAI } from "@google/genai";
import { Movie } from "../src/types.js";

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Scraper will use fallback heuristic.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function scrapeMovieWithAI(urlOrTitle: string, customApiKey?: string): Promise<Partial<Movie>> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set it in Settings or environment.");
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const prompt = `You are an expert movie information database extractor and scraper for a high-end cinema and movie download portal.
The user provided the following movie link or title:
"${urlOrTitle}"

Extract or accurately look up the full authentic details for this movie. Return a valid JSON object matching the exact format below.
IMPORTANT RULES:
1. Title must be formatted nicely, e.g., "Movie Name (Year) Dual Audio [Hindi + English]" or similar.
2. IMDb Rating format: e.g. "7.9/10".
3. Genres: Array of strings (e.g. ["Action", "Sci-Fi", "Thriller"]).
4. Languages: Array of available/original audio languages (e.g. ["Hindi", "English", "Tamil", "Telugu", "Korean", "Japanese"]).
5. Quality: "4K UHD | 1080p | 720p | 480p WEB-DL HDRip".
6. Size: "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]".
7. Director: Authentic director name(s).
8. Writers: Authentic writer(s).
9. Stars: Top cast actors separated by comma.
10. Storyline: Captivating, detailed paragraph describing the plot synopsis.
11. PosterUrl: A reliable, high-resolution direct image URL for the movie poster (Unsplash cinema asset or official public web image URL).
12. BackdropUrl: A high-resolution 16:9 banner/backdrop image URL.
13. ReleaseYear: Number (e.g. 2023).
14. Categories: Array matching one or more of these standard categories: ["Latest Movies", "Bollywood Movies", "Hollywood Movies", "South Movies", "Hindi Dubbed Movies", "Korean Movies"].
15. Screenshots: Array of 3-4 high-res movie stills/screenshots image URLs.
16. Downloads: Must include options for 4K (7.2GB), 1080p (1.8GB), 720p (846MB), 480p (309MB).

Example schema to return:
{
  "title": "Inception (2010) Dual Audio [English + Hindi]",
  "imdbRating": "8.8/10",
  "genres": ["Action", "Sci-Fi", "Adventure"],
  "languages": ["English", "Hindi"],
  "quality": "4K UHD | 1080p | 720p | 480p BluRay",
  "size": "480p [309MB] | 720p [846MB] | 1080p [1.8GB] | 4K [7.2GB]",
  "director": "Christopher Nolan",
  "writers": "Christopher Nolan",
  "stars": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
  "storyline": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  "posterUrl": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
  "backdropUrl": "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1600&auto=format&fit=crop&q=80",
  "releaseYear": 2010,
  "categories": ["Hollywood Movies", "Hindi Dubbed Movies", "Latest Movies"],
  "screenshots": [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=900&auto=format&fit=crop&q=80"
  ],
  "downloads": {
    "quality4k": { "size": "7.2GB", "url": "https://fastdownload.cloud/movie-4k-hdr.mkv", "enabled": true },
    "quality1080p": { "size": "1.8GB", "url": "https://fastdownload.cloud/movie-1080p-web.mkv", "enabled": true },
    "quality720p": { "size": "846MB", "url": "https://fastdownload.cloud/movie-720p-web.mkv", "enabled": true },
    "quality480p": { "size": "309MB", "url": "https://fastdownload.cloud/movie-480p-mobile.mkv", "enabled": true }
  }
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text || "{}";
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch (err) {
    console.error("Failed to parse AI response as JSON:", text, err);
    throw new Error("Invalid AI response format while scraping movie details.");
  }
}
