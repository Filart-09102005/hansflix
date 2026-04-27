import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useWatchlist from "../../hooks/useWatchlist";
import SignOutModal from "../../components/auth/SignOutModal";

export default function Profile() {
    const { user } = useAuth();
    const { watchlist } = useWatchlist();
    const [showSignOut, setShowSignOut] = useState(false);

    const memberSince = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : new Date().getFullYear();

    return (
        <div className="min-h-screen pt-28 px-6 md:px-16 text-foreground bg-background transition-colors pb-20 relative">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight">Account</h1>
                
                {/* Profile Card */}
                <div className="mb-10 bg-card p-8 rounded-2xl border border-border shadow-lg">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-indigo-500/20 border border-white/10 text-white">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-1">User Profile</p>
                            <h2 className="text-2xl font-bold mb-1 text-foreground">{user?.email}</h2>
                            <p className="text-muted text-sm">Member since {memberSince}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-card border border-border rounded-xl p-5">
                        <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">Watchlist</p>
                        <p className="text-3xl font-extrabold text-foreground">{watchlist.length}</p>
                        <p className="text-muted text-sm mt-1">saved titles</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-5">
                        <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">Plan</p>
                        <p className="text-3xl font-extrabold text-foreground">Free</p>
                        <p className="text-muted text-sm mt-1">standard access</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-5">
                        <p className="text-muted text-xs uppercase tracking-wider font-semibold mb-1">Provider</p>
                        <p className="text-3xl font-extrabold text-foreground capitalize">{user?.app_metadata?.provider || "email"}</p>
                        <p className="text-muted text-sm mt-1">auth method</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-card border border-border rounded-xl p-6 mb-10">
                    <h3 className="text-lg font-bold mb-4 text-foreground">Account Settings</h3>
                    <div className="flex flex-col gap-3">
                        <Link 
                            to="/watchlist"
                            className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-secondary transition-all border border-border group"
                        >
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span className="font-medium text-sm text-foreground">My Watchlist</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>

                        <button 
                            onClick={() => setShowSignOut(true)}
                            className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-red-500/10 transition-all border border-border hover:border-red-500/20 group text-left w-full mt-2"
                        >
                            <div className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium text-sm text-foreground group-hover:text-red-400 transition-colors">Sign Out</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {showSignOut && <SignOutModal onClose={() => setShowSignOut(false)} />}
        </div>
    );
}
