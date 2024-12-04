import { Router } from "express";
import { createNewUser, signIn, verifyEmail } from "src/controllers/auth";
import { Validate } from "src/middleware/Validate";
import { newUserSchema, verifyTokenSchema } from "src/utils/validationSchema";

//Router perfom like a middleware like a app (To easily read data from server side)
const authRouter = Router()

authRouter.post('/sign-up', Validate(newUserSchema), createNewUser)
authRouter.post('/verify',Validate(verifyTokenSchema) ,verifyEmail)
authRouter.post('/sign-in' ,signIn)



export default authRouter