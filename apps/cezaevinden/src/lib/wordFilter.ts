// Temel küfür/hakaret filtresi
const BANNED_WORDS = [
  'orospu', 'siktir', 'amk', 'amına', 'bok', 'göt', 'oç',
  'piç', 'salak', 'gerizekalı', 'aptal', 'mal', 'dangalak',
  'kahpe', 'sürtük', 'ibne', 'oğlan', 'bok', 'sünepe',
  'pezevenk', 'kevaşe', 'fahişe',
]

export function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase()
  return BANNED_WORDS.some(word => lower.includes(word))
}

export function filterText(text: string): string {
  let result = text
  const lower = text.toLowerCase()
  for (const word of BANNED_WORDS) {
    const idx = lower.indexOf(word)
    if (idx !== -1) {
      const stars = '*'.repeat(word.length)
      result = result.slice(0, idx) + stars + result.slice(idx + word.length)
    }
  }
  return result
}
