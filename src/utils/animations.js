import { animate, createTimeline, stagger } from 'animejs';

export const runPageLoadAnimation = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const tl = createTimeline({
        defaults: {
            ease: 'outQuad',
        },
    });

    // 1. Background + Overlay
    tl.add('.anim-app-bg', {
        opacity: [0, 1],
        duration: 500,
    });

    // 2. Hero Title
    tl.add('.anim-hero-title', {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
    }, '+=100');

    // 3b. Hero Description
    tl.add('.anim-hero-desc', {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
    }, '+=150');

    // 3c. Hero Buttons
    tl.add('.anim-hero-btn', {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 700,
    }, '+=150');

    // 4. Hero Image zoom-out (runs independently)
    animate('.anim-hero-bg img', {
        scale: [1.08, 1],
        duration: 1200,
        ease: 'outCubic',
        delay: 500,
    });

    // 5. Movie Rows (Trending -> Popular -> Top Rated)
    const rows = document.querySelectorAll('.anim-row-container');

    rows.forEach((row, index) => {
        const title = row.querySelector('.anim-row-title');
        // Animate only the first visible cards to avoid heavy timelines.
        const cards = Array.from(row.querySelectorAll('.anim-movie-card-wrapper')).slice(0, 8);

        const rowDelay = index * 300;

        if (title) {
            tl.add(title, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
            }, `-=${Math.max(0, 700 - rowDelay)}`);
        }

        if (cards.length > 0) {
            tl.add(cards, {
                opacity: [0, 1],
                translateY: [30, 0],
                delay: stagger(40),
                duration: 350,
            }, '-=300');
        }
    });

    // 6. Footer
    tl.add('.anim-footer', {
        opacity: [0, 1],
        duration: 800,
    }, '-=200');
};
