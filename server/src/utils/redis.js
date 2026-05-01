const Redis = require('ioredis');

let redisClient = null;
let memoryCache = new Map();
let useMemoryFallback = false;

const initRedis = () => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.log('⚠️  No REDIS_URL configured. Using in-memory cache fallback.');
    useMemoryFallback = true;
    return;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
      lazyConnect: true,
    });

    redisClient.on('connect', () => {
      console.log('✅ Redis connected');
      useMemoryFallback = false;
    });

    redisClient.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
      console.log('⚠️  Falling back to in-memory cache');
      useMemoryFallback = true;
    });

    redisClient.connect().catch(() => {
      useMemoryFallback = true;
    });
  } catch (err) {
    console.log('⚠️  Redis initialization failed. Using in-memory cache fallback.');
    useMemoryFallback = true;
  }
};

const cache = {
  async get(key) {
    if (useMemoryFallback) {
      const item = memoryCache.get(key);
      if (!item) return null;
      if (item.expiry && Date.now() > item.expiry) {
        memoryCache.delete(key);
        return null;
      }
      return item.value;
    }
    try {
      return await redisClient.get(key);
    } catch {
      const item = memoryCache.get(key);
      return item?.value || null;
    }
  },

  async set(key, value, ttlSeconds = 3600) {
    if (useMemoryFallback) {
      memoryCache.set(key, {
        value,
        expiry: Date.now() + ttlSeconds * 1000,
      });
      return;
    }
    try {
      await redisClient.set(key, value, 'EX', ttlSeconds);
    } catch {
      memoryCache.set(key, {
        value,
        expiry: Date.now() + ttlSeconds * 1000,
      });
    }
  },

  async del(key) {
    if (useMemoryFallback) {
      memoryCache.delete(key);
      return;
    }
    try {
      await redisClient.del(key);
    } catch {
      memoryCache.delete(key);
    }
  },
};

module.exports = { initRedis, cache };
