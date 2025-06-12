import CreateRoom from "@/components/CreateRoom"
import JoinRoom from "@/components/JoinRoom"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

function Dashboard() {
  return (
    <div className="px-10">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus /> Create Room</Button>
            </DialogTrigger>
            <CreateRoom />
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Join Room</Button>
            </DialogTrigger>
            <JoinRoom />
          </Dialog>
        </div>
      </header>
    </div>
  )
}

export default Dashboard