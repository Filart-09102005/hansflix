import { supabase } from "../lib/supabase";

// REGISTER
export const signUp = async (email, password) => {
    return await supabase.auth.signUp({
        email,
        password,
    });
};

// LOGIN
export const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
};

// OAUTH LOGIN (Google / GitHub)
export const signInWithOAuth = async (provider) => {
    return await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: window.location.origin,
        },
    });
};

// FORGOT PASSWORD
export const resetPassword = async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
    });
};

// UPDATE PASSWORD (after reset link)
export const updatePassword = async (newPassword) => {
    return await supabase.auth.updateUser({
        password: newPassword,
    });
};

// LOGOUT
export const signOut = async () => {
    return await supabase.auth.signOut();
};