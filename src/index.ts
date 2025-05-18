import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from "./router";
import { SupabaseConnection } from './utils/supabase';
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT || 1001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

app.use('/', router);
SupabaseConnection();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});