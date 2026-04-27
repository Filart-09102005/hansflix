import { useState, useEffect } from "react";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getMoviesByGenre } from "../services/movie.service";
import { setLocalMoviePool } from "../components/search/SearchBar";

let moviesCache = null;
const ROW_TARGET_SIZE = 18;

const pickUniqueMovies = (source, usedIds, limit) => {
    const selected = [];
    for (const movie of source) {
        if (!movie || usedIds.has(movie.id)) continue;
        usedIds.add(movie.id);
        selected.push(movie);
        if (selected.length >= limit) break;
    }
    return selected;
};

const backfillRow = (row, preferredPool, usedIds, targetSize) => {
    if (row.length >= targetSize) return row;

    const filled = [...row];
    for (const movie of preferredPool) {
        if (!movie || usedIds.has(movie.id)) continue;
        usedIds.add(movie.id);
        filled.push(movie);
        if (filled.length >= targetSize) break;
    }

    // Final fallback: allow duplicates only if we still cannot fill.
    if (filled.length < targetSize) {
        for (const movie of preferredPool) {
            if (!movie) continue;
            filled.push(movie);
            if (filled.length >= targetSize) break;
        }
    }

    return filled;
};

export default function useMovies() {
    const [movies, setMovies] = useState({
        trending: [],
        popular: [],
        topRated: [],
        action: [],
        fantasy: [],
        drama: [],
        romCom: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchAllMovies = async () => {
            if (moviesCache) {
                setMovies(moviesCache);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const [trending, popular, topRated, action, fantasy, drama, romCom] = await Promise.all([
                    getTrendingMovies(),
                    getPopularMovies(),
                    getTopRatedMovies(),
                    getMoviesByGenre("28", "genre-action"),
                    getMoviesByGenre("14", "genre-fantasy"),
                    getMoviesByGenre("18", "genre-drama"),
                    getMoviesByGenre("10749,35", "genre-romcom"),
                ]);

                const usedIds = new Set();
                const mergedPool = [...trending, ...popular, ...topRated, ...action, ...fantasy, ...drama, ...romCom];

                const curatedTrending = pickUniqueMovies(trending, usedIds, ROW_TARGET_SIZE);
                const curatedPopular = pickUniqueMovies(popular, usedIds, ROW_TARGET_SIZE);
                const curatedTopRated = pickUniqueMovies(topRated, usedIds, ROW_TARGET_SIZE);
                const curatedAction = pickUniqueMovies(action, usedIds, ROW_TARGET_SIZE);
                const curatedFantasy = pickUniqueMovies(fantasy, usedIds, ROW_TARGET_SIZE);
                const curatedDrama = pickUniqueMovies(drama, usedIds, ROW_TARGET_SIZE);
                const curatedRomCom = pickUniqueMovies(romCom, usedIds, ROW_TARGET_SIZE);

                const nextMovies = {
                    trending: backfillRow(curatedTrending, mergedPool, usedIds, ROW_TARGET_SIZE),
                    popular: backfillRow(curatedPopular, mergedPool, usedIds, ROW_TARGET_SIZE),
                    topRated: backfillRow(curatedTopRated, mergedPool, usedIds, ROW_TARGET_SIZE),
                    action: backfillRow(curatedAction, mergedPool, usedIds, ROW_TARGET_SIZE),
                    fantasy: backfillRow(curatedFantasy, mergedPool, usedIds, ROW_TARGET_SIZE),
                    drama: backfillRow(curatedDrama, mergedPool, usedIds, ROW_TARGET_SIZE),
                    romCom: backfillRow(curatedRomCom, mergedPool, usedIds, ROW_TARGET_SIZE),
                };

                moviesCache = nextMovies;
                // Feed the local search pool
                const allMovies = Object.values(nextMovies).flat();
                const unique = [...new Map(allMovies.map(m => [m.id, m])).values()];
                setLocalMoviePool(unique);
                if (isMounted) {
                    setMovies(nextMovies);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAllMovies();
        return () => {
            isMounted = false;
        };
    }, []);

    return { movies, loading, error };
}
