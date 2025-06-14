import { Server } from "socket.io";
import { getQuestions } from "./roomTools";

export class Room {
  roomStatus: "STARTED" | "FINISHED" | "NOTSTARTED";
  roomId: number;
  hostId: string;
  players: string[];
  mode: "DUEL" | "BATTLE";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  timer: number;
  language: string;
  io: Server;
  interval?: NodeJS.Timeout;

  constructor(
    roomId: number,
    io: Server,
    hostId: string,
    players: string[],
    mode: "DUEL" | "BATTLE",
    difficulty: "EASY" | "MEDIUM" | "HARD",
    timer: number,
    language: string,
    status: "NOTSTARTED" | "STARTED" | "FINISHED"
  ) {
    this.roomStatus = status;
    this.roomId = roomId;
    this.hostId = hostId;
    this.players = players;
    this.mode = mode;
    this.difficulty = difficulty;
    this.timer = timer;
    this.language = language;
    this.io = io;
  }

  async startRoom() {
    if (this.roomStatus === "STARTED") return;
    this.roomStatus = "STARTED";
    this.io.to(String(this.roomId)).emit("room-started");

    let countdown = this.timer;

    const questions = await getQuestions(this.language);

    setTimeout(() => {
      this.io.to(String(this.roomId)).emit("room-questions", questions);
    }, 500);

    this.interval = setInterval(() => {
      countdown--;
      this.io
        .to(String(this.roomId))
        .emit("room-timer", { remaining: countdown });

      if (countdown <= 0) {
        this.endRoom();
      }
    }, 1000);
  }

  endRoom() {
    if (this.interval) clearInterval(this.interval);
    this.roomStatus = "FINISHED";
    this.io.to(String(this.roomId)).emit("room-ended", {
      roomId: this.roomId,
      status: "FINISHED",
    });
  }

  addPlayer(playerId: string) {
    if (!this.players.includes(playerId)) {
      this.players.push(playerId);
    }
  }

  removePlayer(playerId: string) {
    this.players = this.players.filter((id) => id !== playerId);
  }
}
