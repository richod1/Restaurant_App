import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    auth0Id:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        reyuired:true,
    },
    addressLine1:{
        type:String,
    },
    city:{
        type:String,
    },
    country:{
        type:String,
    }
})

const User=mongoose.model("User",userSchema);

module.exports=User;