import express, { RequestHandler } from "express";
import { UserController } from "./controller/user.controller";
import { getAllProductsController } from "./controller/nft.controller";
import { PublicController } from "./controller/public.controller";
import NFTEventController from "./controller/event.controller";
const router = express.Router();

//main Routes
router.post('/addUser', UserController.addUser as RequestHandler);
router.get('/getAllProducts', getAllProductsController as RequestHandler);

// Public Routes
router.post('/public/mintNFT', PublicController.mintNFT as RequestHandler);
router.get('/public/wallet/create', PublicController.createWallet as RequestHandler);
router.post('/public/transferNFT', PublicController.transferNFT as RequestHandler);

//Merchant site routes
router.get('/getAllUsers', UserController.getAllUsers as RequestHandler);
router.get('/event/getAllNFTEvents', NFTEventController.getNFTAllEvents as RequestHandler);

//User site routes
router.post('/getUserNFTs', UserController.getUserNFTs as RequestHandler);
router.post('/transferNFT', UserController.transferNFT as RequestHandler);
router.post('/updateUser', UserController.updateUser as RequestHandler);
router.post('/getUserWallet', UserController.getUserWallet as RequestHandler);


export default router;
