import { Request, Response, Router } from 'express';
import { delayedTaskService } from '../../application';
import { DelayedTask } from '../../domain/entities/DelayedTask';
import { celebrate, Joi, Segments } from 'celebrate';

const delayedTaskRouter = Router()

type DelayedTaskDto = {
    message: string,
    time: Date
}

delayedTaskRouter.post('/delayedTask',
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            message: Joi.string().required(),
            time: Joi.date().required()
        })
    }), async (req: Request, res: Response) => {
        const { message, time } = req.body as DelayedTaskDto

        const delayedTask = new DelayedTask(message, new Date(time))
        await delayedTaskService.scheduleTask(delayedTask)
        console.log('new task has been scheduled');

        res.status(200).send('task has been scheduled')
    })


export default delayedTaskRouter 