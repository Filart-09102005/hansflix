import { useState } from "react";
import { useAuthModal } from "../../context/AuthModalContext";
import { resetPassword } from "../../services/auth.service";

export default function ForgotPasswordModal() {
    const { closeModal, openLogin } = useAuthModal();

    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg("Password reset link sent! Check your email inbox.");
        }
        setLoading(false);
    };

    return (
        <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            onClick={closeModal}
        >
            <div 
                className="relative w-full max-w-md bg-[#141414]/95 backdrop-blur-2xl p-10 rounded-2xl border border-white/10 shadow-[0_8px_60px_rgba(0,0,0,0.8)] animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Lock icon */}
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-white tracking-tight text-center">Forgot Password?</h2>
                <p className="text-gray-500 text-sm mb-8 text-center">Enter your email and we'll send you a reset link.</p>
                
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-lg mb-6 text-sm flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3.5 rounded-lg mb-6 text-sm flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-green-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 text-white px-5 py-3.5 rounded-xl outline-none focus:bg-white/10 border border-white/10 focus:border-white/25 transition-all placeholder:text-gray-500 text-sm"
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_25px_rgba(229,9,20,0.35)] text-sm"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    Remember your password?{" "}
                    <button 
                        onClick={openLogin} 
                        className="text-white font-semibold hover:underline"
                    >
                        Back to Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
