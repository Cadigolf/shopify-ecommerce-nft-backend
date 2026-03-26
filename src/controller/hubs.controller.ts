import { Request, Response } from "express";
import HubsService from "../services/hubs.service";
import { ProductService } from "../services/product.service";
import { transferNFT } from "../utils/solana";

const isSolanaAddress = (addr: string) =>
  !!addr && !addr.startsWith('0x') && addr.length >= 32 && addr.length <= 44;

// Fire-and-forget: transfer any pending_claim NFTs from treasury to the user's wallet
const transferPendingNFTs = (email: string, walletAddress: string): void => {
  ProductService.getPendingClaimNFTs(email).then(async (pendingNFTs: any[]) => {
    if (!pendingNFTs || pendingNFTs.length === 0) return;
    for (const nft of pendingNFTs) {
      try {
        const success = await transferNFT(nft.mintAddress, walletAddress);
        if (success) {
          await ProductService.updateHistoryEntryStatus(email, nft.mintAddress, 'claimed');
          console.log(`✅ Pending NFT ${nft.mintAddress} transferred to ${walletAddress}`);
        } else {
          console.error(`❌ Failed to transfer pending NFT ${nft.mintAddress} — will retry on next login`);
        }
      } catch (err) {
        console.error(`❌ Error transferring pending NFT ${nft.mintAddress}:`, err);
      }
    }
  }).catch((err: any) => {
    console.error('❌ Error checking pending NFTs:', err);
  });
};

export const HubsAIController = {
  signUp: async (req: Request, res: Response) => {
    try {
      const { email, walletAddress } = req.body;
      const existingUser = await HubsService.getUserByEmail(email);
      if (!existingUser || existingUser.length === 0) {
        const result = await HubsService.addUser(email, walletAddress || '');
        if (result === null || result === false) {
          return res.status(400).json({ message: "User Add failed", success: false });
        }
        if (isSolanaAddress(walletAddress)) transferPendingNFTs(email, walletAddress);
        return res.status(200).json({
          message: "User added successfully",
          result: Array.isArray(result) ? result[0] : result,
          success: true,
        });
      } else {
        // Always update wallet address when provided so the Privy embedded
        // wallet address stays in sync with Supabase
        const result = walletAddress
          ? await HubsService.updateWalletAddress(email, walletAddress)
          : await HubsService.updateUser(email);
        if (result === false) {
          return res.status(400).json({ message: "User Update failed", success: false });
        }
        if (isSolanaAddress(walletAddress)) transferPendingNFTs(email, walletAddress);
        return res.status(200).json({
          message: "User updated successfully",
          result: Array.isArray(result) ? result[0] : result,
          success: true,
        });
      }
    } catch (error) {
      console.error("❌ Error adding user:", error);
      res.status(500).json({ error: "Failed to add user" });
    }
  },
  signIn: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await HubsService.getUserByEmail(email);
      if (result === null || result.length === 0) {
        res.status(400).json({ error: "User not found", success: false });
      } else {
        return res
          .status(200)
          .json({
            message: "User sign in successfully",
            result: result[0],
            success: true,
          });
      }
    } catch (error) {
      console.error("❌ Error sign in user:", error);
      res.status(500).json({ error: "Failed to sign in user", success: false });
    }
  },
  claimWalletAddress: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const result = await HubsService.getUserByEmailAndWalletAddress(email);
      if (result === false || !Array.isArray(result)) {
        res.status(400).json({ error: "User not found", success: false });
      } else {
        return res
          .status(200)
          .json({ message: "User found", result: result[0], success: true });
      }
    } catch (error) {
      console.error("❌ Error claiming wallet address:", error);
      res
        .status(500)
        .json({ error: "Failed to claim wallet address", success: false });
    }
  },
  setupProfile: async (req: Request, res: Response) => {
    try {
      const {
        username,
        country,
        interests,
        emailCommunications,
        hubsStakingInterest,
        email,
      } = req.body;
      const emailComms =
        emailCommunications === "true" || emailCommunications === true;
      const hubsStaking =
        hubsStakingInterest === "true" || hubsStakingInterest === true;

      const result = await HubsService.updateUserProfileSetup(
        email,
        username,
        country,
        interests,
        emailComms,
        hubsStaking,
      );

      if (result === false || result === null) {
        res.status(500).json({
          error: "Failed to save profile data",
          success: false,
        });
      }

      res.send({
        message: "Profile setup completed successfully",
        success: true,
        result: Array.isArray(result) ? result[0] : result,
      });
    } catch (error) {
      console.error("❌ Error setting up profile:", error);
      res
        .status(500)
        .json({ error: "Failed to set up profile", success: false });
    }
  },
  updateProfile: async (req: Request, res: Response) => {
    try {
      const { email, username, country, fullname } = req.body;
      const result = await HubsService.updateUserProfile(
        email,
        username,
        country,
        fullname,
      );
      if (result === false || result === null) {
        res
          .status(500)
          .json({ error: "Failed to update profile", success: false });
      }
      res
        .status(200)
        .json({
          message: "Profile updated successfully",
          result: result,
          success: true,
        });
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      res
        .status(500)
        .json({ error: "Failed to update profile", success: false });
    }
  },
};
