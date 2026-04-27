import HeroBanner from "../../components/layout/HeroBanner";
import MovieRow from "../../components/movie/MovieRow";
import useMovies from "../../hooks/useMovies";
import { runPageLoadAnimation } from "../../utils/animations";
import { useEffect, useRef } from "react";

const FIXED_HERO_MOVIE = {
    id: "michael-2025",
    title: "Michael",
    description: "The story of Michael Jackson, one of the most influential artists the world has ever known, and his life beyond the music. His journey from the discovery of his extraordinary talent as the lead of the Jackson Five, to the visionary artist whose creative ambition fueled a relentless pursuit to become the biggest entertainer in the world, highlighting both his life off-stage and some of the most iconic performances from his early solo career.",
    backdrop: "https://image.tmdb.org/t/p/w500/3Qud19bBUrrJAzy0Ilm8gRJlJXP.jpg",
    poster: "https://image.tmdb.org/t/p/w500/3Qud19bBUrrJAzy0Ilm8gRJlJXP.jpg",
    heroImageMode: "backdrop" // Full backdrop looks better for standard Netflix layout, but we'll include both
};

export default function Home() {
    const { movies, loading, error } = useMovies();
    const hasAnimatedRef = useRef(false);
    const selectedMovie = FIXED_HERO_MOVIE;

    // Hook MUST be before any early returns (Rules of Hooks)
    useEffect(() => {
        if (!loading && !error && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            requestAnimationFrame(() => {
                runPageLoadAnimation();
            });
        }
    }, [loading, error]);

    return (
        <main className="min-h-screen bg-background text-foreground pb-20 transition-colors">
            <HeroBanner movie={selectedMovie} />
            
            <div className="relative z-20 mt-2 pb-12 flex flex-col gap-4 md:gap-8 bg-transparent">
                {loading ? (
                    <div className="flex items-center justify-center pt-20">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center pt-20 text-foreground">
                        <p className="text-xl text-red-500 mb-4">Failed to load movies.</p>
                        <p className="text-sm text-muted">Did you add your TMDB API key to the .env file?</p>
                    </div>
                ) : (
                    <>
                        <MovieRow title="Trending Now" movies={movies.trending} />
                        <MovieRow title="Popular" movies={movies.popular} />
                        <MovieRow title="Top Rated" movies={movies.topRated} />
                        <MovieRow title="Action" movies={movies.action} />
                        <MovieRow title="Fantasy" movies={movies.fantasy} />
                        <MovieRow title="Drama" movies={movies.drama} />
                        <MovieRow title="Rom-Com" movies={movies.romCom} />
                    </>
                )}
            </div>
        </main>
    );
}