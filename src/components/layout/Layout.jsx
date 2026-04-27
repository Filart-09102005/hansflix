import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import ForgotPasswordModal from "../auth/ForgotPasswordModal";
import { useAuthModal } from "../../context/AuthModalContext";

export default function Layout({ children }) {
    const { modalType } = useAuthModal();

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col anim-app-bg transition-colors">
            <Navbar />
            
            <main className="flex-grow pb-16">
                {children}
            </main>
            
            <Footer />
            
            {modalType === 'login' && <LoginModal />}
            {modalType === 'register' && <RegisterModal />}
            {modalType === 'forgot' && <ForgotPasswordModal />}
        </div>
    );
}
