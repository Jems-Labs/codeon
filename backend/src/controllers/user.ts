import { Request } from "express";
import prisma from "../lib/prisma";
export async function handleSyncUser(req: Request, res: any) {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ msg: "User id not provided" });
    const userExists = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (userExists) {
      return res.status(200).json({ msg: "User already exists" });
    }
    
    const { fullName, username, email, clerkId, image } = req.body;
    if (!userId || userId !== clerkId) {
      return res.status(400).json({ msg: "Failed to login" });
    }
    await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        clerkId,
        image,
      },
    });
    res.status(200).json({ msg: "Done" });
  } catch (error) {
    return res.status(500).json({ msg: "User already exists" });
  }
}
