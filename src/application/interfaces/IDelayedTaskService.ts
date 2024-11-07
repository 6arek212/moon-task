import { DelayedTask } from "../../domain/entities/DelayedTask";


export interface IDelayedTaskService {
    scheduleTask(delayedTask: DelayedTask): Promise<void>
    init(): Promise<void>
}