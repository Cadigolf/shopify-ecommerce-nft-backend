import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

interface Product {
    id: number;
    title: string;
    body_html: string | null;
    vendor: string;
    product_type: string;
    created_at: string;
    handle: string;
    updated_at: string;
    published_at: string;
    template_suffix: string | null;
    published_scope: string;
    tags: string;
    status: string;
    admin_graphql_api_id: string;
    variants: any[];
    options: any[];
    images: any[];
    image: any;
}

export const getAllProducts = async (state: string = 'all', title: string = ''): Promise<any> => {
    try {
        const shopName = process.env.SHOPIFY_SHOP_NAME;
        const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

        if (!shopName || !accessToken) {
            throw new Error('Missing Shopify credentials in environment variables');
        }

        const response = await fetch(
            `https://${shopName}.myshopify.com/admin/api/2025-04/products.json`,
            {
                headers: {
                    'X-Shopify-Access-Token': accessToken,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data: any = await response.json();
        if (state === 'all') {  
            return data.products;
        }
        else {
            return data.products.find((product: any) => product.title === title)?.images[0].src;
        }

    } catch (error) {
        console.error('❌ Error fetching products from Shopify:', error);
        throw error;
    }
};
