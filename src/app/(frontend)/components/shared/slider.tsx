'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { Children, type ReactNode, useCallback, useEffect, useState } from 'react'

// Replaces the theme's Slick sliders. Each child is one slide.
export function Slider({
  children,
  label,
  className = '',
  autoplay = 0,
}: {
  children: ReactNode
  label: string
  className?: string
  /** Milliseconds between slides; 0 turns autoplay off. */
  autoplay?: number
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selected, setSelected] = useState(0)
  const slides = Children.toArray(children)

  useEffect(() => {
    if (!embla) return
    const onSelect = () => setSelected(embla.selectedScrollSnap())
    embla.on('select', onSelect)
    return () => {
      embla.off('select', onSelect)
    }
  }, [embla])

  useEffect(() => {
    if (!embla || !autoplay) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => embla.scrollNext(), autoplay)
    return () => window.clearInterval(timer)
  }, [embla, autoplay])

  const scrollTo = useCallback((index: number) => embla?.scrollTo(index), [embla])

  return (
    <div aria-label={label} aria-roledescription="carousel" className={`carousel ${className}`} role="region">
      <div className="slider-viewport" ref={emblaRef}>
        <div className="slider-track">
          {slides.map((slide, i) => (
            <div
              aria-label={`${i + 1} of ${slides.length}`}
              aria-roledescription="slide"
              className="slider-slide"
              key={i}
              role="group"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="slider-controls">
          <button aria-label="Previous slide" className="slider-arrow" onClick={() => embla?.scrollPrev()} type="button">
            <i aria-hidden className="fa-solid fa-arrow-left" />
          </button>
          <div className="slider-dots">
            {slides.map((_, i) => (
              <button
                aria-current={i === selected}
                aria-label={`Go to slide ${i + 1}`}
                className={`slider-dot${i === selected ? ' is-active' : ''}`}
                key={i}
                onClick={() => scrollTo(i)}
                type="button"
              />
            ))}
          </div>
          <button aria-label="Next slide" className="slider-arrow" onClick={() => embla?.scrollNext()} type="button">
            <i aria-hidden className="fa-solid fa-arrow-right" />
          </button>
        </div>
      )}
    </div>
  )
}
