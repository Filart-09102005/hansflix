import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
    const [modalType, setModalType] = useState(null); // null, 'login', 'register', 'forgot'
    const [onSuccessCallback, setOnSuccessCallback] = useState(null);

    const openLogin = (onSuccess = null) => {
        if (onSuccess) setOnSuccessCallback(() => onSuccess);
        setModalType('login');
    };

    const openRegister = (onSuccess = null) => {
        if (onSuccess) setOnSuccessCallback(() => onSuccess);
        setModalType('register');
    };

    const openForgotPassword = () => {
        setModalType('forgot');
    };

    const closeModal = () => {
        setModalType(null);
        setOnSuccessCallback(null);
    };

    const handleSuccess = () => {
        if (onSuccessCallback) {
            onSuccessCallback();
        }
        closeModal();
    };

    return (
        <AuthModalContext.Provider value={{ 
            modalType, 
            openLogin, 
            openRegister, 
            openForgotPassword,
            closeModal, 
            handleSuccess 
        }}>
            {children}
        </AuthModalContext.Provider>
    );
}

export const useAuthModal = () => useContext(AuthModalContext);
