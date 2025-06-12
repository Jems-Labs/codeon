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
export async function handleGetRoom(req: Request, res: any){
  try {
    const id = req.params['id'];

    if(!id) return res.status(400).json({msg: "No id provided"});

    const room = await prisma.room.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        players: {
          include: {
            player: true
          }
        },
        host: true
      }
    });


    if(!room) return res.status(404).json({msg: "No room provided"});

    return res.status(200).json(room);
  } catch {
    return res.status(500).json({msg: "Internal Server Error"});
  }
}