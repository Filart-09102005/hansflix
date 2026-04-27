import useLanguage from "../../hooks/useLanguage";
import { Link } from "react-router-dom";

export default function Footer() {
    const { t, language, changeLanguage, options } = useLanguage();

    const footerLinks = [
        { label: t.faq, path: "/faq" },
        { label: t.helpCenter, path: "/help-center" },
        { label: t.termsOfUse, path: "/terms-of-use" },
        { label: t.privacy, path: "/privacy" },
        { label: t.cookiePreferences, path: "/cookie-preferences" },
        { label: t.corporateInformation, path: "/corporate-information" },
    ];

    return (
        <footer className="bg-[#0b0b0b] text-[#9b9b9b] py-14 px-4 md:px-8 border-t border-white/10 mt-auto anim-footer">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link to="/help-center" className="text-[#b3b3b3] hover:text-white transition-colors text-sm md:text-base">
                        {t.contact}
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 mb-10 text-sm">
                    {footerLinks.map((item) => (
                        <Link key={item.path} to={item.path} className="hover:text-white transition-colors duration-200 w-max">
                            {item.label}
                        </Link>
                    ))}
                </div>
                
                <div className="flex flex-col gap-4">
                    <div className="relative inline-block w-max">
                        <label htmlFor="language-footer" className="sr-only">
                            {t.languageLabel}
                        </label>
                        <select
                            id="language-footer"
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="appearance-none bg-black border border-[#333] text-[#bfbfbf] py-2 pl-4 pr-10 rounded-md focus:outline-none focus:border-white transition-colors cursor-pointer text-sm"
                        >
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#737373]">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs mt-2 font-medium text-[#8f8f8f]">© 2026 HansFlix, Inc. {t.allRightsReserved}</p>
                    <p className="text-xs mt-1 text-[#595959] max-w-3xl">
                        {t.tmdbDisclaimer}
                    </p>
                </div>
            </div>
        </footer>
    );
}
