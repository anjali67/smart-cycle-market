import { model, Schema ,  Document } from "mongoose";
import { compare, genSalt ,hash } from "bcrypt";
import { string } from "yup";

interface UserDocument extends Document {
    name:string
    password:string
    email:string
    verified:boolean,
    tokens:string[]
}

interface Methods {
    comparePassword(password:string):Promise<boolean>
}


const userSchema  = new Schema<UserDocument , {} , Methods>({
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    verified:{
        type:Boolean,
        default: false
    },
     tokens:[String]

},{timestamps:true})

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        const salt = await genSalt(10)
        this.password = await hash(this.password, salt)
    }
    next()
 })
 

userSchema.methods.comparePassword = async function (password) {
  return  await compare(password,this.password)
}

const UserModal = model("User",userSchema)
export default UserModal