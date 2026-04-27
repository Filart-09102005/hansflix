import { supabase } from "../lib/supabase";

export const getReviews = async (movieId) => {
    try {
        const { data, error } = await supabase
            .from("reviews")
            .select(`
                id,
                movie_id,
                user_id,
                rating,
                comment,
                created_at,
                profiles:user_id (email, raw_user_meta_data)
            `)
            .eq("movie_id", movieId)
            .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Map data to include user info properly
        return data.map(review => ({
            ...review,
            user_email: review.profiles?.email || 'Anonymous',
        }));
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

export const addReview = async (movieId, userId, rating, comment) => {
    try {
        const { data, error } = await supabase
            .from("reviews")
            .insert([
                { movie_id: String(movieId), user_id: userId, rating, comment }
            ])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};
