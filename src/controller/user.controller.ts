import { Request, Response } from 'express';
import UserService from '../services/user.service';

export const UserController = {
    addUser: async (req: Request, res: Response) => {
        try {
            const { email, walletAddress, privateKey } = req.body;
            const existUSer = await UserService.getUserByEmail(email);
            if (!existUSer || existUSer.length === 0) {
                const result = await UserService.addUser(email, walletAddress, privateKey);
                result === null ? res.status(400).json({ message: 'User Add failed' })
                    : res.status(200).json({ message: 'User added successfully' });
            } else {
                res.status(200).json({ message: 'User already exists' });
            }
        } catch (error) {
            console.error('❌ Error adding user:', error);
            res.status(500).json({ error: 'Failed to add user' });
        }
    },
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const result = await UserService.getAllUsers();
            result === null ? res.status(400).json({ message: 'Users fetch failed' })
                : res.status(200).json({ message: 'Users fetched successfully', result });
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },
    getUserByEmail: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const result = await UserService.getUserByEmail(email);
            !result || result.length === 0 ? res.status(400).json({ message: 'User fetch failed' })
                : res.status(200).json({ message: 'User fetched successfully', result });
        } catch (error) {
            console.error('❌ Error fetching user by email:', error);
            res.status(500).json({ error: 'Failed to fetch user by email' });
        }
    }
}