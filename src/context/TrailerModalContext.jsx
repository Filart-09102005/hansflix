import { createContext, useContext, useState, useCallback } from "react";
import TrailerModal from "../components/movie/TrailerModal";

const TrailerModalContext = createContext();

export const useTrailerModal = () => useContext(TrailerModalContext);

export const TrailerModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [videoKey, setVideoKey] = useState(null);

    const openTrailer = useCallback((key) => {
        setVideoKey(key);
        setIsOpen(true);
    }, []);

    const closeTrailer = useCallback(() => {
        setIsOpen(false);
        setVideoKey(null);
    }, []);

    return (
        <TrailerModalContext.Provider value={{ openTrailer, closeTrailer }}>
            {children}
            <TrailerModal isOpen={isOpen} onClose={closeTrailer} videoKey={videoKey} />
        </TrailerModalContext.Provider>
    );
};
