import Redis from "ioredis";

const redis = new Redis({
  host: "127.0.0.1", // Change if using a remote Redis instance
  port: 6379,
  // password: 'your-redis-password'  // If Redis requires authentication
});

export default redis;
