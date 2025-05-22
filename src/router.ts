import express, { RequestHandler } from "express";
import { buyProductController } from "./controller/nft.controller";
import { UserController } from "./controller/user.controller";
const router = express.Router();

// @route   POST /mintNFT/metadata
// @desc    Mint NFT
// @access  Public
router.post('/buyProduct', buyProductController as RequestHandler);

router.post('/addUser', UserController.addUser as RequestHandler);
router.get('/getAllUsers', UserController.getAllUsers as RequestHandler);
router.post('/getUserByEmail', UserController.getUserByEmail as RequestHandler);

export default router;
