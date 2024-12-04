import { isValidObjectId } from 'mongoose';
import * as yup from 'yup'

const myEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


yup.addMethod(yup.string, 'email', function validateEmail(message) {
    return this.matches(myEmailRegex, {
      message,
      name: 'email',
      excludeEmptyString: true,
    });
  });

export const newUserSchema = yup.object({
    name:yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup.string().required("Password is required").min(8,"Password should be minimum 8 character")
})



export const verifyTokenSchema = yup.object({
  id:yup.string().test({
    name:"valid-id",
    message:"Invalid user id",
    test:(value) => {
       return isValidObjectId(value)
    }
  }),
  token: yup.string().required("Token is missing")
})