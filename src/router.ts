import express from "express";
import { NFTController, transferNFTController } from "./controller/nft.controller";
import { UserController } from "./controller/user.controller";
const router = express.Router();

// @route   POST /mintNFT/metadata
// @desc    Mint NFT
// @access  Public
router.post('/mintNFT', NFTController);
router.post('/transferNFT', transferNFTController);

router.post('/addUser', UserController.addUser);
router.get('/getAllUsers', UserController.getAllUsers);
router.post('/getUserByEmail', UserController.getUserByEmail);

export default router;
