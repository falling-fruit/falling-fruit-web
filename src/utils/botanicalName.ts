type BotanicalSegment = { type: 'text'; value: string } | { type: 'hybridSign' }

const HYBRID_MARKER = /(^|\s)x(\s|$)/g

export const tokenizeBotanicalName = (
  botanical: string,
): BotanicalSegment[] => {
  const segments: BotanicalSegment[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  HYBRID_MARKER.lastIndex = 0
  while ((match = HYBRID_MARKER.exec(botanical)) !== null) {
    const [, leading, trailing] = match
    const text = botanical.slice(lastIndex, match.index) + leading
    if (text) {
      segments.push({ type: 'text', value: text })
    }
    segments.push({ type: 'hybridSign' })
    if (trailing) {
      segments.push({ type: 'text', value: trailing })
    }
    lastIndex = HYBRID_MARKER.lastIndex
  }

  if (lastIndex < botanical.length) {
    segments.push({ type: 'text', value: botanical.slice(lastIndex) })
  }

  return segments
}
