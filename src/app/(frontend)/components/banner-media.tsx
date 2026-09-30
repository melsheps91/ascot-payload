'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import type { Media } from '@/payload-types'

import { type ImagePosition, objectPosition } from './shared/media'

export type BannerVideo =
  | { kind: 'youtube'; id: string }
  | { kind: 'local'; src: string; poster?: string | null }

const youtubeEmbed = (id: string, params: Record<string, string>) =>
  `https://www.youtube-nocookie.com/embed/${id}?${new URLSearchParams({ rel: '0', playsinline: '1', ...params })}`

// Stands in for the theme's backstretch slider: a background video, or images that
// fade every 4s (duration 4000, fade 750).
export function BannerSlideshow({
  images,
  video,
  position,
}: {
  images: Media[]
  video: BannerVideo | null
  position?: ImagePosition | null
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (video || images.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => setActive((i) => (i + 1) % images.length), 4000)
    return () => window.clearInterval(timer)
  }, [images.length, video])

  if (video?.kind === 'youtube') {
    return (
      <div className="slider">
        <iframe
          allow="autoplay; encrypted-media"
          aria-hidden
          className="slider-youtube"
          src={youtubeEmbed(video.id, {
            autoplay: '1',
            mute: '1',
            loop: '1',
            playlist: video.id,
            controls: '0',
            disablekb: '1',
          })}
          tabIndex={-1}
          title="Background video"
        />
      </div>
    )
  }

  if (video?.kind === 'local') {
    return (
      <div className="slider">
        <video
          aria-hidden
          autoPlay
          className="o-fit"
          loop
          muted
          playsInline
          poster={video.poster ?? undefined}
          src={video.src}
        />
      </div>
    )
  }

  return (
    <div className="slider">
      {images.map((image, i) => (
        <div className={`slide${i === active ? ' is-active' : ''}`} key={image.id}>
          <Image
            alt={image.alt}
            className="o-fit"
            fill
            priority={i === 0}
            sizes="100vw"
            src={image.url!}
            style={{ objectPosition: objectPosition(image, position ?? 'focal') }}
          />
        </div>
      ))}
    </div>
  )
}

// The theme's "Play Video" fancybox link, as a native <dialog>.
export function VideoButton({ video }: { video: BannerVideo }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) dialog.current?.showModal()
  }, [open])

  return (
    <>
      <button className="btn secondary" onClick={() => setOpen(true)} type="button">
        Play Video
      </button>
      {open && (
        <dialog
          className="video-lightbox"
          onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
          onClose={() => setOpen(false)}
          ref={dialog}
        >
          <button
            aria-label="Close video"
            className="video-lightbox-close"
            onClick={() => dialog.current?.close()}
            type="button"
          >
            ×
          </button>
          <div className="video-lightbox-frame">
            {video.kind === 'youtube' ? (
              <iframe
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                src={youtubeEmbed(video.id, { autoplay: '1' })}
                title="Video"
              />
            ) : (
              <video autoPlay controls playsInline src={video.src} />
            )}
          </div>
        </dialog>
      )}
    </>
  )
}
