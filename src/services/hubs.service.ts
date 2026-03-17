import { supabase } from "../utils/supabase";

const HubsService = {
    getUserByEmail: async (email: string) => {
        try {
            const { data, error } = await supabase.from('users').select('id, email, walletaddress, updated_at').eq('email', email);
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
                return false;
            }
            const { data: userData, error: userError } = await supabase.from('users').select('id, email, walletaddress, updated_at').eq('email', email);
            if (userError) {
                return false;
            }
            return userData;
        } catch (error) {
            console.error('❌ Error adding user:', error);
            return null;
        }
    },
    updateUser: async (email: string) => {
        try {
            const { data, error } = await supabase.from('users').update({ updated_at: new Date().toISOString() }).eq('email', email);
            if (error) {
                return false
            }
            const { data: userData, error: userError } = await supabase.from('users').select('id, email, walletaddress, updated_at').eq('email', email);
            if (userError) {
                return false;
            }
            return userData;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            return null;
        }
    },
    getUserByEmailAndWalletAddress: async (email: string) => {
        try {
            const { data, error } = await supabase.from('users').select('walletaddress').eq('email', email);
            if (error) {
                return false;
            }
            return data;
        } catch (error) {
            console.error('❌ Error getting user by email and wallet address:', error);
            return null;
        }
    },
    updateUserProfileSetup: async (
        email: string,
        username: string,
        country: string,
        interests: any,
        emailCommunications: boolean,
        hubsStakingInterest: boolean,
        avatarUrl?: string
    ) => {
        try {
            // Profile fields (username, country, interests, avatar) are managed by Privy
            const { data, error } = await supabase
                .from('users')
                .update({ updated_at: new Date().toISOString() })
                .eq('email', email);

            if (error) {
                console.error('❌ Error updating user profile setup:', error);
                return false;
            }

            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, email, walletaddress, updated_at')
                .eq('email', email);

            if (userError) {
                console.error('❌ Error getting updated user data:', userError);
                return false;
            }

            return userData;
        } catch (error) {
            console.error('❌ Error updating user profile setup:', error);
            return null;
        }
    },
    updateUserProfile: async (email: string, username: string, country: string, fullname: string) => {
        try {
            // Profile fields (username, country, fullname) are managed by Privy
            const { data, error } = await supabase.from('users').update({ updated_at: new Date().toISOString() }).eq('email', email);
            if (error) {
                return false;
            }
            const { data: userData, error: userError } = await supabase.from('users').select('id, email, walletaddress, updated_at').eq('email', email);
            if (userError) {
                return false;
            }
            return userData;
        } catch (error) {
            console.error('❌ Error updating user profile:', error);
            return null;
        }
    }
}
export default HubsService;
