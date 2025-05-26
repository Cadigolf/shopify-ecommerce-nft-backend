import express, { RequestHandler } from "express";
import { UserController } from "./controller/user.controller";
import { getAllProductsController } from "./controller/nft.controller";
import { PublicController } from "./controller/public.controller";

const router = express.Router();

router.post('/addUser', UserController.addUser as RequestHandler);
router.get('/getAllUsers', UserController.getAllUsers as RequestHandler);
router.post('/getUserNFTs', UserController.getUserNFTs as RequestHandler);
router.get('/getAllProducts', getAllProductsController as RequestHandler);    

// Public Routes
router.post('/public/mintNFT', PublicController.mintNFT as RequestHandler);
router.get('/public/wallet/create', PublicController.createWallet as RequestHandler);
router.post('/public/transferNFT', PublicController.transferNFT as RequestHandler);

export default router;
