import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from "./router";
import { SupabaseConnection } from './utils/supabase';
import cors from 'cors';
import { buyProductController } from './controller/nft.controller';
dotenv.config();

const app = express();
const port = process.env.PORT || 1001;
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'FETCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.use('/api', router);

app.post('/webhooks/orders/paid', express.json(), (req, res) => {
  buyProductController(req, res);
});

SupabaseConnection();

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});