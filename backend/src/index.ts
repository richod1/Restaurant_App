import express,{Request,Response} from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"


const app=express();
const port=3000;

app.use(cors())
app.use(express.json())


app.get("/test",async(req:Request,res:Response)=>{
    res.json({message:"Hello to ts express"})
})

app.use("/api/order/checkout/webhook",express.raw({type:"*/*"}))

app.get("/health",async(req:Request,res:Response)=>{
    res.send({message:"health Ok!"})
})

// connecting database ro sync server
mongoose.connect(process.env.MONGO_URL as string).then(()=>{
    console.log(`Database connected successfully`)

    // nesting server inside database
    app.listen(port,()=>{
        console.log(`Sever running on port :$port`)
    })
}).catch(err=>console.log(`database failed to connect :${err}`))