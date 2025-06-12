import express from "express";
import { handleGetRoom, handleSyncUser } from "../controllers/user";
const router = express.Router();



router.post("/sync", handleSyncUser);
router.get("/room/:id", handleGetRoom);

export default router;