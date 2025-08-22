// Simple caching mechanism for API responses
class APICache {
    constructor(ttl = 300000) { // 5 minutes TTL
        this.cache = new Map();
        this.ttl = ttl;
    }

    generateKey(params) {
        return JSON.stringify(params);
    }

    get(params) {
        const key = this.generateKey(params);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            return cached.data;
        }
        
        // Remove expired cache
        this.cache.delete(key);
        return null;
    }

    set(params, data) {
        const key = this.generateKey(params);
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clear() {
        this.cache.clear();
    }
}

const apiCache = new APICache(300000); // 5 minutes cache

export default apiCache;
