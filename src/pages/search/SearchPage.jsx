import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchMovies } from "../../services/movie.service";
import MovieCard from "../../components/movie/MovieCard";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchResults = useCallback(async () => {
        if (!query.trim()) {
            setTimeout(() => {
                setResults([]);
                setHasSearched(false);
            }, 0);
            return;
        }
        setLoading(true);
        const data = await searchMovies(query);
        setResults(data);
        setHasSearched(true);
        setLoading(false);
    }, [query]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    return (
        <div className="min-h-screen pt-28 px-6 md:px-16 text-foreground pb-20 transition-colors bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        {query ? (
                            <>Results for <span className="text-primary">"{query}"</span></>
                        ) : (
                            "Search"
                        )}
                    </h1>
                    {hasSearched && (
                        <p className="text-muted mt-2">
                            {results.length} {results.length === 1 ? "result" : "results"} found
                        </p>
                    )}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="w-full h-[240px] md:h-[390px] rounded-lg bg-card animate-pulse"></div>
                        ))}
                    </div>
                )}

                {/* Results Grid */}
                {!loading && results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {results.map((movie) => (
                            <div key={movie.id} className="w-full h-[240px] md:h-[390px]">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && hasSearched && results.length === 0 && (
                    <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center mt-8">
                        <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No results found</h3>
                        <p className="text-muted max-w-sm mx-auto mb-6">
                            We couldn't find any movies matching "{query}". Try a different search term.
                        </p>
                        <Link 
                            to="/"
                            className="inline-flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm hover:shadow-[0_0_20px_rgba(229,9,20,0.3)]"
                        >
                            Browse Movies
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
