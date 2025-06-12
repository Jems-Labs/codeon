import { Server, Socket } from "socket.io";
import { RoomType } from "../types/types";
import { createRoom, joinRoom } from "./roomTools";

export function listener(io: Server, activeRooms: Map<number, any>) {
  io.on("connection", async (socket: Socket) => {
    console.log("Socket connected", socket.id);

    socket.on("create-room", async (data: RoomType, userId: string) => {
      const room = await createRoom(data, userId);
      if (!room) {
        socket.emit("error", { msg: "Failed to create room" });
        return;
      }
      const { newRoom, newPlayer } = room;
      activeRooms.set(newRoom.id, {
        roomId: newRoom.id,
        hostId: userId,
        players: [newPlayer.playerId],
        status: "NOTSTARTED",
        mode: newRoom.mode,
      });
      socket.join(`${newRoom.id}`);
      socket.emit("room-created", newRoom);
    });
    socket.on("join-room", async (roomId: number, userId: string) => {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit("error", { msg: "Room not found" });
        return;
      }
      if (room.status === "STARTED") {
        socket.emit("error", { msg: "Room already started" });
        return;
      }
      if (room.mode === "DUEL" && room.players.length >= 2) {
        socket.emit("error", { msg: "Room is full" });
        return;
      }

      if (room.players.includes(userId)) {
        socket.emit("error", { msg: "User already in the room" });
        return;
      }
      const playerId = await joinRoom(room.roomId, userId);
      room.players.push(playerId);
      socket.join(String(roomId));
      socket.emit("room-joined", {
        roomId,
      });

      io.to(String(roomId)).emit("player-joined", {
        players: room.players,
      });
    });
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}
