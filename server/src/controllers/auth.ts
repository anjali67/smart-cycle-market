import { RequestHandler } from "express";
import UserModal from "src/models/user";
import crypto from 'crypto'
import authVerificationTokenModal from "src/models/authVerificationToken";
import nodemailer from 'nodemailer'

export const createNewUser : RequestHandler = async (req:any,res:any) => {

//Read incoming data like:name,email and password
// Validate if the data is ok or not.
// Send error if not.
// Check if we already have account with same user
// send error if yes yes otherwise create new accound and save user inside DB.
// Generate and store verification token.
// Send vverification link with token to register email
// send message back to email 

const {name,email,password} = req.body;
if(!name) return res.status(422).json({message: "Name is missing!"})
if(!email) return res.status(422).json({message: "Email is missing!"})
if(!password) return res.status(422).json({message: "Password is missing!"})

  const existingUser =  await UserModal.findOne({email})
  if(existingUser) 
     return res.status(401).json({message:"Unauthorize request, email is alerady exist!"})
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





