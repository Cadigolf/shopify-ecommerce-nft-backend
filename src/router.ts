import express, { RequestHandler } from "express";
import { UserController } from "./controller/user.controller";
import { getAllProductsController } from "./controller/nft.controller";
import { PublicController } from "./controller/public.controller";
import NFTEventController from "./controller/event.controller";
import { HubsAIController } from "./controller/hubs.controller";
import { requireAuth } from "./middleware/auth";
const router = express.Router();

//main Routes
router.post('/addUser', UserController.addUser as RequestHandler);
router.get('/getAllProducts', getAllProductsController as RequestHandler);

// Public Routes
router.post('/public/mintNFT', PublicController.mintNFT as RequestHandler);
router.get('/public/wallet/create', PublicController.createWallet as RequestHandler);
router.post('/public/transferNFT', PublicController.transferNFT as RequestHandler);

//Merchant site routes (protected)
router.get('/getAllUsers', requireAuth as RequestHandler, UserController.getAllUsers as RequestHandler);
router.get('/event/getAllNFTEvents', requireAuth as RequestHandler, NFTEventController.getNFTAllEvents as RequestHandler);

//User site routes (protected)
router.post('/getUserNFTs', requireAuth as RequestHandler, UserController.getUserNFTs as RequestHandler);
router.post('/transferNFT', requireAuth as RequestHandler, UserController.transferNFT as RequestHandler);
router.post('/updateUser', requireAuth as RequestHandler, UserController.updateUser as RequestHandler);
router.post('/getUserWallet', requireAuth as RequestHandler, UserController.getUserWallet as RequestHandler);

//HubsAI frontend Integration
router.post('/auth/signup', HubsAIController.signUp as RequestHandler);
router.post('/auth/signin', HubsAIController.signIn as RequestHandler);
router.post('/auth/claim-wallet-address', requireAuth as RequestHandler, HubsAIController.claimWalletAddress as RequestHandler);
router.post('/auth/setup-profile', requireAuth as RequestHandler, HubsAIController.setupProfile as RequestHandler);
router.post('/auth/update-profile', requireAuth as RequestHandler, HubsAIController.updateProfile as RequestHandler);


export default router;
