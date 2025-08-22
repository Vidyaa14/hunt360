// Rate limiter to prevent 429 errors
class RateLimiter {
    constructor(maxRequests = 10, windowMs = 60000) { // 10 requests per minute
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    async throttle() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...this.requests);
            const waitTime = this.windowMs - (now - oldestRequest);
            await this.sleep(waitTime);
            return this.throttle();
        }

        this.requests.push(now);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create a singleton instance
const rateLimiter = new RateLimiter(8, 60000); // 8 requests per minute to stay under limits

export default rateLimiter;
