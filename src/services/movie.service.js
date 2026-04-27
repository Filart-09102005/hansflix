import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";
const responseCache = new Map();

const tmdb = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});

// Block known glitchy or broken images
const BLOCKED_IMAGES = new Set([
    "/9nzfyiYbmTUXWC4B2kwjl4NAlqO.jpg",
]);

// Helper to format TMDB response to match our component structure
const formatMovie = (item) => {
    if (!item) return null;
    if (BLOCKED_IMAGES.has(item.poster_path) || BLOCKED_IMAGES.has(item.backdrop_path)) return null;

    const posterPath = item.poster_path
        ? `${POSTER_BASE_URL}${item.poster_path}`
        : item.backdrop_path
            ? `${BACKDROP_BASE_URL}${item.backdrop_path}`
            : null;
    const backdropPath = item.backdrop_path
        ? `${BACKDROP_BASE_URL}${item.backdrop_path}`
        : item.poster_path
            ? `${POSTER_BASE_URL}${item.poster_path}`
            : null;

    return {
        id: item.id,
        title: item.title || item.name,
        description: item.overview,
        poster: posterPath,
        backdrop: backdropPath,
    };
};

const getCached = async (key, fetcher) => {
    if (responseCache.has(key)) {
        return responseCache.get(key);
    }
    const data = await fetcher();
    responseCache.set(key, data);
    return data;
};

const fetchPagedMovies = async (path, { params = {}, pages = 1, cacheKey }) => {
    return getCached(cacheKey, async () => {
        const requests = Array.from({ length: pages }, (_, index) =>
            tmdb.get(path, {
                params: {
                    ...params,
                    page: index + 1,
                },
            })
        );

        const responses = await Promise.all(requests);
        const uniqueById = new Map();

        responses.forEach((response) => {
            response.data.results
                .map(formatMovie)
                .filter((movie) => movie?.poster || movie?.backdrop)
                .forEach((movie) => {
                    if (!uniqueById.has(movie.id)) {
                        uniqueById.set(movie.id, movie);
                    }
                });
        });

        return Array.from(uniqueById.values());
    });
};

export const getTrendingMovies = async () => {
    try {
        return await fetchPagedMovies("/trending/movie/week", {
            pages: 2,
            cacheKey: "trending-week-p2",
        });
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};

export const getPopularMovies = async () => {
    try {
        return await fetchPagedMovies("/movie/popular", {
            pages: 2,
            cacheKey: "popular-p2",
        });
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
};

export const getTopRatedMovies = async () => {
    try {
        return await fetchPagedMovies("/movie/top_rated", {
            pages: 2,
            cacheKey: "top-rated-p2",
        });
    } catch (error) {
        console.error("Error fetching top rated movies:", error);
        return [];
    }
};

export const getMoviesByGenre = async (genreId, cacheKey) => {
    try {
        return await fetchPagedMovies("/discover/movie", {
            params: {
                with_genres: genreId,
                sort_by: "popularity.desc",
            },
            pages: 3,
            cacheKey: `${cacheKey}-p3`,
        });
    } catch (error) {
        console.error("Error fetching genre movies:", error);
        return [];
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdb.get(`/movie/${movieId}`);
        return formatMovie(response.data);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
};

export const getMovieVideos = async (movieId) => {
    try {
        const response = await tmdb.get(`/movie/${movieId}/videos`);
        return response.data.results;
    } catch (error) {
        console.error("Error fetching movie videos:", error);
        return [];
    }
};

export const searchMovies = async (query) => {
    if (!query || query.trim().length === 0) return [];
    try {
        const response = await tmdb.get("/search/movie", {
            params: { query: query.trim() },
        });
        return response.data.results
            .map(formatMovie)
            .filter((movie) => movie?.poster);
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

export const getSimilarMovies = async (movieId) => {
    try {
        const response = await tmdb.get(`/movie/${movieId}/similar`);
        return response.data.results
            .map(formatMovie)
            .filter((movie) => movie?.poster);
    } catch (error) {
        console.error("Error fetching similar movies:", error);
        return [];
    }
};

export const getMovieWatchProviders = async (movieId) => {
    try {
        const response = await tmdb.get(`/movie/${movieId}/watch/providers`);
        // We usually want US or global providers; fallback to first available if US not found
        const results = response.data.results;
        if (!results) return null;
        
        const countryData = results["US"] || Object.values(results)[0];
        return countryData || null;
    } catch (error) {
        console.error("Error fetching watch providers:", error);
        return null;
    }
};
