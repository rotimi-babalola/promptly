export type RateLimitInfo = {
  limit: number | null;
  remaining: number | null;
  reset: Date | null;
};

export const parseRateLimitHeaders = (headers: Headers): RateLimitInfo => {
  const remaining = headers.get('X-Ratelimit-Remaining');
  const limit = headers.get('X-Ratelimit-Limit');
  const reset = headers.get('X-Ratelimit-Reset');

  const retryAfter = headers.get('Retry-After');

  let resetDate = null;
  const secondsToWait = reset
    ? parseInt(reset, 10)
    : retryAfter
    ? parseInt(retryAfter, 10)
    : null;

  if (secondsToWait !== null && !isNaN(secondsToWait)) {
    resetDate = new Date(Date.now() + secondsToWait * 1000);
  }

  return {
    limit: limit ? parseInt(limit, 10) : null,
    remaining: remaining ? parseInt(remaining, 10) : null,
    reset: resetDate,
  };
};
