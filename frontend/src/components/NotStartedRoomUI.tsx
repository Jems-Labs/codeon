import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { useUser } from '@clerk/clerk-react'
import { useSocket } from '@/stores/SocketProvider'

function NotStartedRoomUI({room}: any) {
    const {user} = useUser();
    const socket = useSocket();
    const handleLeaveRoom = () => {
    socket?.emit("leave-room");
  }
  const handleStartRoom = () => {
    socket?.emit("start-room", room.id)
  }
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
            <Badge className="mt-1">{room.status}</Badge>
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
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button onClick={handleLeaveRoom} variant={"destructive"}>Leave</Button>
        {room.hostId === user?.id && (
          <div className="flex justify-end">
            <Button onClick={handleStartRoom}>Start</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotStartedRoomUI