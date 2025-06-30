import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

import 'dotenv/config'

const rateLimiter = new Ratelimit({
  redis : Redis.fromEnv(),
  // limiter can be configured api requests 100 per 30 seconds
  limiter : Ratelimit.slidingWindow(100, "30 s")
})

export default rateLimiter;