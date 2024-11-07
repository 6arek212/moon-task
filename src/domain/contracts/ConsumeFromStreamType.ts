

export type ConsumeFromStreamType = {
    groupName: string,
    consumerId: string,
    count: number,
    streamName: string,
    id?: string | null,
    blockTTL: number
}