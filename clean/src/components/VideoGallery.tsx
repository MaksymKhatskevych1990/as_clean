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

type VideoItem = { title: string; description: string; thumb: string; video: string }

export function VideoGallery() {
  const { videos, header } = useSite()
  const { ref, visible } = useInView()
  const items = videos.items.filter((item) => item.thumb || item.video)
  const [first, ...rest] = items

  if (!items.length) return null

  return (
    <section id="videos" className="bg-white py-16 lg:py-24">
      <div ref={ref} className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={visible ? 'opacity-100' : 'opacity-0'}>
          <SectionHeading title={videos.title} />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2 lg:grid-rows-2">
          {first && (
            <div className="lg:row-span-2">
              <VideoCard item={first} large />
            </div>
          )}
          {rest.map((video) => (
            <VideoCard key={video.title} item={video} />
          ))}
        </div>

        <div className="mt-10">
          <a href="#booking" className="btn-fill">
            {header.cta_text}
          </a>
        </div>
      </div>
    </section>
  )
}

function VideoCard({ item, large = false }: { item: VideoItem; large?: boolean }) {
  const embed = item.video ? embedUrl(item.video) : ''
  const playable = Boolean(embed || item.video)

  return (
    <article className={`relative h-full overflow-hidden rounded-[1.6rem] bg-navy ${large ? 'min-h-[22rem]' : 'min-h-[13.5rem]'}`}>
      <div className={playable ? '' : 'absolute inset-0'}>
        <div className={playable ? 'aspect-video' : 'h-full min-h-[13.5rem]'}>
          <VideoMedia item={item} />
        </div>
      </div>
      {playable ? (
        <div className="p-5">
          <h3 className="font-display text-2xl text-white">{item.title}</h3>
          {item.description && <p className="mt-1 text-sm leading-relaxed text-white/70">{item.description}</p>}
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/75 to-transparent p-5 pt-20">
          <h3 className={`font-display text-white ${large ? 'text-3xl' : 'text-2xl'}`}>{item.title}</h3>
          {item.description && <p className="mt-1 max-w-md text-sm leading-relaxed text-white/75">{item.description}</p>}
        </div>
      )}
    </article>
  )
}

function VideoMedia({ item }: { item: VideoItem }) {
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
