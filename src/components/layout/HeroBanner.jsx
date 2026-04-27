import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrailerModal } from "../../context/TrailerModalContext";
import { getMovieVideos } from "../../services/movie.service";

export default function HeroBanner({ movie }) {
    const navigate = useNavigate();
    const { openTrailer } = useTrailerModal();
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);

    const handlePlayTrailer = async () => {
        if (!movie || isLoadingTrailer) return;
        setIsLoadingTrailer(true);
        try {
            const videos = await getMovieVideos(movie.id);
            const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos[0];
            openTrailer(trailer ? trailer.key : null);
        } catch (error) {
            console.error("Error fetching trailer:", error);
        } finally {
            setIsLoadingTrailer(false);
        }
    };

    if (!movie) return <div className="h-[75vh] md:h-[90vh] bg-background animate-pulse w-full"></div>;
    const isPosterMode = movie.heroImageMode === "poster";

    return (
        <div className="relative h-[75vh] md:h-[90vh] w-full text-white overflow-hidden bg-black">
            <AnimatePresence>
                {/* Full-width Background Image */}
                <motion.div 
                    key={`bg-${movie.id}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full z-0 overflow-hidden"
                >
                    {isPosterMode ? (
                        <>
                            <img
                                src={movie.backdrop}
                                alt=""
                                className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="h-[85%] w-auto max-w-[75%] object-contain opacity-95 drop-shadow-2xl rounded-md"
                                />
                            </div>
                        </>
                    ) : (
                        <img
                            src={movie.backdrop}
                            alt={movie.title}
                            className="w-full h-full object-cover opacity-90"
                        />
                    )}
                </motion.div>
            </AnimatePresence>
            
            {/* Ultra-smooth Gradients for text visibility */}
            {/* Left side gradient (lighter so image stays visible) */}
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent w-full md:w-[65%] z-10 pointer-events-none"></div>
            {/* Bottom vignette to blend into the rows below */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10 pointer-events-none"></div>

            <AnimatePresence>
                {/* Floating Content Container on the Left */}
                <motion.div 
                    key={`content-${movie.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="absolute inset-0 flex flex-col justify-end px-6 md:px-12 pt-32 pb-24 md:pb-32 z-20 w-full md:w-2/3 lg:w-1/2"
                >
                    <div>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-2xl tracking-tight text-white leading-tight">
                            {movie.title}
                        </h1>
                        
                        <p className="text-gray-200 text-lg md:text-xl mb-8 drop-shadow-lg line-clamp-3 md:line-clamp-none leading-relaxed font-normal max-w-2xl">
                            {movie.description}
                        </p>

                        <div className="flex gap-4">
                            <button 
                                onClick={handlePlayTrailer}
                                disabled={isLoadingTrailer}
                                className="bg-white text-black px-8 py-3 rounded flex items-center gap-3 font-bold text-lg hover:bg-gray-300 transition-colors shadow-lg disabled:opacity-75"
                            >
                                {isLoadingTrailer ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                )}
                                Play Trailer
                            </button>
                            <button 
                                onClick={() => navigate(`/movie/${movie.id}`)}
                                className="bg-gray-500/60 backdrop-blur-sm text-white px-8 py-3 rounded flex items-center gap-3 font-bold text-lg hover:bg-gray-500/80 transition-colors shadow-lg"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                More Info
                            </button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
