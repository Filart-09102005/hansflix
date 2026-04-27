import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../services/auth.service";

export default function SignOutModal({ onClose }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await signOut();
        onClose();
        navigate("/");
    };

    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-sm bg-[#141414]/95 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 shadow-[0_8px_60px_rgba(0,0,0,0.8)] animate-modal-in text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Sign Out?</h2>
                <p className="text-gray-400 text-sm mb-8">Are you sure you want to sign out of your HansFlix account?</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/10 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50 text-sm hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                    >
                        {loading ? "Signing out..." : "Yes, Sign Out"}
                    </button>
                </div>
            </div>
        </div>
    );
}
