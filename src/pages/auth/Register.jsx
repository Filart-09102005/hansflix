import { useState, useEffect } from "react";
import { signUp } from "../../services/auth.service";
import { getFeaturedMovie } from "../../services/movie.service";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [bgImage, setBgImage] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const data = await getFeaturedMovie();
            if (data) setBgImage(data.backdrop);
        };
        fetchMovie();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match!");
            return;
        }

        setLoading(true);
        const { error } = await signUp(email, password);

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            alert("Check your email for confirmation!");
            navigate("/login");
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center px-4 pt-16 pb-12">
            
            {/* Background Image matching the Home Page Hero */}
            <div className="absolute inset-0 w-full h-full z-[-1] bg-background">
                {bgImage && (
                    <img 
                        src={bgImage} 
                        alt="Background" 
                        className="w-full h-full object-cover animate-fade-in"
                    />
                )}
                <div className="absolute inset-0 bg-black/60 sm:bg-black/80 backdrop-blur-sm"></div>
            </div>

            <div className="relative w-full max-w-md bg-card/95 sm:backdrop-blur-2xl p-10 rounded-2xl border border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in-up">
                <h1 className="text-foreground text-3xl font-bold mb-8 tracking-tight">Create Account</h1>
                
                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 text-sm flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background/40 text-foreground px-5 py-4 rounded-xl outline-none focus:bg-background/60 border border-border focus:border-white/20 transition-all placeholder:text-muted"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background/40 text-foreground px-5 py-4 rounded-xl outline-none focus:bg-background/60 border border-border focus:border-white/20 transition-all placeholder:text-muted"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-background/40 text-foreground px-5 py-4 rounded-xl outline-none focus:bg-background/60 border border-border focus:border-white/20 transition-all placeholder:text-muted"
                        required
                    />

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-red-600 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:-translate-y-0.5"
                    >
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-center text-muted text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-foreground font-semibold hover:underline">
                        Sign in now
                    </Link>
                </div>
            </div>
        </div>
    );
}