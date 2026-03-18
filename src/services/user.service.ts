import { supabase } from "../utils/supabase";

const UserService = {
    getAllUsers: async () => {
        try {
            const { data, error } = await supabase.from('users').select('id, email, walletaddress, updated_at');
            return data;
        } catch (error) {
            console.error('❌ Error getting all users:', error);
            return null;
        }
    },
    getUserByEmail: async (email: string) => {
        try {
            const { data, error } = await supabase.from('users').select('id, email, walletaddress, history, updated_at').eq('email', email);
            if (error) {
                console.error('❌ Error getting user by email:', error);
                return null;
            }
            return data;
        } catch (error) {
            console.error('❌ Error getting user by email:', error);
            return null;
        }
    },
    addUser: async (email: string, walletaddress: string) => {
        try {
            const { data, error } = await supabase.from('users').insert({ email, walletaddress });
            if (error) {
                console.error('❌ Error adding user:', error);
                return null;
            }
            return "success";
        } catch (error) {
            console.error('❌ Error adding user:', error);
            return null;
        }
    },
    updateUser: async (id: string) => {
        try {
            const { data, error } = await supabase.from('users').update({ updated_at: new Date().toISOString() }).eq('orderid', id);
            if(error){
                return false
            }
            const { data: userData, error: userError } = await supabase.from('users').select('id, email, walletaddress, updated_at').eq('orderid', id);
            if (userError) {
                return false;
            }
            return userData;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            return null;
        }
    },
    getUserWallet: async (id: string) => {
        try {
            const { data, error } = await supabase.from('users').select('walletaddress').eq('orderid', id);
            return data;
        } catch (error) {
            console.error('❌ Error fetching user wallet:', error);
            return null;
        }
    }
}
export default UserService;
