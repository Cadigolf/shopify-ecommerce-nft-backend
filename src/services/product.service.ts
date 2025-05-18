import { supabase } from "../utils/supabase";

export const ProductService = {
    saveUserProductHistory: async (userEmail: string, userProduct: any) => {
        try {
           const { data: existingUser } = await supabase.from('users').select('history').eq('email', userEmail).single();
            
            const newHistory = existingUser?.history ? [...existingUser.history, userProduct] : [userProduct];
            
            const { data, error } = await supabase.from('users')
                .update({ history: newHistory })
                .eq('email', userEmail);
            if (error) {
                console.error('❌ Error saving user product history:', error);
                return null;
            }
            console.log("4️⃣ User product history saved successfully!");
            return data;
        } catch (error) {
            console.error('❌ Error saving user product history:', error);
            return null;
        }
    }
}