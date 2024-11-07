import { configs } from "../configs";
import { redisDelayedTaskRepository } from "../infrastructure/redis";
import { IDelayedTaskService } from "./interfaces/IDelayedTaskService";
import { DelayedTaskService } from "./services/DelayedTaskService";



// services
const delayedTaskService: IDelayedTaskService = new DelayedTaskService(redisDelayedTaskRepository, configs.STREAM_KEY)


export const initApplication = async () => {

    // insure that stream group is created
    await delayedTaskService.init()
}

export {
    delayedTaskService
}