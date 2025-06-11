import express from "express";
import { handleSyncUser } from "../controllers/user";
const router = express.Router();



router.post("/sync", handleSyncUser);


export default router;