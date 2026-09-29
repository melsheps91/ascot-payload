import type { Testimonial, TestimonialsBlock } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

import { asMedia, Img } from './shared/media'
import { Section, SectionIntro } from './shared/section'
import { Slider } from './shared/slider'

function Card({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="testimonial">
      <blockquote>“{testimonial.quote}”</blockquote>
      <figcaption>
        <span className="name">{testimonial.customerName}</span>
        {testimonial.companyName && <span className="company">{testimonial.companyName}</span>}
      </figcaption>
    </figure>
  )
}

// Port of inc/content/testimonials-slider.php, plus the redesign's large quote and cards.
export async function Testimonials({ block }: { block: TestimonialsBlock }) {
  let testimonials = (block.testimonials ?? []).filter(
    (item): item is Testimonial => typeof item === 'object',
  )

  if (!block.testimonials?.length) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({ collection: 'testimonials', limit: 6, depth: 1 })
    testimonials = docs
  }

  if (!testimonials.length) return null

  if (block.style === 'quote') {
    const [first] = testimonials
    return (
      <Section block={block} name="testimonials">
        <figure className="container-medium testimonial-quote">
          <i aria-hidden className="fa-solid fa-quote-left quote-icon" />
          <blockquote>{first.quote}</blockquote>
          <figcaption>
            <span className="avatar">
              {asMedia(first.image) ? (
                <Img image={first.image} sizes="56px" />
              ) : (
                <span className="initials">
                  {first.customerName
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              )}
            </span>
            <span className="who">
              <span className="name">{first.customerName}</span>
              {first.companyName && <span className="company">{first.companyName}</span>}
            </span>
          </figcaption>
        </figure>
      </Section>
    )
  }

  return (
    <Section block={block} name="testimonials">
      <div className="container">
        <SectionIntro block={block} size="large" />
        {block.style === 'slider' ? (
          <Slider autoplay={6000} className="testimonials-slider" label="Testimonials">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} testimonial={testimonial} />
            ))}
          </Slider>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
