import { createContext, useContext, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "hansflix-language";

const DICTIONARY = {
    en: {
        languageLabel: "Language",
        home: "Home",
        myList: "My List",
        account: "Account",
        browse: "Browse",
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        menu: "Menu",
        contact: "Questions? Contact us.",
        faq: "FAQ",
        helpCenter: "Help Center",
        termsOfUse: "Terms of Use",
        privacy: "Privacy",
        cookiePreferences: "Cookie Preferences",
        corporateInformation: "Corporate Information",
        backToHome: "Back to Home",
        infoIntro: "Find important information about HansFlix services, account usage, and platform policies.",
        faqDescription: "Answers to common questions about billing, accounts, and playback.",
        helpCenterDescription: "Get support for account access, streaming quality, and troubleshooting.",
        termsDescription: "Review the rules and conditions that apply when using HansFlix.",
        privacyDescription: "Understand how we collect, use, and protect your personal data.",
        cookieDescription: "Manage cookie preferences and learn how cookies improve your experience.",
        corporateDescription: "Learn about HansFlix company details, compliance, and business information.",
        allRightsReserved: "All rights reserved.",
        tmdbDisclaimer: "This product uses the TMDB API but is not endorsed or certified by TMDB.",
    },
    es: {
        languageLabel: "Idioma",
        home: "Inicio",
        myList: "Mi Lista",
        account: "Cuenta",
        browse: "Explorar",
        signIn: "Iniciar sesion",
        signUp: "Registrarse",
        signOut: "Cerrar sesion",
        menu: "Menu",
        contact: "Preguntas? Contactanos.",
        faq: "Preguntas frecuentes",
        helpCenter: "Centro de ayuda",
        termsOfUse: "Terminos de uso",
        privacy: "Privacidad",
        cookiePreferences: "Preferencias de cookies",
        corporateInformation: "Informacion corporativa",
        backToHome: "Volver al inicio",
        infoIntro: "Encuentra informacion importante sobre los servicios, el uso de la cuenta y las politicas de HansFlix.",
        faqDescription: "Respuestas a preguntas comunes sobre facturacion, cuentas y reproduccion.",
        helpCenterDescription: "Obtenga soporte para acceso a la cuenta, calidad de reproduccion y solucion de problemas.",
        termsDescription: "Revise las reglas y condiciones que aplican al usar HansFlix.",
        privacyDescription: "Comprenda como recopilamos, usamos y protegemos sus datos personales.",
        cookieDescription: "Administre preferencias de cookies y aprenda como mejoran su experiencia.",
        corporateDescription: "Conozca detalles de la empresa HansFlix, cumplimiento e informacion corporativa.",
        allRightsReserved: "Todos los derechos reservados.",
        tmdbDisclaimer: "Este producto usa la API de TMDB pero no esta respaldado ni certificado por TMDB.",
    },
    tl: {
        languageLabel: "Wika",
        home: "Home",
        myList: "Aking Listahan",
        account: "Account",
        browse: "Mag-browse",
        signIn: "Mag-sign in",
        signUp: "Mag-sign up",
        signOut: "Mag-sign out",
        menu: "Menu",
        contact: "May tanong? Makipag-ugnayan sa amin.",
        faq: "FAQ",
        helpCenter: "Help Center",
        termsOfUse: "Mga Tuntunin ng Paggamit",
        privacy: "Privacy",
        cookiePreferences: "Cookie Preferences",
        corporateInformation: "Corporate Information",
        backToHome: "Bumalik sa Home",
        infoIntro: "Hanapin ang mahahalagang impormasyon tungkol sa serbisyo, paggamit ng account, at mga polisiya ng HansFlix.",
        faqDescription: "Mga sagot sa karaniwang tanong tungkol sa billing, account, at playback.",
        helpCenterDescription: "Kumuha ng suporta para sa account access, streaming quality, at troubleshooting.",
        termsDescription: "Basahin ang mga tuntunin at kundisyon sa paggamit ng HansFlix.",
        privacyDescription: "Alamin kung paano namin kinokolekta, ginagamit, at pinoprotektahan ang personal na data.",
        cookieDescription: "Pamahalaan ang cookie preferences at alamin kung paano nito pinapaganda ang experience.",
        corporateDescription: "Alamin ang detalye ng kumpanya ng HansFlix, compliance, at corporate information.",
        allRightsReserved: "Lahat ng karapatan ay nakalaan.",
        tmdbDisclaimer: "Gumagamit ang produktong ito ng TMDB API ngunit hindi ito ineendorso o sinertipikahan ng TMDB.",
    },
};

export const LANGUAGE_OPTIONS = [
    { value: "en", label: "English" },
    { value: "tl", label: "Tagalog" },
    { value: "es", label: "Spanish" },
];

const LanguageContext = createContext(null);

const getInitialLanguage = () => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && DICTIONARY[saved]) {
        return saved;
    }
    return "en";
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(getInitialLanguage);

    const changeLanguage = (value) => {
        if (!DICTIONARY[value]) return;
        setLanguage(value);
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, value);
    };

    const value = useMemo(() => {
        const t = DICTIONARY[language] || DICTIONARY.en;
        return {
            language,
            changeLanguage,
            t,
            options: LANGUAGE_OPTIONS,
        };
    }, [language]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguageContext must be used within a LanguageProvider.");
    }
    return context;
}
