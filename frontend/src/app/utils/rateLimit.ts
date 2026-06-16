interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  timestamp: number;
}

const requestLog = new Map<string, RateLimitEntry>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim() || "unknown";
  }

  return "unknown";
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const requestData = requestLog.get(key) || { count: 0, timestamp: now };

  if (now - requestData.timestamp > windowMs) {
    requestData.count = 1;
    requestData.timestamp = now;
  } else {
    requestData.count++;
  }

  requestLog.set(key, requestData);
  return requestData.count <= limit;
}

export function clearExpiredRateLimitEntries(windowMs: number) {
  const now = Date.now();

  for (const [key, data] of requestLog.entries()) {
    if (now - data.timestamp > windowMs) {
      requestLog.delete(key);
    }
  }
}

