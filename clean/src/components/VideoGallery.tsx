import { useSite } from '../context/SiteContext'
import { useInView } from '../hooks/useInView'
import { SectionHeading } from './SectionHeading'

function embedUrl(url: string) {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/)
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return ''
}

export function VideoGallery() {
  const { videos } = useSite()
  const { ref, visible } = useInView()
  const items = videos.items.filter((item) => item.thumb || item.video)
  const [first, ...rest] = items

  if (!items.length) return null

  return (
    <section id="videos" className="bg-sky/40 py-20 lg:py-28">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={videos.title} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          {first && (
            <article>
              <div className="overflow-hidden rounded-[1.6rem] bg-lavender/50">
                <div className="aspect-[16/10]">
                  <VideoMedia item={first} />
                </div>
              </div>
              <h3 className="mt-5 font-display text-3xl italic text-ink">{first.title}</h3>
              {first.description && <p className="mt-2 text-sm leading-relaxed text-ink-muted">{first.description}</p>}
            </article>
          )}
          <div className="flex flex-col divide-y divide-ink/8">
            {rest.map((video) => (
              <article key={video.title} className="grid grid-cols-[7.5rem_1fr] gap-5 py-5 first:pt-0 last:pb-0 sm:grid-cols-[11rem_1fr]">
                <div className="overflow-hidden rounded-2xl bg-peach/40">
                  <div className="aspect-video">
                    <VideoMedia item={video} />
                  </div>
                </div>
                <div className="self-center">
                  <h3 className="font-display text-2xl italic text-ink">{video.title}</h3>
                  {video.description && <p className="mt-1 text-sm text-ink-muted">{video.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function VideoMedia({
  item,
}: {
  item: { title: string; thumb: string; video: string }
}) {
  const embed = item.video ? embedUrl(item.video) : ''
  if (embed) {
    return (
      <iframe
        src={embed}
        title={item.title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }
  if (item.video) {
    return <video src={item.video} controls poster={item.thumb || undefined} className="h-full w-full object-cover" />
  }
  return <img src={item.thumb} alt={item.title} className="h-full w-full object-cover" />
}
