import { Router } from "express";
import { createNewUser } from "src/controllers/auth";

//Router perfom like a middleware like a app (To easily read data from server side)
const authRouter = Router()

authRouter.post('/sign-up',createNewUser)

export default authRouter