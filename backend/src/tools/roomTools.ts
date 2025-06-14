import { Server } from "socket.io";
import prisma from "../lib/prisma";
import { RoomType } from "../types/types";
import { Room } from "./roomClass";

export async function createRoom(data: RoomType, userId: string) {
  try {
    if (!userId) {
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });
    if (!user || !user.clerkId) {
      return;
    }

    const { name, mode, difficulty, timer, language } = data;

    const newRoom = await prisma.room.create({
      data: {
        name,
        mode,
        difficulty,
        timerInSeconds: timer,
        language,
        hostId: user.clerkId,
      },
    });
    if (!newRoom) return null;
    const newPlayer = await prisma.player.create({
      data: {
        roomId: newRoom.id,
        playerId: user.clerkId,
      },
    });

    return { newRoom, newPlayer };
  } catch (error) {
    return null;
  }
}

export async function hydrateActiveRooms(io: Server) {
  const rooms = await prisma.room.findMany({
    where: {
      status: {
        in: ["NOTSTARTED", "STARTED"],
      },
    },
    include: {
      players: true,
    },
  });

  const map = new Map<number, Room>();

  rooms.forEach((room) => {
    const instance = new Room(
      room.id,
      io,
      room.hostId,
      room.players.map((p) => p.playerId),
      room.mode,
      room.difficulty,
      room.timerInSeconds,
      room.language,
      room.status as "NOTSTARTED" | "STARTED" | "FINISHED"
    );

    map.set(room.id, instance);
  });

  return map;
}

export async function joinRoom(roomId: number, userId: string) {
  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room) return;

    const newPlayer = await prisma.player.create({
      data: {
        playerId: userId,
        roomId: roomId,
      },
    });

    return newPlayer.playerId;
  } catch (error) {
    return null;
  }
}

export async function leaveRoom(roomId: number, userId: string) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) return;

  await prisma.player.delete({
    where: {
      playerId_roomId: {
        playerId: userId,
        roomId: roomId,
      },
    },
  });

  return null;
}

export async function startRoom(roomId: number) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) return;

  await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      status: "STARTED",
    },
  });
}
