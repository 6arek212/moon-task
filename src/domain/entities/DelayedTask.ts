

export class DelayedTask {
    public readonly id?: string
    public readonly message: string
    public readonly time: Date

    constructor(message: string, time: Date, id?: string) {
        this.id = id
        this.message = message
        this.time = time
    }

}