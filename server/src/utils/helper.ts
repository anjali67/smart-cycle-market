import {Response} from "express"
const sendErrorRes = (res:Response , message:string, statusCode:number) => {
    res.status(statusCode).json({message})

}
export default sendErrorRes

