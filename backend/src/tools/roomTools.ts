import prisma from "../lib/prisma";
import { RoomType } from "../types/types";

export async function createRoom(data: RoomType, userId: string){
    try {
        if(!userId){
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                clerkId: userId
            }
        });
        if(!user || !user.clerkId){
            return;
        }

        const {name, mode, difficulty, timer, language} = data;

        const newRoom = await prisma.room.create({
            data: {
                name,
                mode,
                difficulty,
                timerInSeconds: timer,
                language,
                hostId: user.clerkId
            }
        })
        if(!newRoom) return null;
        const newPlayer = await prisma.player.create({
            data: {
                roomId: newRoom.id,
                playerId: user.clerkId
            }
        });


        return {newRoom, newPlayer};
    } catch (error) {
        return null
    }
}

export async function hydrateActiveRooms() {
  const rooms = await prisma.room.findMany({
    where: {
      status: {
        in: ["NOTSTARTED", "STARTED"]
      }
    },
    include: {
      players: true
    }
  });

  const map = new Map();

  rooms.forEach((room) => {
    map.set(room.id, {
      roomId: room.id,
      hostId: room.hostId,
      players: room.players.map(p => p.playerId),
      status: room.status,
      mode: room.mode
    });
  });

  return map;
}


export async function joinRoom(roomId: number, userId: string){
    try {
        const room = await prisma.room.findUnique({
            where: {
                id: roomId
            }
        })
        if(!room) return;

        const newPlayer = await prisma.player.create({
            data: {
                playerId: userId,
                roomId: roomId
            }
        });


        return newPlayer.playerId;
    } catch (error) {
        return null;
    }
}