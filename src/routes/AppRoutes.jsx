import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";
import Watchlist from "../pages/watchlist/Watchlist";
import UpdatePassword from "../pages/auth/UpdatePassword";
import InfoPage from "../pages/info/InfoPage";
import MovieDetail from "../pages/info/MovieDetail";
import SearchPage from "../pages/search/SearchPage";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import ScrollToTop from "../components/layout/ScrollToTop";
import { AuthProvider } from "../context/AuthContext";
import { AuthModalProvider } from "../context/AuthModalContext";
import { WatchlistProvider } from "../context/WatchlistContext";
import { LanguageProvider } from "../context/LanguageContext";

import { ThemeProvider } from "../context/ThemeContext";
import { TrailerModalProvider } from "../context/TrailerModalContext";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full h-full"
            >
                <Routes location={location} key={location.pathname}>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/movie/:id" element={<MovieDetail />} />
                    {/* Password Reset (from email link) */}
                    <Route path="/update-password" element={<UpdatePassword />} />
                    <Route path="/faq" element={<InfoPage />} />
                    <Route path="/help-center" element={<InfoPage />} />
                    <Route path="/terms-of-use" element={<InfoPage />} />
                    <Route path="/privacy" element={<InfoPage />} />
                    <Route path="/cookie-preferences" element={<InfoPage />} />
                    <Route path="/corporate-information" element={<InfoPage />} />

                    {/* Protected */}
                    <Route
                        path="/watchlist"
                        element={
                            <ProtectedRoute>
                                <Watchlist />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <AuthProvider>
                <LanguageProvider>
                    <AuthModalProvider>
                        <WatchlistProvider>
                            <ThemeProvider>
                                <TrailerModalProvider>
                                    <Layout>
                                        <AnimatedRoutes />
                                    </Layout>
                                </TrailerModalProvider>
                            </ThemeProvider>
                        </WatchlistProvider>
                    </AuthModalProvider>
                </LanguageProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}