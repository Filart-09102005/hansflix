import { memo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useAuthModal } from "../../context/AuthModalContext";
import useWatchlist from "../../hooks/useWatchlist";
import { useTrailerModal } from "../../context/TrailerModalContext";
import { getMovieVideos } from "../../services/movie.service";
import { motion } from "framer-motion";

function MovieCard({ movie, onSelect }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { openLogin } = useAuthModal();
    const { addToWatchlist, isInWatchlist } = useWatchlist();
    const { openTrailer } = useTrailerModal();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
    
    const isSaved = isInWatchlist(movie.id);

    const performSave = useCallback(async () => {
        await addToWatchlist(movie);
    }, [addToWatchlist, movie]);

    const handleSave = useCallback(async () => {
        if (!user) {
            openLogin(() => performSave());
            return;
        }
        await performSave();
    }, [openLogin, performSave, user]);

    const handleButtonClick = useCallback((e) => {
        e.stopPropagation();
        handleSave();
    }, [handleSave]);

    const handleImageLoad = useCallback(() => {
        setImageLoaded(true);
    }, []);

    const handleCardClick = useCallback(() => {
        // Option to still call onSelect if provided (e.g., for SearchBar suggestions)
        if (onSelect) {
            onSelect(movie);
        } else {
            navigate(`/movie/${movie.id}`);
        }
    }, [movie, onSelect, navigate]);

    const handleWatchNowClick = useCallback(async (e) => {
        e.stopPropagation();
        if (isLoadingTrailer) return;
        setIsLoadingTrailer(true);
        try {
            const videos = await getMovieVideos(movie.id);
            const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos[0];
            openTrailer(trailer ? trailer.key : null);
        } finally {
            setIsLoadingTrailer(false);
        }
    }, [movie.id, openTrailer, isLoadingTrailer]);

    return (
        <div
            className="relative flex-none w-[160px] md:w-[260px] h-[240px] md:h-[390px] rounded-lg cursor-pointer group anim-movie-card-wrapper perspective-1000"
            onClick={handleCardClick}
        >
            <motion.div 
                className="w-full h-full rounded-lg overflow-hidden bg-card shadow-xl relative z-10"
                whileHover={{ 
                    scale: 1.08, 
                    y: -5,
                }}
                transition={{ type: "spring", stiffness: 210, damping: 22 }}
            >
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-700" />
                )}
                <img 
                    src={movie.poster} 
                    alt={movie.title} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onLoad={handleImageLoad}
                />
                
                {/* Gradient overlay that appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Always-visible saved badge */}
                {isSaved && (
                    <div className="absolute top-3 right-3 z-20 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Saved
                    </div>
                )}

                {/* Details Content sliding up on hover */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <h3 className="text-white font-bold text-base md:text-xl mb-3 drop-shadow-lg leading-tight">{movie.title}</h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-green-500 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">98% Match</span>
                        <span className="border border-white/50 text-white/90 px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded">HD</span>
                    </div>
                    
                    {isSaved ? (
                        <div className="w-full py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 bg-green-500/25 text-green-300 border border-green-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            In Watchlist
                        </div>
                    ) : (
                        <motion.button 
                            onClick={handleButtonClick}
                            whileHover={{ scale: 1.05, backgroundColor: "#e5e5e5" }}
                            className="w-full py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-white text-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Watchlist
                        </motion.button>
                    )}
                    
                    <motion.button 
                        onClick={handleWatchNowClick}
                        whileHover={{ scale: 1.05 }}
                        className="w-full py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-primary text-white mt-2"
                        disabled={isLoadingTrailer}
                    >
                        {isLoadingTrailer ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                        )}
                        Watch Now
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

export default memo(MovieCard);
