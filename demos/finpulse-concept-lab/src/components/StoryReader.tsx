interface StoryReaderProps {
  paragraphs: string[]
  label?: string
  title?: string
  compact?: boolean
  headingId?: string
}

export function StoryReader({
  paragraphs,
  label = 'Канонический фрагмент · глава 1 из 6',
  title = 'Первый месяц',
  compact = false,
  headingId = 'story-heading',
}: StoryReaderProps) {
  return (
    <section className={compact ? 'story-reader story-reader--compact' : 'story-reader'} aria-labelledby={headingId}>
      <p className="section-label">{label}</p>
      <h2 id={headingId} className="story-title">
        {title}
      </h2>
      <div className="story-copy">
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 28)}`}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}
