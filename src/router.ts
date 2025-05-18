import express from "express";
import { buyProductController } from "./controller/nft.controller";
import { UserController } from "./controller/user.controller";
const router = express.Router();

// @route   POST /mintNFT/metadata
// @desc    Mint NFT
// @access  Public
router.post('/buyProduct', buyProductController);

router.post('/addUser', UserController.addUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.post('/getUserByEmail', UserController.getUserByEmail);

export default router;
