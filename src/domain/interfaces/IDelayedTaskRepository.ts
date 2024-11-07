import { ConsumeFromStreamType } from "../contracts/ConsumeFromStreamType"
import { DelayedTask } from "../entities/DelayedTask"


export interface IDelayedTaskRepository {
    createStreamGroup(streamName: string, groupName: string): Promise<void>
    ackMessage(streamName: string, groupName: string, id: string): Promise<void>
    publishToStream(streamName: string, data: any, id?: string): Promise<string | null>
    consumeFromStream({ groupName, consumerId, count, streamName, id, blockTTL }: ConsumeFromStreamType): Promise<DelayedTask[]>
}