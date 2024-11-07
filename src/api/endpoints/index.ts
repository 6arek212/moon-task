import { Request, Response, Router } from "express";
import delayedTaskRouter from "./delayedTaskRoutes";

const router = Router();

router.use('/tasks', delayedTaskRouter)

router.use((req: Request, res: Response) => {
    res.send('Not found')
})


export default router 