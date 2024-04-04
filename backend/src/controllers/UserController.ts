import {Request,Response} from "express"
import User from "../models/user"


const getCurrentUser=async(req:Request,res:Response)=>{
    try{
        const currentUser=await User.findOne({_id:req.userId})
        if(!currentUser){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(currentUser)

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong!"})

    }
}


const createCurrentUser=async(req:Request,res:Response)=>{
    try{
        const {auth0Id}=req.body;
        const existingUser=await User.findOne({auth0Id})
        if(existingUser){
            return res.status(409).json({message:"User with id already exist"})
        }

        const newUser=new User(req.body);
        await newUser.save();

        res.status(201).json(newUser.toObject())

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong"})
    }
}

const udateCurrentUser=async(req:Request,res:Response)=>{
    try{
        const {name,addressLine1,country,city}=req.body;
        const user=await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        // list user object
        user.name=name;
        user.addressLine1=addressLine1;
        user.city=city;
        user.country=country;

        await user.save();

        res.send(user);

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Error udating user"})
    }
}

export default{
    getCurrentUser,
    createCurrentUser,
    udateCurrentUser,
}