import { configs } from "../../configs";
import { DelayedTask } from "../../domain/entities/DelayedTask";
import { IDelayedTaskRepository } from "../../domain/interfaces/IDelayedTaskRepository";
import { IDelayedTaskService } from "../interfaces/IDelayedTaskService";


export class DelayedTaskService implements IDelayedTaskService {
    private readonly repository: IDelayedTaskRepository
    private readonly streamKey: string

    constructor(repository: IDelayedTaskRepository, streamKey: string) {
        this.repository = repository;
        this.streamKey = streamKey

        // run background jobs

    }

    public async init() {
        await this.repository.createStreamGroup(configs.STREAM_KEY, configs.STREAM_CONSUMER_GROUP_NAME)

        // handle old tasks first
        await this.consumeNonAcked()
        this.subscribeToStream()
    }

    /**
     * publish new task to the stream
     * @param delayedTask 
     */
    public async scheduleTask(delayedTask: DelayedTask) {
        await this.repository.publishToStream(this.streamKey, delayedTask)
    }

    /**
     * consume and handle non acknowledge tasks from stream
     */
    private async consumeNonAcked() {
        // this will read messages from history which are still in pending state
        var current_id: string | undefined = '0'
        var count = 0

        while (current_id) {

            const tasks = await this.repository.consumeFromStream({
                streamName: configs.STREAM_KEY,
                groupName: configs.STREAM_CONSUMER_GROUP_NAME,
                consumerId: configs.APP_ID,
                count: 100,
                id: current_id,
                blockTTL: 3000
            })

            this.handleConsumedTasks(tasks)
            current_id = tasks.at(-1)?.id
            count += tasks.length
        }

        console.log(`scheduled ${count} pending messages`);
    }

    /**
     * subscribe to stream for new messages
     */
    private async subscribeToStream() {
        console.log('subscribe to stream');

        while (true) {
            var tasks = await this.repository.consumeFromStream({
                groupName: configs.STREAM_CONSUMER_GROUP_NAME,
                consumerId: configs.APP_ID,
                count: 1,
                streamName: configs.STREAM_KEY,
                blockTTL: 0 // wait unit there is a new message
            })

            this.handleConsumedTasks(tasks)
        }
    }

    /**
     * handle consumed messages from redis stream and schedule tasks
     * @param tasks 
     */
    private async handleConsumedTasks(tasks: DelayedTask[]) {
        for (const delayedTask of tasks) {
            const runAfter = delayedTask.time.getTime() - Date.now()

            setTimeout(async () => {
                console.log(delayedTask.message)
                await this.repository.ackMessage(configs.STREAM_KEY, configs.STREAM_CONSUMER_GROUP_NAME, delayedTask.id)
            }, runAfter)
        }
    }
}
