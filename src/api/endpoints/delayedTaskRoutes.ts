import { Request, Response, Router } from 'express';
import { delayedTaskService } from '../../application';
import { DelayedTask } from '../../domain/entities/DelayedTask';

const delayedTaskRouter = Router()

delayedTaskRouter.post('/delayedTask', async (req: Request, res: Response) => {
    const { message, time } = req.body

    const delayedTask = new DelayedTask(message, new Date(time))
    await delayedTaskService.scheduleTask(delayedTask)
    console.log('new task has been scheduled');

    res.status(200).send('task has been scheduled')
})


export default delayedTaskRouter 