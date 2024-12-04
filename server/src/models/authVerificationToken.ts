import { compare, genSalt } from "bcrypt";
import { hash } from "bcrypt";
import { model, Schema , Document} from "mongoose";

interface AuthVerificationDocument extends Document {
   owner:Schema.Types.ObjectId
   token:string
   createdAt:Date
}

interface Methods {
   comparePassword(password:string):Promise<boolean>
}

interface Methods {
   compareToken(token:string):Promise<boolean>
}

 const schema = new Schema<AuthVerificationDocument , {} ,  Methods>({
     owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
     },
    token:{
        type:String,
        required:true
     },
     createdAt:{
        type:Date,
        expires: 86400, //24 hours  
        default:Date.now()
     }     
})


schema.pre('save', async function(next) {
   if(this.isModified('token')) {
       const salt = await genSalt(10)
       this.token = await hash(this.token,salt)
   }
   next()
})

schema.methods.compareToken = async function (token:string) {
return  await compare(token,this.token)
}

const authVerificationTokenModal = model("authVerificationToken",schema)
export default authVerificationTokenModal