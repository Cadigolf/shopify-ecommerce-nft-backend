import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import router from "./router";
// import { SupabaseConnection } from './utils/supabase';
import cors from 'cors';
import { buyProductController } from './controller/nft.controller';
import { ProductService } from './services/product.service';
import { getAllProducts } from './utils/getAllproduct';

const app = express();
const port = process.env.PORT || 1001;
const corsOptions = {
  origin: [
    'https://shopify-ecommerce-nft-user-frontend-git-stand-up-0d18eb-hubs-ai.vercel.app',
    'https://shopify-ecommerce-nft-merchant-frontend-git-stan-e1b2cc-hubs-ai.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'FETCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

function verifyShopifyWebhook(req: Request): boolean {
  const hmac = req.headers['x-shopify-hmac-sha256'] as string;
  if (!hmac) return false;

  const rawBody = (req as any).rawBody;
  if (!rawBody) return false;

  const digest = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('base64');

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
}

// In-memory lock: prevents duplicate processing when Shopify fires the same webhook
// more than once concurrently (before the first request writes orderid to DB).
// The DB check in getUserProductHistoryProductId handles server-restart scenarios.
const processingOrders = new Set<string>();

// Webhook route must be registered before global body parsers to capture raw body
app.post(
  '/webhooks/orders/paid',
  express.json({
    verify: (req: any, _res, buf) => { req.rawBody = buf; }
  }),
  async (req: Request, res: Response): Promise<void> => {
    if (!verifyShopifyWebhook(req)) {
      res.status(401).json({ error: 'Invalid webhook signature' });
      return;
    }
    try {
      res.status(200).json({ message: 'Webhook received' });
      console.log("--------------------------------  Order received  --------------------------------");

      const orderId = String(req.body.id);
      if (processingOrders.has(orderId)) {
        console.log(`⚠️ Duplicate webhook for order ${orderId} — already processing, skipping`);
        return;
      }
      processingOrders.add(orderId);

      const result = await ProductService.getUserProductHistoryProductId(req.body.contact_email, req.body.id);
      if (result) {
        await buyProductController(req);
      } else {
        console.log(`⚠️ Order ${orderId} already recorded in DB for ${req.body.contact_email}, skipping`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }
);

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.use('/api', router);
// SupabaseConnection();

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});