export type RichTextSegment =
  | { kind: 'text'; text: string }
  | { kind: 'strong'; text: string }
  | { kind: 'emphasis'; text: string }
  | { kind: 'underline'; text: string }
  | { kind: 'link'; href: string; text: string }

export function parseRichText(text: string): RichTextSegment[] {
  const segments: RichTextSegment[] = []
  let cursor = 0

  while (cursor < text.length) {
    const nextTokenStart = findNextRichTextTokenStart(text, cursor)

    if (!nextTokenStart) {
      segments.push({ kind: 'text', text: text.slice(cursor) })
      break
    }

    if (nextTokenStart.index > cursor) {
      segments.push({ kind: 'text', text: text.slice(cursor, nextTokenStart.index) })
    }

    const parsed = parseRichTextTokenAt(text, nextTokenStart)

    if (!parsed) {
      segments.push({ kind: 'text', text: text.slice(nextTokenStart.index) })
      break
    }

    segments.push(parsed.segment)
    cursor = parsed.nextCursor
  }

  return segments.length > 0 ? segments : [{ kind: 'text', text }]
}

export function richTextToPlainText(text: string) {
  return parseRichText(text)
    .map((segment) => segment.text)
    .join('')
}

export function splitRichTextParagraphs(text: string) {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

type RichTextTokenStart = {
  index: number
  kind: 'strong' | 'emphasis' | 'underline' | 'link'
}

function findNextRichTextTokenStart(text: string, cursor: number): RichTextTokenStart | null {
  const candidates: RichTextTokenStart[] = []
  const strongIndex = text.indexOf('**', cursor)
  const underlineIndex = text.toLowerCase().indexOf('<u>', cursor)
  const linkIndex = findNextLinkStart(text, cursor)
  const emphasisIndex = findNextEmphasisStart(text, cursor)

  if (strongIndex >= 0) candidates.push({ kind: 'strong', index: strongIndex })
  if (underlineIndex >= 0) candidates.push({ kind: 'underline', index: underlineIndex })
  if (linkIndex >= 0) candidates.push({ kind: 'link', index: linkIndex })
  if (emphasisIndex >= 0) candidates.push({ kind: 'emphasis', index: emphasisIndex })

  if (!candidates.length) return null

  return candidates.sort((a, b) => {
    if (a.index !== b.index) return a.index - b.index
    return getRichTextTokenPriority(a.kind) - getRichTextTokenPriority(b.kind)
  })[0]
}

function getRichTextTokenPriority(kind: RichTextTokenStart['kind']) {
  if (kind === 'link') return 0
  if (kind === 'strong') return 1
  if (kind === 'underline') return 2
  return 3
}

function parseRichTextTokenAt(
  text: string,
  tokenStart: RichTextTokenStart,
): { segment: RichTextSegment; nextCursor: number } | null {
  if (tokenStart.kind === 'strong') {
    const end = text.indexOf('**', tokenStart.index + 2)

    if (end < 0) return null

    const raw = text.slice(tokenStart.index, end + 2)
    const inner = text.slice(tokenStart.index + 2, end)

    return {
      nextCursor: end + 2,
      segment: isSimpleRichTextInner(inner) ? { kind: 'strong', text: inner } : { kind: 'text', text: raw },
    }
  }

  if (tokenStart.kind === 'emphasis') {
    const end = findNextEmphasisEnd(text, tokenStart.index + 1)

    if (end < 0) return null

    const raw = text.slice(tokenStart.index, end + 1)
    const inner = text.slice(tokenStart.index + 1, end)

    return {
      nextCursor: end + 1,
      segment: isSimpleRichTextInner(inner) ? { kind: 'emphasis', text: inner } : { kind: 'text', text: raw },
    }
  }

  if (tokenStart.kind === 'underline') {
    const end = text.toLowerCase().indexOf('</u>', tokenStart.index + 3)

    if (end < 0) return null

    const raw = text.slice(tokenStart.index, end + 4)
    const inner = text.slice(tokenStart.index + 3, end)

    return {
      nextCursor: end + 4,
      segment:
        isSimpleRichTextInner(inner) && !/[<>]/.test(inner)
          ? { kind: 'underline', text: inner }
          : { kind: 'text', text: raw },
    }
  }

  const link = parseLinkAt(text, tokenStart.index)

  if (!link) return null

  return {
    nextCursor: link.nextCursor,
    segment: link.isSafe
      ? { href: link.href, kind: 'link', text: link.label }
      : { kind: 'text', text: link.raw },
  }
}

function findNextLinkStart(text: string, cursor: number) {
  let index = text.indexOf('[', cursor)

  while (index >= 0) {
    if (parseLinkAt(text, index)) return index
    index = text.indexOf('[', index + 1)
  }

  return -1
}

function parseLinkAt(text: string, index: number) {
  const labelEnd = text.indexOf('](', index + 1)
  if (labelEnd < 0) return null

  const urlEnd = text.indexOf(')', labelEnd + 2)
  if (urlEnd < 0) return null

  const label = text.slice(index + 1, labelEnd)
  const href = text.slice(labelEnd + 2, urlEnd)
  const raw = text.slice(index, urlEnd + 1)
  const isSafe = isSimpleRichTextInner(label) && /^https?:\/\/\S+$/i.test(href) && !href.includes(')')

  return {
    href,
    isSafe,
    label,
    nextCursor: urlEnd + 1,
    raw,
  }
}

function findNextEmphasisStart(text: string, cursor: number) {
  let index = text.indexOf('*', cursor)

  while (index >= 0) {
    if (isSingleAsterisk(text, index)) return index
    index = text.indexOf('*', index + 1)
  }

  return -1
}

function findNextEmphasisEnd(text: string, cursor: number) {
  let index = text.indexOf('*', cursor)

  while (index >= 0) {
    if (isSingleAsterisk(text, index)) return index
    index = text.indexOf('*', index + 1)
  }

  return -1
}

function isSingleAsterisk(text: string, index: number) {
  return text[index] === '*' && text[index - 1] !== '*' && text[index + 1] !== '*'
}

function isSimpleRichTextInner(text: string) {
  return text.trim().length > 0 && !/[\r\n]/.test(text) && !containsSupportedRichTextMarker(text)
}

function containsSupportedRichTextMarker(text: string) {
  return text.includes('**') || text.includes('*') || /<\/?u>/i.test(text) || /\[[^\]\n]+\]\(/.test(text)
}
