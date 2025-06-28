import Redis from "ioredis";

let redisClient;

if (process.env.NODE_ENV === "test") {
  // 🧪 Mock client for testing environment
  redisClient = {
    on: () => {},
    get: async () => null,
    set: async () => {},
    del: async () => {},
    exists: async () => 0,
  };
} else {
  // ✅ Real Redis for development/production
  redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => Math.min(times * 50, 2000),
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected");
  });

  redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
  });
}

export default redisClient;
