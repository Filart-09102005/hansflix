import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../../services/movie.service";

// ─── Debounce hook ───
function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

// ─── Highlight matching text ───
function HighlightText({ text, query }) {
    if (!query.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return (
        <span>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-primary/40 text-white rounded-sm px-0.5">{part}</mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </span>
    );
}

// ─── Single result item ───
const ResultItem = memo(function ResultItem({ movie, query, onClick }) {
    return (
        <button
            onMouseDown={(e) => {
                e.preventDefault(); // prevent blur before click fires
                onClick(movie);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left group"
        >
            <div className="w-10 h-14 rounded overflow-hidden flex-none bg-neutral-800">
                <img
                    src={movie.poster}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate group-hover:text-primary transition-colors">
                    <HighlightText text={movie.title} query={query} />
                </p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 group-hover:text-gray-400 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </button>
    );
});

// ─── Local movie cache search ───
let localMoviePool = [];
export function setLocalMoviePool(movies) {
    localMoviePool = movies;
}

function searchLocal(query) {
    const q = query.toLowerCase().trim();
    if (!q || localMoviePool.length === 0) return [];
    return localMoviePool
        .filter((m) => m.title?.toLowerCase().includes(q))
        .slice(0, 8);
}

// ─── Main SearchBar Component ───
export default function SearchBar({ variant = "desktop" }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const abortRef = useRef(null);

    const debouncedQuery = useDebounce(query, 350);

    // Open search bar (desktop icon click)
    const handleOpen = useCallback(() => {
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 120);
    }, []);

    // Close search bar
    const handleClose = useCallback(() => {
        if (!query.trim()) {
            setIsOpen(false);
        }
        setFocused(false);
    }, [query]);

    // Navigate to full search page
    const handleSubmit = useCallback(
        (e) => {
            e?.preventDefault();
            if (query.trim()) {
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                setIsOpen(false);
                setQuery("");
                setResults([]);
                inputRef.current?.blur();
            }
        },
        [navigate, query]
    );

    // Click on a result
    const handleResultClick = useCallback(
        (movie) => {
            navigate(`/search?q=${encodeURIComponent(movie.title)}`);
            setIsOpen(false);
            setQuery("");
            setResults([]);
        },
        [navigate]
    );

    // ─── Real-time search logic ───
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        // 1) Instant local filter
        const localResults = searchLocal(debouncedQuery);
        if (localResults.length > 0) {
            setResults(localResults);
        }

        // 2) API call for fuller results
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        searchMovies(debouncedQuery)
            .then((apiResults) => {
                if (controller.signal.aborted) return;
                // Merge: deduplicate by id, local first
                const merged = new Map();
                localResults.forEach((m) => merged.set(m.id, m));
                apiResults.forEach((m) => {
                    if (!merged.has(m.id)) merged.set(m.id, m);
                });
                setResults(Array.from(merged.values()).slice(0, 8));
            })
            .catch(() => {})
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [debouncedQuery]);

    // Clear on route change (handled by parent, but also internal)
    const showDropdown = focused && query.trim().length > 0;

    // ─── Desktop variant ───
    if (variant === "desktop") {
        return (
            <div ref={containerRef} className="relative hidden md:flex items-center">
                <div
                    className={`flex items-center transition-all duration-300 ease-out rounded-full overflow-hidden ${
                        isOpen
                            ? "bg-black/90 border border-white/20 w-80 shadow-lg shadow-black/40"
                            : "w-9 hover:text-white"
                    }`}
                >
                    <button
                        onClick={isOpen ? () => { setIsOpen(false); setQuery(""); setResults([]); } : handleOpen}
                        className="flex-none w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                        aria-label="Search"
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </button>
                    {isOpen && (
                        <form onSubmit={handleSubmit} className="flex-1 pr-3">
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Titles, people, genres"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={handleClose}
                                className="w-full bg-transparent text-white text-sm py-1.5 outline-none placeholder:text-gray-500"
                                autoComplete="off"
                            />
                        </form>
                    )}
                </div>

                {/* Dropdown */}
                {isOpen && showDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-[#181818]/98 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-dropdown-in">
                        {/* Loading bar */}
                        {loading && (
                            <div className="h-0.5 bg-white/5 overflow-hidden">
                                <div className="h-full w-1/3 bg-primary rounded-full animate-loading-bar"></div>
                            </div>
                        )}

                        {results.length > 0 ? (
                            <div className="py-1.5 max-h-[420px] overflow-y-auto scrollbar-hide">
                                {results.map((movie) => (
                                    <ResultItem
                                        key={movie.id}
                                        movie={movie}
                                        query={query}
                                        onClick={handleResultClick}
                                    />
                                ))}
                            </div>
                        ) : !loading ? (
                            <div className="px-4 py-8 text-center">
                                <p className="text-gray-400 text-sm">No results for "<span className="text-white">{query}</span>"</p>
                            </div>
                        ) : null}

                        {/* View all results footer */}
                        {results.length > 0 && (
                            <button
                                onMouseDown={(e) => { e.preventDefault(); handleSubmit(); }}
                                className="w-full px-4 py-3 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5 flex items-center justify-center gap-2"
                            >
                                View all results
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // ─── Mobile variant ───
    return (
        <form
            onSubmit={handleSubmit}
            className="relative"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/15 text-white text-sm pl-10 pr-4 py-2.5 rounded-lg outline-none focus:border-white/30 placeholder:text-gray-500"
            />
        </form>
    );
}
