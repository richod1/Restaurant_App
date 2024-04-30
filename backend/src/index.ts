import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";


const app=express();
const port=7000;

app.use(cors())
app.use(express.json())


app.get("/test",async(req:Request,res:Response)=>{
    res.json({message:"Hello to ts express"})
})

app.use("/api/order/checkout/webhook",express.raw({type:"*/*"}))

app.get("/health",async(req:Request,res:Response)=>{
    res.send({message:"health Ok!"})
})

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);


// connecting database ro sync server
mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`).then(()=>{
    console.log(`Database connected successfully`)

    // nesting server inside database
    app.listen(port,()=>{
        console.log(`Sever running on port :${port}`)
    })
}).catch(err=>console.log(`database failed to connect :${err}`))

