import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { GhostBoard } from '@/components/course/ghost'
import { Button } from '@/components/ui/button'
import { useQuery } from '@/hooks/use-query'
import { api } from '@/lib/api'
import { longDate } from '@/lib/format'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const { data: post, error, loading } = useQuery(`blog:${slug}`, () => api.blog(slug))
  const { data: all } = useQuery('blogs', api.blogs)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 })

  if (loading && !post) return <div className="container-page h-[60vh]" />
  if (error || !post) {
    return (
      <div className="container-page py-24">
        <GhostBoard readout="NOT FOUND" title={error?.message ?? 'Article not found'}>
          <Button asChild className="mt-5"><Link to="/blogs">All articles</Link></Button>
        </GhostBoard>
      </div>
    )
  }
  const related = (all ?? []).filter((p) => p.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 2)

  return (
    <>
      <motion.div aria-hidden className="fixed inset-x-0 top-16 z-40 h-[3px] origin-left bg-signal" style={{ scaleX: progress }} />
      <article className="container-page max-w-3xl py-14 sm:py-20">
        <Link to="/blogs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> All articles</Link>
        <h1 className="mt-8 text-4xl leading-[1.08] font-extrabold sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-y py-3 text-sm text-muted-foreground"><span className="rounded-sm bg-muted px-2 py-0.5 font-semibold text-foreground">{post.category}</span>{post.author} ∙ {longDate(post.publishedAt)} ∙ {post.readMinutes} min read</p>
        <div className="mt-10 space-y-6 text-[1.13rem] leading-[1.75] text-foreground/90">
          {post.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>
        <div className="on-board board-surface mt-14 flex flex-col items-start gap-4 rounded-xl p-6 text-letter sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">Ready to practise this for real?</p>
          <Button asChild><Link to="/courses">Find your module <ArrowRight /></Link></Button>
        </div>
      </article>
      {related.length > 0 && (
        <section className="border-t bg-[oklch(95.2%_0.009_264)]">
          <div className="container-page max-w-5xl py-14">
            <h2 className="text-2xl font-extrabold">Keep reading</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link to={`/blogs/${p.slug}`} className="block h-full rounded-xl border bg-card p-6 shadow-panel transition-colors hover:border-foreground/30">
                    <h3 className="text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                    <p className="mt-3 text-xs font-semibold text-muted-foreground">{p.category}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}
