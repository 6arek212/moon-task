import { ConsumeFromStreamType } from '../../domain/contracts/ConsumeFromStreamType';
import { DelayedTask } from '../../domain/entities/DelayedTask';
import { IDelayedTaskRepository } from '../../domain/interfaces/IDelayedTaskRepository';
import Redis from 'ioredis';

/**
 * this class handles the communication with redis streams
 */
export class RedisDelayedTaskRepository implements IDelayedTaskRepository {
    private readonly publishClient: Redis;
    private readonly consumerClient: Redis;

    constructor(port: number, host: string) {
        this.publishClient = new Redis({ port: port, host: host });
        this.consumerClient = new Redis({ port: port, host: host });
    }


    /**
     * 
     * @param id if provided will return entries that are pending for the consumer sending the command with IDs greater than the one provided 
     * @param blockTTL blocking tll, 0 to suspend the call till a new message arrives 
     * @returns 
     */
    async consumeFromStream({
        streamName,
        groupName,
        consumerId,
        count = 1,
        id = null,
        blockTTL = 5000
    }: ConsumeFromStreamType): Promise<DelayedTask[]> {
        id = id !== null ? id : '>'

        const streamsData = await this.consumerClient.xreadgroup('GROUP', groupName, consumerId, 'COUNT', count, 'BLOCK', blockTTL, 'STREAMS', streamName, id!)
        if (!streamsData)
            return []

        const streamsMessages = streamsData as [string, [string, string][]][]
        const result: DelayedTask[] = []

        for (const streamValues of streamsMessages) {
            const [streamN, messages] = streamValues;
            if (streamN !== streamName) continue;  // Skip if the stream name doesn't match
            // // Process each message in the stream
            for (const [messageId, messageData] of messages) {
                const jsonTask = JSON.parse(messageData[1])
                result.push(new DelayedTask(jsonTask['message'], new Date(jsonTask['time']), messageId))
            }
        }
        return result
    }

    async publishToStream(streamName: string, data: any, id?: string): Promise<string | null> {
        id = id || '*' // * for auto generate id
        return await this.publishClient.xadd(streamName, id, 'messageData', JSON.stringify(data))
    }

    async createStreamGroup(streamName: string, groupName: string): Promise<void> {
        try {
            await this.publishClient.xgroup("CREATE", streamName, groupName, "$", "MKSTREAM");
        } catch (error: any) {
            if (error instanceof Error && error.message.includes('BUSYGROUP Consumer Group name already exists')) {
                console.log(`consumer group '${groupName}' already exists on stream '${streamName}'`);
            }
            else
                console.error(`Error creating group '${groupName}' for stream '${streamName}',`, error);
        }
    }

    async ackMessage(streamName: string, groupName: string, id: string): Promise<void> {
        await this.publishClient.xack(streamName, groupName, id)
    }
}


