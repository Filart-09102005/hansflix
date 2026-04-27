import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useAuthModal } from "../../context/AuthModalContext";
import SignOutModal from "../auth/SignOutModal";
import useLanguage from "../../hooks/useLanguage";
import SearchBar from "../search/SearchBar";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
    const { user } = useAuth();
    const { openLogin, openRegister } = useAuthModal();
    const { t, language, changeLanguage, options } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [showSignOut, setShowSignOut] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();
    const profileMenuRef = useRef(null);
    const lastScrollY = useRef(0);

    const getLinkClass = useCallback((path) => {
        const isActive = location.pathname === path;
        return `relative transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-[3px] after:rounded-full after:bottom-[-6px] after:left-0 after:bg-primary after:origin-left after:transition-all after:duration-300 hover:text-white hover:after:scale-x-100 hover:after:shadow-[0_0_8px_rgba(229,9,20,0.5)] ${isActive ? 'text-white after:scale-x-100 after:shadow-[0_0_10px_rgba(229,9,20,0.6)]' : 'text-gray-300 after:scale-x-0'}`;
    }, [location.pathname]);

    const profileInitial = useMemo(() => user?.email?.charAt(0).toUpperCase(), [user?.email]);

    useEffect(() => {
        let rafId = 0;
        const handleScroll = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
                const currentY = window.scrollY;
                const scrollingDown = currentY > lastScrollY.current;

                setIsScrolled(currentY > 10);
                // Only hide if scrolled past 80px and going down
                setIsHidden(scrollingDown && currentY > 80);

                lastScrollY.current = currentY;
                rafId = 0;
            });
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    useEffect(() => {
        setShowMobileMenu(false);
        setShowProfileMenu(false);
    }, [location.pathname]);

    return (
        <>
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 anim-navbar ${isHidden ? '-translate-y-full' : 'translate-y-0'} ${isScrolled ? 'bg-black/85 backdrop-blur-xl py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-4'}`}>
                <div className="mx-auto max-w-7xl flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-6 md:gap-10">
                        <Link to="/" className="text-primary text-2xl md:text-3xl font-black tracking-tighter hover:scale-[1.02] transition-transform duration-200 drop-shadow-md whitespace-nowrap">
                            HANSFLIX
                        </Link>
                        <nav className="hidden md:flex gap-6 text-sm font-medium">
                            <Link to="/" className={getLinkClass('/')}>
                                {t.home}
                            </Link>
                            {user && (
                                <>
                                    <Link to="/watchlist" className={getLinkClass('/watchlist')}>
                                        {t.myList}
                                    </Link>
                                    <Link to="/profile" className={getLinkClass('/profile')}>
                                        {t.account}
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {/* Search bar */}
                        <SearchBar variant="desktop" />

                        <button
                            onClick={toggleTheme}
                            className="text-white hover:text-primary transition-colors p-1"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setShowProfileMenu((prev) => !prev)}
                                    className="w-9 h-9 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 border border-white/10 text-sm font-bold"
                                    aria-expanded={showProfileMenu}
                                    aria-label={t.menu}
                                >
                                    {profileInitial}
                                </button>
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-3 w-44 rounded-xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden">
                                        <Link to="/profile" className="block px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition-colors">
                                            {t.account}
                                        </Link>
                                        <Link to="/watchlist" className="block px-4 py-3 text-sm text-gray-200 hover:bg-white/5 transition-colors">
                                            {t.myList}
                                        </Link>
                                        <button
                                            onClick={() => setShowSignOut(true)}
                                            className="w-full text-left px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 transition-colors"
                                        >
                                            {t.signOut}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => openLogin()}
                                    className="text-white font-semibold hover:text-gray-300 transition-colors"
                                >
                                    {t.signIn}
                                </button>
                                <button
                                    onClick={() => openRegister()}
                                    className="bg-primary text-white px-5 py-2 rounded font-semibold hover:bg-red-700 hover:shadow-lg hover:shadow-red-900/50 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {t.signUp}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="text-white p-1"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                        <button
                            className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-white/15 bg-black/40"
                            onClick={() => setShowMobileMenu((prev) => !prev)}
                            aria-label={t.menu}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {showMobileMenu && (
                    <div className="md:hidden border-t border-white/10 bg-[#101010]/95 backdrop-blur px-4 py-4 space-y-3">
                        <SearchBar variant="mobile" />
                        <Link to="/" className="block text-gray-100 py-2">{t.home}</Link>
                        {user && (
                            <>
                                <Link to="/watchlist" className="block text-gray-100 py-2">{t.myList}</Link>
                                <Link to="/profile" className="block text-gray-100 py-2">{t.account}</Link>
                            </>
                        )}
                        <div className="pt-1">
                            <label className="text-xs text-gray-400 mb-1 block" htmlFor="language-mobile">{t.languageLabel}</label>
                            <select
                                id="language-mobile"
                                value={language}
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="w-full bg-black border border-white/20 text-gray-100 py-2 px-3 rounded-md"
                            >
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {!user ? (
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => openLogin()} className="flex-1 border border-white/20 py-2 rounded-md text-sm">{t.signIn}</button>
                                <button onClick={() => openRegister()} className="flex-1 bg-primary py-2 rounded-md text-sm">{t.signUp}</button>
                            </div>
                        ) : (
                            <button onClick={() => setShowSignOut(true)} className="w-full bg-red-500/10 text-red-300 border border-red-500/25 py-2 rounded-md text-sm">
                                {t.signOut}
                            </button>
                        )}
                    </div>
                )}
            </header>

            {showSignOut && <SignOutModal onClose={() => setShowSignOut(false)} />}
        </>
    );
}
