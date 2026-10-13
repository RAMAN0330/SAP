import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/course/ghost'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="container-page py-24">
      <EmptyState icon={Compass} title="We couldn’t find that page">
        <p>The link may be old or mistyped. Head home, or browse the courses.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild><Link to="/">Go home</Link></Button>
          <Button asChild variant="outline"><Link to="/courses">All courses</Link></Button>
        </div>
      </EmptyState>
    </div>
  )
}
