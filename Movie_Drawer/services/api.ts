// Define types for Movie and MovieDetails
export type Movie = {
  imdbRating: string | undefined;
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export type MovieDetails = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
};

// API response type including totalResults
type OmdbSearchResponse = {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string; // Add optional Error property
};

// OMDB API configuration
export const OMDB_CONFIG = {
  BASE_URL: "https://www.omdbapi.com/",
  API_KEY: process.env.EXPO_PUBLIC_OMDB_API_KEY, // Ensure this is set in your environment variables
};

// Debugging: Log the API key to ensure it's loaded correctly
console.log("OMDB API Key:", process.env.EXPO_PUBLIC_OMDB_API_KEY);

if (!process.env.EXPO_PUBLIC_OMDB_API_KEY) {
  console.error("Error: OMDB API key is missing. Please set EXPO_PUBLIC_OMDB_API_KEY in your environment variables.");
}

// Enhanced fetch movies function that returns totalResults as well
export const fetchMovies = async ({
  query,
  page = 1, // Default to page 1
  year = "2025", // Default year
}: {
  query?: string;
  page?: number;
  year?: string;
}): Promise<{ movies: Movie[]; totalResults: number; year: string }> => {
  // Use year as query if no specific query is provided
  const searchQuery = query || year;

  // Build endpoint with year parameter
  const endpoint = `${OMDB_CONFIG.BASE_URL}?apikey=${OMDB_CONFIG.API_KEY}&s=${encodeURIComponent(searchQuery)}&y=${year}&page=${page}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json() as OmdbSearchResponse;

    if (data.Response === "False") {
      throw new Error(data.Error || "No movies found");
    }

    console.log(`Fetched movies for year ${year}, page ${page}:`, {
      count: data.Search.length,
      totalResults: data.totalResults,
    });

    return {
      movies: data.Search,
      totalResults: parseInt(data.totalResults, 10),
      year: year,
    };
  } catch (error) {
    console.error(`Error fetching movies for year ${year}:`, error);
    throw error;
  }
};

// Fetch details for a specific movie by IMDb ID
export const fetchMovieDetails = async (imdbID: string): Promise<MovieDetails> => {
  const endpoint = `${OMDB_CONFIG.BASE_URL}?apikey=${OMDB_CONFIG.API_KEY}&i=${imdbID}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie details not found");
    }

    // console.log("Fetched movie details:", data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};


// Fetch movies by search query

export const fetchBySearch = async (searchParam: string): Promise<Movie[]> => {
  let searchItem = searchParam.trimEnd();
  const endpoint = `${OMDB_CONFIG.BASE_URL}?apikey=${OMDB_CONFIG.API_KEY}&s=${encodeURIComponent(searchItem)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }

    const data = await response.json() as OmdbSearchResponse;

    if (data.Response === "False") {
      throw new Error("No movies found");
    }

    return data.Search || []; // Return an empty array if Search is undefined
  } catch (error) {
    console.error("Error fetching movies by search:", error);
    return []; // Return an empty array in case of error
  }
};