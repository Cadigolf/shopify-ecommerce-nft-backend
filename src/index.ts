import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from "./router";
import { SupabaseConnection } from './utils/supabase';
import cors from 'cors';
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

// app.post('/webhooks/orders/create', express.json(), (req, res) => {
//     const orderData = req.body;
//     console.log('New Order:', orderData);
//     res.status(200).send('Webhook received');
// });

app.post('/webhooks/orders/create', express.raw({ type: 'application/json' }), (req, res) => {
    console.log("First result", req.body);
    const rawBody = req.body.toString('utf8');
    console.log("Second result", rawBody);
    // const orderData = JSON.parse(rawBody);
    // console.log("Third result", orderData);
    const products = rawBody.line_items.map((item: any) => ({
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image ? item.image.src : null,  // May be null
        product_id: item.product_id,
        variant_id: item.variant_id
    }));

    console.log("✔️✔️✔️", products);
    res.status(200).send('Webhook received');
});

SupabaseConnection();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});