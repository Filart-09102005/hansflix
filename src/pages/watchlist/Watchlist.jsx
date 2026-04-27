import { Link } from "react-router-dom";
import useWatchlist from "../../hooks/useWatchlist";
import { memo, useCallback, useState } from "react";
import { motion } from "framer-motion";

const WatchlistCard = memo(function WatchlistCard({ item, onRemove }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.div
            className="relative group rounded-xl overflow-hidden bg-card shadow-xl"
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
        >
            <div className="w-full aspect-[2/3] relative">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-700" />
                )}
                <img
                    src={item.poster_path}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-sm leading-tight mb-3 drop-shadow-md">{item.title}</h3>
                <button
                    onClick={() => onRemove(item.movie_id)}
                    className="w-full bg-white/15 backdrop-blur-md hover:bg-red-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-red-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                </button>
            </div>
        </motion.div>
    );
});

export default function Watchlist() {
    const { watchlist, loading, removeFromWatchlist } = useWatchlist();

    const handleRemove = useCallback(async (movieId) => {
        await removeFromWatchlist(movieId);
    }, [removeFromWatchlist]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted">Loading your watchlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 px-6 md:px-16 text-foreground bg-background transition-colors pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">My List</h1>
                        <p className="text-muted mt-2">
                            {watchlist.length} {watchlist.length === 1 ? "title" : "titles"}
                        </p>
                    </div>
                </div>

                {watchlist.length === 0 ? (
                    <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center mt-8">
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Your watchlist is empty</h3>
                        <p className="text-muted max-w-sm mx-auto mb-6">
                            Explore our library and add movies to your watchlist to keep track of what you want to watch next.
                        </p>
                        <Link 
                            to="/"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {watchlist.map((item) => (
                            <WatchlistCard
                                key={item.id}
                                item={item}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
