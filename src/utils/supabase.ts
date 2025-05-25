import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseUserKey = process.env.SUPABASE_USER_KEY!;
const supabaseDBPassword = `revenger0412!@#$%`;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to verify connection and create table
export async function SupabaseConnection() {
    let client: Client | null = null;
    try {
        client = new Client({
            user: "postgres." + supabaseUserKey,
            host: "aws-0-us-east-2.pooler.supabase.com",
            database: "postgres",
            password: supabaseDBPassword,
            port: 6543,
        });

        await client.connect();
        console.log('✅ Connected to the database');
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email text UNIQUE NOT NULL,
                walletAddress text NOT NULL,
                privateKey text NOT NULL,
                history jsonb ,
                orderid int8,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await client.query(createTableQuery);
        console.log('✅ Database setup completed successfully');
    } catch (error: any) {
        console.error('❌ Database connection error:', {
            message: error.message,
            code: error.code,
            detail: error.detail
        });
        throw new Error(`Database setup failed: ${error.message}`);
    }
}