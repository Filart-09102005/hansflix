import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getSimilarMovies, getMovieWatchProviders, getMovieVideos } from "../../services/movie.service";
import { getReviews, addReview } from "../../services/review.service";
import useAuth from "../../hooks/useAuth";
import { useAuthModal } from "../../context/AuthModalContext";
import { useTrailerModal } from "../../context/TrailerModalContext";
import MovieRow from "../../components/movie/MovieRow";
import HeroBanner from "../../components/layout/HeroBanner";

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openLogin } = useAuthModal();
    const { openTrailer } = useTrailerModal();

    const [movie, setMovie] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [providers, setProviders] = useState(null);
    const [reviews, setReviews] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                const [movieData, similarData, providersData, reviewsData] = await Promise.all([
                    getMovieDetails(id),
                    getSimilarMovies(id),
                    getMovieWatchProviders(id),
                    getReviews(id)
                ]);
                setMovie(movieData);
                setSimilarMovies(similarData);
                setProviders(providersData);
                setReviews(reviewsData);
            } catch (error) {
                console.error("Error fetching movie data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleSelectMovie = useCallback((selectedMovie) => {
        navigate(`/movie/${selectedMovie.id}`);
    }, [navigate]);

    const handlePlayTrailer = async () => {
        try {
            const videos = await getMovieVideos(id);
            const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube") || videos[0];
            openTrailer(trailer ? trailer.key : null);
        } catch (error) {
            console.error("Error playing trailer:", error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            openLogin();
            return;
        }
        if (!reviewText.trim()) return;

        setIsSubmittingReview(true);
        try {
            await addReview(id, user.id, rating, reviewText);
            // Refresh reviews
            const updatedReviews = await getReviews(id);
            setReviews(updatedReviews);
            setReviewText("");
            setRating(5);
        } catch (error) {
            console.error("Error adding review:", error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-20 px-8 flex flex-col gap-8">
                <div className="w-full h-[60vh] bg-white/5 animate-pulse rounded-xl"></div>
                <div className="w-1/3 h-8 bg-white/5 animate-pulse rounded"></div>
                <div className="w-full h-32 bg-white/5 animate-pulse rounded"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <p className="text-xl">Movie not found.</p>
            </div>
        );
    }

    // HeroBanner expects a specific format, we modify it slightly here for the detail page
    const detailMovie = { ...movie, heroImageMode: "backdrop" };

    return (
        <main className="min-h-screen bg-background pb-20">
            <HeroBanner movie={detailMovie} />

            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-20 space-y-12">
                {/* Watch Now Button for detail page if not on HeroBanner */}
                <div className="flex gap-4">
                    <button 
                        onClick={handlePlayTrailer}
                        className="bg-primary text-white px-8 py-3 rounded font-bold text-lg hover:bg-red-700 transition shadow-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Watch Trailer
                    </button>
                </div>

                {/* Where to Watch */}
                {providers && (providers.flatrate || providers.rent || providers.buy) && (
                    <section className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <h2 className="text-2xl font-bold mb-6 text-white">Where to Watch</h2>
                        <div className="space-y-6">
                            {providers.flatrate && (
                                <div>
                                    <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Stream</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {providers.flatrate.map(p => (
                                            <div key={p.provider_id} className="flex flex-col items-center gap-2">
                                                <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-12 h-12 rounded-xl shadow-md" />
                                                <span className="text-xs text-gray-300">{p.provider_name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {providers.rent && (
                                <div>
                                    <h3 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">Rent</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {providers.rent.map(p => (
                                            <div key={p.provider_id} className="flex flex-col items-center gap-2">
                                                <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} alt={p.provider_name} className="w-12 h-12 rounded-xl shadow-md" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {providers.link && (
                            <div className="mt-6">
                                <a href={providers.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-red-400 text-sm font-medium flex items-center gap-1">
                                    View full options on TMDB
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </section>
                )}

                {/* Ratings & Reviews */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-white">Ratings & Reviews</h2>
                    
                    {/* Add Review Form */}
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                        <h3 className="text-lg font-medium mb-4 text-white">Write a Review</h3>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Review</label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your thoughts about this movie..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary resize-none h-24"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmittingReview || !reviewText.trim()}
                                className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className="bg-black/40 rounded-lg p-5 border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                                                {review.user_email?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-gray-200">{review.user_email?.split('@')[0]}</span>
                                        </div>
                                        <div className="text-yellow-400 text-sm">
                                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                                    <p className="text-xs text-gray-500 mt-3">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Similar Movies */}
                {similarMovies.length > 0 && (
                    <section className="-mx-6 md:-mx-12">
                        <MovieRow title="Similar Movies" movies={similarMovies} onSelectMovie={handleSelectMovie} />
                    </section>
                )}
            </div>
        </main>
    );
}
