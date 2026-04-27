import { supabase } from "../lib/supabase";

export const getUserWatchlist = async (userId) => {
    if (!userId) return [];
    const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    
    if (error) {
        console.error("Error fetching watchlist:", error);
        return [];
    }
    return data || [];
};

export const isInWatchlist = async (userId, movieId) => {
    if (!userId || !movieId) return false;
    const { data, error } = await supabase
        .from("watchlist")
        .select("id")
        .eq("user_id", userId)
        .eq("movie_id", String(movieId))
        .maybeSingle();
    
    if (error) return false;
    return !!data;
};

export const addToWatchlist = async (userId, movie) => {
    // Check for duplicates first
    const exists = await isInWatchlist(userId, movie.id);
    if (exists) {
        return { error: { message: "Already in watchlist" }, duplicate: true };
    }

    const { data, error } = await supabase
        .from("watchlist")
        .insert([
            {
                user_id: userId,
                movie_id: String(movie.id),
                title: movie.title,
                poster_path: movie.poster,
            }
        ])
        .select("*")
        .single();
    
    if (error) {
        console.error("Error adding to watchlist:", error);
        return { error };
    }
    return { success: true, data };
};

export const removeFromWatchlist = async (userId, movieId) => {
    const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", String(movieId));
    
    if (error) {
        console.error("Error removing from watchlist:", error);
        return { error };
    }
    return { success: true };
};
