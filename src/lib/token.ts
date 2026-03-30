import crypto from 'crypto'

const SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret'

/** userId + email + 24h expiry → signed token */
export function generateVerifyToken(userId: string, email: string): string {
  const exp     = Date.now() + 24 * 60 * 60 * 1000   // 24 saat
  const payload = `${userId}:${email}:${exp}`
  const sig     = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
  return Buffer.from(`${payload}:${sig}`).toString('base64url')
}

export type TokenResult =
  | { ok: true;  userId: string; email: string }
  | { ok: false; error: string }

/** Verify token, return userId + email or error */
export function verifyToken(token: string): TokenResult {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const parts   = decoded.split(':')
    if (parts.length !== 4) return { ok: false, error: 'Geçersiz token' }

    const [userId, email, expStr, sig] = parts
    const payload = `${userId}:${email}:${expStr}`
    const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')

    if (sig !== expected)        return { ok: false, error: 'Token imzası hatalı' }
    if (Date.now() > Number(expStr)) return { ok: false, error: 'Token süresi dolmuş' }

    return { ok: true, userId, email }
  } catch {
    return { ok: false, error: 'Token okunamadı' }
  }
}
