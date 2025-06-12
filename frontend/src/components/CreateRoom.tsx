import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChevronDown } from "lucide-react";
import { useSocket } from "@/stores/SocketProvider";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  const socket = useSocket();
  const [formData, setFormData] = useState({
    name: "",
    timer: 600, // seconds (10 minutes)
    mode: "DUEL",
    difficulty: "MEDIUM",
    language: "JAVASCRIPT"
  });
  const { user } = useUser();
  const navigate = useNavigate();
  const timerOptions: { label: string; value: number }[] = [
    { label: "5 MINUTES", value: 300 },
    { label: "10 MINUTES", value: 600 },
    { label: "15 MINUTES", value: 900 },
    { label: "20 MINUTES", value: 1200 }
  ];

  const difficultyOptions = ["EASY", "MEDIUM", "HARD"];
  const languageOptions = ["JAVASCRIPT", "PYTHON", "C++"];
  const modeOptions = [
    { key: "DUEL", label: "1v1" },
    { key: "BATTLE", label: "Classic" }
  ];

  const handleDropdownChange = (
    key: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: typeof value === "string" ? value.toUpperCase() : value
    }));
  };

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (newRoom: any) => {
      navigate(`/room/${newRoom.id}`);
    };

    socket.on("room-created", handleRoomCreated);

    return () => {
      socket.off("room-created", handleRoomCreated);
    };
  }, [socket, navigate]);
  
  const createRoom = () => {
    socket?.emit("create-room", formData, user?.id);
  }
  if (!socket) {
    return <p>Connecting to socket...</p>;
  }
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create Battle Room</DialogTitle>
        <DialogDescription>Configure your battle room settings</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {/* Room Name */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="room-name" className="text-right text-sm font-medium">
            Room Name
          </Label>
          <Input
            id="room-name"
            placeholder="My Awesome Battle"
            className="col-span-3"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        {/* Timer */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">Timer</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="col-span-3 justify-between">
                {`${formData.timer / 60} MINUTES`}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {timerOptions.map(({ label, value }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => handleDropdownChange("timer", value)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mode */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">Mode</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="col-span-3 justify-between">
                {formData.mode}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {modeOptions.map(({ key, label }) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => handleDropdownChange("mode", key)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Difficulty */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">Difficulty</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="col-span-3 justify-between">
                {formData.difficulty}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {difficultyOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleDropdownChange("difficulty", option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Language */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm font-medium">Language</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="col-span-3 justify-between">
                {formData.language}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languageOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => handleDropdownChange("language", option)}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={createRoom}>
          Create Room
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default CreateRoom;
