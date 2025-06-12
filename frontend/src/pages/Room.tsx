import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { RoomType } from "@/lib/types";
import { useSocket } from "@/stores/SocketProvider";

function Room() {
  const [room, setRoom] = useState<RoomType | null>(null);
  const { getToken } = useAuth();
  const { id } = useParams();
  const socket = useSocket();

  async function fetchRoom() {
    const token = await getToken();
    const res = await axios.get(`http://localhost:5001/api/user/room/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      setRoom(res.data);
    }
  }
  useEffect(() => {
    fetchRoom();
  }, []);
  useEffect(() => {
    if (!socket) return;

    const handlePlayerJoined = () => {
      fetchRoom();
    };

    socket.on("player-joined", handlePlayerJoined);

    return () => {
      socket.off("player-joined", handlePlayerJoined);
    };
  }, [socket]);

  if (!room) {
    return (
      <div className="p-6">
        <Skeleton className="w-full h-52 rounded-xl" />
      </div>
    );
  }
  console.log(room);
  return (
    <div className="p-6 flex flex-col gap-6">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            {room.name}
            <Badge variant="secondary">{room.mode}</Badge>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Hosted by {room.host.fullName}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Language</span>
            <div className="font-medium">{room.language}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Difficulty</span>
            <div className="font-medium">{room.difficulty}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Timer</span>
            <div className="font-medium">{room.timerInSeconds / 60} min</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Status</span>
            <br />
            <Badge className="mt-1"> {room.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Players</CardTitle>
          <CardDescription>
            {room.players.length} participant(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {room.players.map(({ player }: any) => (
            <div key={player.id} className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={player.image} alt={player.username} />
                <AvatarFallback>{player.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{player.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  {player.username}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={room.status !== "NOTSTARTED"}>Start Battle</Button>
      </div>
    </div>
  );
}

export default Room;
