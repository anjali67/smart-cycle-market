import { RequestHandler } from "express";
import UserModal from "src/models/user";
import crypto from 'crypto'
import authVerificationTokenModal from "src/models/authVerificationToken";
import nodemailer from 'nodemailer'
import sendErrorRes from "src/utils/helper";
import jwt  from 'jsonwebtoken'

export const createNewUser : RequestHandler = async (req:any,res:any) => {
const {name,email,password} = req.body;
  const existingUser =  await UserModal.findOne({email})
  if(existingUser) 
     return  sendErrorRes(res, "Unauthorize request, email is alerady exist!",401)
  const user =  await UserModal.create({email,name,password})
  const token = crypto.randomBytes(36).toString('hex')
  await authVerificationTokenModal.create({owner: user._id,token})
  const link = `http://localhost:8000/verify?id=${user._id}&token=${token}`

  // Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "5f8d11f93a2c70",
    pass: "cf3ee911f15af7"
  }
});

await transport.sendMail({
  from:"verification@myapp.com",
  to:user.email,
  html:`<h1>Please click on <a href="${link}">this link</a> to verify your account.</h1>`

})
  res.send({message:"Please check your email"})   
}

export const verifyEmail : RequestHandler = async (req:any,res:any) => {
  const {id,token} = req.body
   
  const authToken =  await authVerificationTokenModal.findOne({owner:id})
  if(!authToken) return sendErrorRes(res,"unAuthorized request",403)
   const isMatched = await authToken.compareToken(token)
  if(!isMatched) return sendErrorRes(res,"unAuthorized request, Invalid token",403)

    await UserModal.findByIdAndUpdate(id,{verified:true})
    await authVerificationTokenModal.findByIdAndDelete(authToken._id)

    res.json({message:"Thanks for joining us , your email is verified sucessfully!"})


}


export const signIn : RequestHandler = async (req:any,res:any) => {
  const {email,password} = req.body

  const user = await UserModal.findOne({email})
  if(!user) return sendErrorRes(res,"Email/password is mismatch",403)
  
  const isMatched = await user.comparePassword(password)
  if(!isMatched) return sendErrorRes(res,"Email/password is mismatch",403)

  const payload = {id: user._id}
  
  const acessToken = jwt.sign(payload,"secret",{
    expiresIn:"15m"
  })

  const refreshToken = jwt.sign(payload,"secret")

  if(!user.tokens) user.tokens = [refreshToken]
  else user.tokens.push(refreshToken)

  await user.save()

  res.json({
    profile:{
      id: user._id,
      email:user.email,
      name:user.name,
      verified:user.verified
    },
    tokens: {refreshToken:refreshToken,acessToken:acessToken}
  })


}





