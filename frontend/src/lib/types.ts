export type UserType = {
  id: number;
  clerkId: string;
  username: string;
  fullName: string;
  image: string;
  email: string;
};

export type RoomType = {
  id: number;
  name: string;
  hostId: string;
  host: UserType;
  status: "NOTSTARTED" | "STARTED" | "FINISHED";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  language: string;
  timerInSeconds: number;
  mode: "DUEL" | "BATTLE";
  players: PlayerType[];
};

export type PlayerType = {
  id: number;
  playerId: string;

  roomId: number;
  joinedAt: Date;
  room: RoomType;
};
