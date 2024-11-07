

export class DelayedTask {
    public readonly id: string
    public readonly message: string
    public readonly time: Date

    constructor(id: string, message: string, time: Date) {
        this.id = id
        this.message = message
        this.time = time
    }

}