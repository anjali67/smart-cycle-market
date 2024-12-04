import { connect } from "mongoose";

const uri = 'mongodb://localhost:27017/smart-cycle-market'
connect(uri).then(() => {
     console.log("db sucessfully created")
}).catch(err => {
     console.log(err.message)
})