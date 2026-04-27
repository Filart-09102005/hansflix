import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../services/auth.service";

export default function UpdatePassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const { error } = await updatePassword(password);

        if (error) {
            setErrorMsg(error.message);
        } else {
            setSuccessMsg("Password updated successfully! Redirecting...");
            setTimeout(() => navigate("/"), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background transition-colors flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md bg-card/95 backdrop-blur-2xl p-10 rounded-2xl border border-border shadow-2xl">
                
                {/* Lock icon */}
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold mb-2 text-foreground tracking-tight text-center">Set New Password</h2>
                <p className="text-muted text-sm mb-8 text-center">Enter your new password below.</p>
                
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
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background text-foreground px-5 py-3.5 rounded-xl outline-none focus:bg-background/80 border border-border focus:border-white/25 transition-all placeholder:text-muted text-sm"
                        required
                    />
                    
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background text-foreground px-5 py-3.5 rounded-xl outline-none focus:bg-background/80 border border-border focus:border-white/25 transition-all placeholder:text-muted text-sm"
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl mt-2 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_25px_rgba(229,9,20,0.35)] text-sm"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
