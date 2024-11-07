import { configs } from "../../configs";
import { RedisDelayedTaskRepository } from "./delayedTaskRepository";

const redisDelayedTaskRepository = new RedisDelayedTaskRepository(configs.REDIS_PORT, configs.REDIS_HOST)

export {
    redisDelayedTaskRepository
};
