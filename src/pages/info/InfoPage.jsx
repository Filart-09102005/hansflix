import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import useLanguage from "../../hooks/useLanguage";

const getInfoConfig = (pathname, t) => {
    const map = {
        "/faq": { title: t.faq, description: t.faqDescription },
        "/help-center": { title: t.helpCenter, description: t.helpCenterDescription },
        "/terms-of-use": { title: t.termsOfUse, description: t.termsDescription },
        "/privacy": { title: t.privacy, description: t.privacyDescription },
        "/cookie-preferences": { title: t.cookiePreferences, description: t.cookieDescription },
        "/corporate-information": { title: t.corporateInformation, description: t.corporateDescription },
    };

    return map[pathname] || { title: t.helpCenter, description: t.infoIntro };
};

export default function InfoPage() {
    const { t } = useLanguage();
    const location = useLocation();
    const config = getInfoConfig(location.pathname, t);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const faqItems = useMemo(
        () => [
            {
                question: "How do I add movies to My List?",
                answer:
                    "Open any movie card and click the Watchlist button. If you are not signed in, HansFlix will prompt you to log in first.",
            },
            {
                question: "Why is a movie not loading?",
                answer:
                    "Check your internet connection, refresh the page, and try again. If the issue continues, sign out and sign back in to refresh your session.",
            },
            {
                question: "Can I change my account email or password?",
                answer:
                    "You can update your password through account recovery. Email changes are managed through your authentication provider settings.",
            },
            {
                question: "Why is playback quality not smooth?",
                answer:
                    "For best results, use a stable connection and close other heavy apps. HansFlix automatically adapts assets for better performance.",
            },
        ],
        []
    );

    const renderContent = () => {
        if (location.pathname === "/faq") {
            return (
                <div className="space-y-3 mb-10">
                    {faqItems.map((item, index) => {
                        const isOpen = openFaqIndex === index;
                        return (
                            <div key={item.question} className="border border-white/10 rounded-xl bg-white/[0.03] overflow-hidden">
                                <button
                                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                                    className="w-full flex items-center justify-between px-4 md:px-5 py-4 text-left hover:bg-white/[0.04] transition-colors"
                                >
                                    <span className="font-medium text-foreground">{item.question}</span>
                                    <span className="text-muted text-xl leading-none">{isOpen ? "-" : "+"}</span>
                                </button>
                                {isOpen && <div className="px-4 md:px-5 pb-4 text-muted leading-relaxed">{item.answer}</div>}
                            </div>
                        );
                    })}
                </div>
            );
        }

        if (location.pathname === "/help-center") {
            return (
                <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Support Topics</h2>
                    <ul className="space-y-2 text-muted">
                        <li>Account access and sign-in issues</li>
                        <li>Watchlist synchronization</li>
                        <li>Streaming performance and buffering</li>
                        <li>Language and accessibility settings</li>
                    </ul>
                </div>
            );
        }

        if (location.pathname === "/terms-of-use") {
            return (
                <div className="mb-10 space-y-4 text-muted leading-relaxed">
                    <p>By using HansFlix, you agree to comply with platform rules, respect intellectual property, and avoid misuse of account features.</p>
                    <p>Service availability may vary by region and can change without prior notice as we improve platform stability and content delivery.</p>
                </div>
            );
        }

        if (location.pathname === "/privacy") {
            return (
                <div className="mb-10 space-y-4 text-muted leading-relaxed">
                    <p>HansFlix stores limited account and usage data to support authentication, watchlist features, and product improvements.</p>
                    <p>We do not sell personal data. Security controls are continuously updated to keep account information protected.</p>
                </div>
            );
        }

        if (location.pathname === "/cookie-preferences") {
            return (
                <div className="mb-10 space-y-4 text-muted leading-relaxed">
                    <p>Cookies help maintain sessions, remember preferences, and improve performance diagnostics across the app.</p>
                    <p>You can modify cookie settings in your browser at any time. Disabling cookies may impact some features.</p>
                </div>
            );
        }

        if (location.pathname === "/corporate-information") {
            return (
                <div className="mb-10 space-y-4 text-muted leading-relaxed">
                    <p>HansFlix is a streaming-style web experience built with modern frontend technologies and TMDB-powered movie metadata.</p>
                    <p>For business inquiries, compliance questions, or partnership requests, please contact our support team through Help Center.</p>
                </div>
            );
        }

        return <p className="text-muted leading-relaxed mb-10">{t.infoIntro}</p>;
    };

    return (
        <section className="min-h-screen pt-28 px-6 md:px-12 pb-20 text-foreground bg-background transition-colors">
            <div className="max-w-4xl mx-auto">
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-4">HansFlix</p>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">{config.title}</h1>
                <p className="text-muted leading-relaxed text-lg mb-8">{config.description}</p>
                {renderContent()}

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
                >
                    {t.backToHome}
                </Link>
            </div>
        </section>
    );
}
