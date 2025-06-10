import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
const router = express.Router();

declare global {
  namespace Express {
    interface Request {
      auth: () => { userId: string };
    }
  }
}

router.post("/sync", async (req: Request, res: any) => {
    const { userId } = req.auth();
    const {fullName, username, email, clerkId, image} = req.body;
    if (!userId || userId !== clerkId) {
    return res.status(400).json({ msg: "Failed to login" });
  }
    await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        clerkId,
        image
      }
    })
    res.status(200).json({msg:"Done"})
});

export default router;
 