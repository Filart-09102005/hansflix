import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import { getUserWatchlist, addToWatchlist as addService, removeFromWatchlist as removeService } from '../services/watchlist.service';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const watchlistMovieIds = useMemo(
        () => new Set(watchlist.map((item) => String(item.movie_id))),
        [watchlist]
    );

    const fetchWatchlist = useCallback(async () => {
        if (!user) {
            setWatchlist([]);
            setLoading(false);
            return;
        }
        
        setLoading(true);
        const data = await getUserWatchlist(user.id);
        setWatchlist(data || []);
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchWatchlist();
    }, [fetchWatchlist]);

    const addToWatchlist = useCallback(async (movie) => {
        if (!user) return { error: { message: "You must be logged in" } };

        // Optimistic UI update
        const optimisticMovie = {
            id: 'temp-' + Date.now(),
            user_id: user.id,
            movie_id: String(movie.id),
            title: movie.title,
            poster_path: movie.poster,
            created_at: new Date().toISOString()
        };

        // Check duplicate in current state to prevent double clicking issues
        if (watchlist.some(m => m.movie_id === String(movie.id))) {
            return { error: { message: "Already in watchlist" }, duplicate: true };
        }

        setWatchlist(prev => [optimisticMovie, ...prev]);

        const result = await addService(user.id, movie);
        
        if (result.error && !result.duplicate) {
            // Revert on error
            setWatchlist(prev => prev.filter(m => m.id !== optimisticMovie.id));
            return result;
        }

        if (!result.duplicate && result.data) {
            setWatchlist(prev =>
                prev.map(m => (m.id === optimisticMovie.id ? result.data : m))
            );
        }
        
        return result;
    }, [user, watchlist]);

    const removeFromWatchlist = useCallback(async (movieId) => {
        if (!user) return;

        // Optimistic UI
        const prevWatchlist = [...watchlist];
        setWatchlist(prev => prev.filter(m => m.movie_id !== String(movieId)));

        const result = await removeService(user.id, movieId);
        
        if (result.error) {
            // Revert on error
            setWatchlist(prevWatchlist);
        }
        
        return result;
    }, [user, watchlist]);

    const isInWatchlist = useCallback((movieId) => {
        return watchlistMovieIds.has(String(movieId));
    }, [watchlistMovieIds]);

    const value = useMemo(() => ({
        watchlist,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        refreshWatchlist: fetchWatchlist
    }), [addToWatchlist, fetchWatchlist, isInWatchlist, loading, removeFromWatchlist, watchlist]);

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
}

export const useWatchlistContext = () => useContext(WatchlistContext);
