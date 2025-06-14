import { Server, Socket } from "socket.io";
import { RoomType } from "../types/types";
import { createRoom, joinRoom, leaveRoom, startRoom } from "./roomTools";
import { Room } from "./roomClass";

const userSocketMap = new Map<string, string>();

export function listener(io: Server, activeRooms: Map<number, Room>) {
  io.on("connection", async (socket: Socket) => {
    console.log("Socket connected", socket.id);

    socket.on("create-room", async (data: RoomType, userId: string) => {
      const roomData = await createRoom(data, userId);
      if (!roomData) {
        socket.emit("error", { msg: "Failed to create room" });
        return;
      }

      const { newRoom, newPlayer } = roomData;

      const room = new Room(
        newRoom.id,
        io,
        userId,
        [newPlayer.playerId],
        newRoom.mode,
        newRoom.difficulty,
        newRoom.timerInSeconds,
        newRoom.language,
        "NOTSTARTED"
      );

      activeRooms.set(newRoom.id, room);
      socket.join(`${newRoom.id}`);
      userSocketMap.set(userId, socket.id);
      socket.emit("room-created", newRoom);
    });

    socket.on("join-room", async (roomId: number, userId: string) => {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit("error", { msg: "Room not found" });
        return;
      }

      if (room.roomStatus === "STARTED") {
        socket.emit("error", { msg: "Room already started" });
        return;
      }

      if (
        room.mode === "DUEL" &&
        room.players.length >= 2 &&
        !room.players.includes(userId)
      ) {
        socket.emit("error", { msg: "Room is full" });
        return;
      }

      // Only add the player if not already in the room
      if (!room.players.includes(userId)) {
        const playerId = await joinRoom(room.roomId, userId);
        if (!playerId) {
          socket.emit("error", { msg: "Failed to join room" });
          return;
        }
        room.addPlayer(playerId);
      }

      // Always join socket room and update map
      userSocketMap.set(userId, socket.id);
      socket.join(String(roomId));

      // Send confirmation to this user
      socket.emit("room-joined", { roomId });

      // Notify everyone in the room
      io.to(String(roomId)).emit("player-joined", {
        players: room.players,
      });
    });

    socket.on("reconnect-user", (userId: string) => {
      userSocketMap.set(userId, socket.id);
      for (const [roomId, room] of activeRooms) {
        if (room.players.includes(userId)) {
          socket.join(String(roomId));
          socket.emit("room-joined", { roomId });
        }
      }
    });

    socket.on("leave-room", async () => {
      const userId = [...userSocketMap.entries()].find(
        ([, sid]) => sid === socket.id
      )?.[0];
      if (!userId) return;

      userSocketMap.delete(userId);

      for (const [roomId, room] of activeRooms) {
        if (room.players.includes(userId)) {
          room.removePlayer(userId);
          await leaveRoom(roomId, userId);

          io.to(String(roomId)).emit("player-left", {
            player: userId,
          });
        }
      }
    });
    

    socket.on("start-room", async (roomId) => {
      const parsedRoomId = parseInt(roomId);
      const room = activeRooms.get(parsedRoomId);
      if (!room) {
        socket.emit("error", { msg: "Room not found" });
        return;
      }

      if (room.roomStatus === "STARTED") {
        socket.emit("error", { msg: "Room already started" });
        return;
      }
      await startRoom(parsedRoomId);
      await room.startRoom();
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
