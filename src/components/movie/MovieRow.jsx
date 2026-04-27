import MovieCard from "./MovieCard";
import { memo, useCallback, useEffect, useRef, useState } from "react";

function MovieRow({ title, movies = [], onSelectMovie }) {
    const rowRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const updateScrollState = useCallback(() => {
        const el = rowRef.current;
        if (!el) return;

        const maxScroll = Math.max(el.scrollWidth - el.clientWidth, 0);
        setCanScrollLeft(el.scrollLeft > 8);
        setCanScrollRight(el.scrollLeft < maxScroll - 8);
        setScrollProgress(maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0);
    }, []);

    useEffect(() => {
        updateScrollState();
    }, [movies, updateScrollState]);

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;

        el.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [updateScrollState]);

    const scrollByAmount = useCallback((direction) => {
        const el = rowRef.current;
        if (!el) return;
        const amount = Math.max(el.clientWidth * 0.82, 260);
        el.scrollBy({ left: direction * amount, behavior: "smooth" });
    }, []);

    if (!movies || movies.length === 0) return null;

    return (
        <div className="py-6 px-6 md:px-12 relative anim-row-container">
            <h2 className="text-white text-xl md:text-2xl font-bold mb-6 tracking-wide drop-shadow-md anim-row-title">
                {title}
            </h2>

            <div className="relative">
                {/* Scrollable container */}
                <div
                    ref={rowRef}
                    className="flex gap-4 md:gap-6 overflow-x-scroll scrollbar-hide py-4 -my-4 px-2 -mx-2 scroll-smooth"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} />
                    ))}
                </div>

                {/* Scroll arrow buttons */}
                <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between z-20">
                    <button
                        type="button"
                        onClick={() => scrollByAmount(-1)}
                        className={`pointer-events-auto ml-1 md:ml-2 h-10 w-10 flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white text-lg font-bold transition-all duration-200 hover:scale-110 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        aria-label={`Scroll ${title} left`}
                        disabled={!canScrollLeft}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByAmount(1)}
                        className={`pointer-events-auto mr-1 md:mr-2 h-10 w-10 flex items-center justify-center rounded-full bg-black/70 hover:bg-black/90 text-white text-lg font-bold transition-all duration-200 hover:scale-110 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        aria-label={`Scroll ${title} right`}
                        disabled={!canScrollRight}
                    >
                        ›
                    </button>
                </div>

                {/* Edge fades */}
                <div className="absolute inset-y-0 right-0 w-10 md:w-16 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-y-0 left-0 w-10 md:w-16 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
            </div>

            <div className="mt-4 h-[2px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary/60 transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(scrollProgress, 5)}%` }}
                />
            </div>

        </div>
    );
}

export default memo(MovieRow);
