import { supabase } from "../utils/supabase";

export const ProductService = {
    saveUserProductHistory: async (userEmail: string, userProduct: any, id: string) => {
        try {
            // Validate input
            if (!userEmail || !userProduct || !id) {
                throw new Error('Missing required parameters');
            }
            if (!userProduct.id) {
                throw new Error('Product must have an id');
            }

            // First update the order ID
            const { error: orderError } = await supabase.from('users')
                .update({ orderid: id })
                .eq('email', userEmail);

            if (orderError) {
                throw new Error(`Failed to update order ID: ${orderError.message}`);
            }

            // Fetch existing user data with history
            const { data: existingUser, error: fetchError } = await supabase.from('users')
                .select('history')
                .eq('email', userEmail)
                .single();
            if (fetchError) {
                throw new Error(`Failed to fetch user history: ${fetchError.message}`);
            }
            // Initialize or parse existing history
            let existingHistory: any[] = [];
            if (existingUser?.history) {
                existingHistory = [...existingUser.history, userProduct];
            }
            else{
                existingHistory = [userProduct];
            }
            const { data, error: updateError } = await supabase.from('users')
                .update({ history: existingHistory })
                .eq('email', userEmail);

            if (updateError) {
                throw new Error(`Failed to update user history: ${updateError.message}`);
            }
            console.log("3️⃣ User product history saved successfully!");
            return data;
        } catch (error) {
            console.error('❌ Error saving user product history:', error);
            throw error;
        }
    },
    getUserProductHistoryProductId: async (userEmail: string, orderId: string) => {
        try {
            const { data: existingOrder } = await supabase.from('users')
                .select('orderid')
                .eq('email', userEmail)
                .single();
            if (existingOrder?.orderid === null) {
                return true;
            }
            if (existingOrder?.orderid === orderId) {
                console.log("⚠️ Order already exists for user:", userEmail, orderId);
                return false;
            }
            else {
                return true;
            }
        } catch (error) {
            console.error('❌ Error getting user product history:', error);
            return false;
        }
    }
}