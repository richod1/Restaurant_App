import express,{Request,Response} from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import {v2 as cloudinary} from "cloudinary"
import MyRestaurant from "./routes/MyRestaurantRoute"
import orderRoute from "./routes/OrderRoute"
import MyUserRoute from "./routes/MyUserRoutes"
import restaurantRoute from "./routes/RestaurantRoute"

const app=express();
const port=3000;

app.use(cors())
app.use(express.json())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.get("/test",async(req:Request,res:Response)=>{
    res.json({message:"Hello to ts express"})
})

app.use("/api/order/checkout/webhook",express.raw({type:"*/*"}))

app.get("/health",async(req:Request,res:Response)=>{
    res.send({message:"health Ok!"})
})

// endpoints
app.use("/api/my/user", MyUserRoute);
app.use("/api/my/restaurant", MyRestaurant);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

// connecting database ro sync server
mongoose.connect(process.env.MONGO_URL as string).then(()=>{
    console.log(`Database connected successfully`)

    // nesting server inside database
    app.listen(port,()=>{
        console.log(`Sever running on port :$port`)
    })
}).catch(err=>console.log(`database failed to connect :${err}`))