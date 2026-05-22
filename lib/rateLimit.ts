const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(ip: string, limit = 30, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = requests.get(ip)

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

const dailyRequests = new Map<string, { count: number; resetAt: number }>()

export function rateLimitDaily(ip: string, limit = 5): boolean {
  const now = Date.now()
  const midnight = new Date(); midnight.setHours(24, 0, 0, 0)
  const resetAt = midnight.getTime()
  const entry = dailyRequests.get(ip)

  if (!entry || now > entry.resetAt) {
    dailyRequests.set(ip, { count: 1, resetAt })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
