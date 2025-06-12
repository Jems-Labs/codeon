import { Language } from "@prisma/client";

export type RoomType = {
    id: number
    name: string
    hostId: string;
    status: "NOTSTARTED" | "STARTED" | "FINISHED";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    language: Language;
    timer: number;
    mode: "DUEL" | "BATTLE" 
    players: PlayerType[]
}

export type PlayerType = {
    id: number;
    playerId: string;
    roomId: number;
    joinedAt: Date
    room: RoomType;
}