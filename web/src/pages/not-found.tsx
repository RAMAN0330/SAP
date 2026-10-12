import { Link } from 'react-router-dom'
import { GhostBoard } from '@/components/course/ghost'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="container-page py-24">
      <GhostBoard readout="GATE NOT FOUND" title="This page has departed — or never existed">
        <p>Check the address, or head back to the departures board.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link to="/courses">All courses</Link></Button>
        </div>
      </GhostBoard>
    </div>
  )
}
