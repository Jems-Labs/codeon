import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "./ui/dialog";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSocket } from "@/stores/SocketProvider";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function JoinRoom() {
    const socket = useSocket();
    const [code, setCode] = useState("");
    const { user } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        if (!socket) return;

        const handleError = ({msg}: {msg: string}) => toast.error(msg);
        const handleRoomJoined = ({ roomId }: {roomId: string}) => navigate(`/room/${roomId}`);

        socket.on("error", handleError);
        socket.on("room-joined", handleRoomJoined);

        return () => {
            socket.off("error", handleError);
            socket.off("room-joined", handleRoomJoined);
        };
    }, [socket, navigate]);



    const handleJoinRoom = () => {
        const roomId = parseInt(code);
        socket?.emit("join-room", roomId, user?.id);
    }
    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Join Room by Code</DialogTitle>
                <DialogDescription>Enter the room code to join an existing battle</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room-code" className="text-right text-sm font-medium">
                        Room Code
                    </Label>
                    <Input
                        id="room-code"
                        placeholder="Enter code"
                        className="col-span-3"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        type="number"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={handleJoinRoom}>
                    Join Room
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}

export default JoinRoom