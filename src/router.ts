import express, { RequestHandler } from "express";
import { UserController } from "./controller/user.controller";
const router = express.Router();

router.post('/addUser', UserController.addUser as RequestHandler);
router.get('/getAllUsers', UserController.getAllUsers as RequestHandler);
router.post('/getUserHistoryByEmail', UserController.getUserHistoryByEmail as RequestHandler);

export default router;
