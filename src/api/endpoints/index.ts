import { Request, Response, Router } from "express";
import delayedTaskRouter from "./delayedTaskRoutes";
const { errors } = require('celebrate');

const router = Router();

router.use('/tasks', delayedTaskRouter)

router.use((req: Request, res: Response) => {
    res.send('Not found')
})

router.use(errors());

export default router 