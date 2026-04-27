import { useState } from "react";
import { useAuthModal } from "../../context/AuthModalContext";
import { signUp, signInWithOAuth } from "../../services/auth.service";

export default function RegisterModal() {
    const { closeModal, openLogin } = useAuthModal();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const { data, error } = await signUp(email, password);

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else if (data?.user?.identities?.length === 0) {
            setErrorMsg("An account with this email already exists.");
            setLoading(false);
        } else {
            setIsSuccess(true);
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        const { error } = await signInWithOAuth(provider);
        if (error) {
            setErrorMsg(error.message);
        }
    };

    if (isSuccess) {
        return (
            <div 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
                onClick={closeModal}
            >
                <div 
                    className="relative w-full max-w-md bg-[#141414]/95 backdrop-blur-2xl p-10 rounded-2xl border border-white/10 shadow-[0_8px_60px_rgba(0,0,0,0.8)] animate-modal-in flex flex-col items-center text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Account Created!</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Your account has been successfully created. Please check your email to verify your account before signing in.
                    </p>
                    <button 
                        onClick={() => openLogin()}
                        className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,9,20,0.35)]"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

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

                <h2 className="text-3xl font-bold mb-2 text-white tracking-tight">Create Account</h2>
                <p className="text-gray-500 text-sm mb-8">Join HansFlix today</p>
                
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-lg mb-6 text-sm flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* OAuth Buttons */}
                <div className="flex flex-col gap-3 mb-6">
                    <button 
                        onClick={() => handleOAuth("google")}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>

                    <button 
                        onClick={() => handleOAuth("github")}
                        className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-[#2f363d] transition-all duration-200 border border-white/10 hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Continue with GitHub
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-gray-500 text-xs uppercase tracking-widest font-medium">or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 text-white px-5 py-3.5 rounded-xl outline-none focus:bg-white/10 border border-white/10 focus:border-white/25 transition-all placeholder:text-gray-500 text-sm"
                        required
                    />
                    
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 text-white px-5 py-3.5 rounded-xl outline-none focus:bg-white/10 border border-white/10 focus:border-white/25 transition-all placeholder:text-gray-500 text-sm"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 text-white px-5 py-3.5 rounded-xl outline-none focus:bg-white/10 border border-white/10 focus:border-white/25 transition-all placeholder:text-gray-500 text-sm"
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl mt-2 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_25px_rgba(229,9,20,0.35)] text-sm"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account?{" "}
                    <button 
                        onClick={() => openLogin()} 
                        className="text-white font-semibold hover:underline"
                    >
                        Sign in now
                    </button>
                </div>
            </div>
        </div>
    );
}
