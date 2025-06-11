import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Sword } from 'lucide-react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

          <div className="relative container">
            <div className="flex flex-col items-center gap-8 text-center py-24 md:py-32">
              <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/10">
                <Sword className="mr-2 h-4 w-4" />
                Compete. Code. Conquer.
              </Badge>

              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Battle Royale for Coders
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                  Join real-time coding duels, rise up the leaderboard, and prove your skill in the ultimate
                  multiplayer developer showdown.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-base gradient-bg hover:opacity-90 transition-opacity"
                >
                  <Link to={'/dashboard'}>

                    <Play className="mr-2 h-5 w-5" />
                    Start Battling Now

                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 text-base border-white/20 text-white hover:bg-white/10 transition"
                >
                  Join as Guest
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
