import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import type { RoomType } from "@/lib/types";
import { useSocket } from "@/stores/SocketProvider";
import { toast } from "sonner";
import NotStartedRoomUI from "@/components/NotStartedRoomUI";
import StartedRoomUI from "@/components/StartedRoomUI";
import FinishedRoomUI from "@/components/FinishedRoomUI";

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
    const handlePlayerLeft = ({ playerId }: any) => {
      toast.info(`${playerId} left room`);
      fetchRoom();
    };
    const handleRoomStarted = () => {
      toast.success("Room Started");
      fetchRoom();
    };
    
    socket.on("player-joined", handlePlayerJoined);
    socket.on("player-left", handlePlayerLeft);
    socket.on("room-started", handleRoomStarted);
    
    return () => {
      socket.off("player-joined", handlePlayerJoined);
      socket.off("player-left", handlePlayerLeft);
      socket.off("room-started", handleRoomStarted);
      
    };
  }, [socket]);

  if (!room) {
    return (
      <div className="p-6">
        <Skeleton className="w-full h-52 rounded-xl" />
      </div>
    );
  }
  switch (room.status) {
    case "NOTSTARTED":
      return <NotStartedRoomUI room={room} />;
    case "STARTED":
      return <StartedRoomUI room={room}/>;
    case "FINISHED":
      return <FinishedRoomUI />;
    default:
      return null;
  }
}

export default Room;
