import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import { Toaster } from "./components/ui/sonner";
import { useSocket } from "./stores/SocketProvider";
import { useEffect } from "react";
import { toast } from "sonner";


export default function App() {
  const socket = useSocket();
  const navigate = useNavigate();
  useEffect(() => {
    if (!socket) return;

    const handleError = ({ msg }: { msg: string }) => toast.error(msg);
    const handleRoomJoined = ({ roomId }: { roomId: string }) => navigate(`/room/${roomId}`);
    socket.on("error", handleError);
    socket.on("room-joined", handleRoomJoined);

    return () => {
      socket.off("error", handleError);
      socket.off("room-joined", handleRoomJoined);
    };
  }, [socket])
  return (
    <div>
      <Navbar />
      <div className="py-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
