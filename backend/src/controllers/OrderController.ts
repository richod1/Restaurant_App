
import Stripe from "stripe"
import {Request,Response} from "express"
import Order from "../models/order"
import Restaurant,{MenuItemType} from "../models/restaurant"


const STRIPE=new Stripe(process.env.STRIPE_API_KEY as string)
const FRONTEND_URL=process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET=process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders=async(req:Request,res:Response)=>{
    try{
        const orders=await Order.find({user:req.userId})
        .populate("restaurant")
        .populate("user")
        res.json(orders);

    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong"})

    }
};

type CheckSessionRequest={
    cartItems:{
        menuItemId:string;
        name:string;
        quantity:string;
    }[];
    deliveryDetails:{
        email:string;
        name:string;
        addressLine1:string;
        city:string;
    };
    restaurantId:string;
}

const stripeWebhookHandler=async(req:Request,res:Response)=>{
    let event;
    try{
        const sig=req.headers["stripe-signature"];
        event=STRIPE.webhooks.constructEvent(
            req.body,
            sig as string,
            STRIPE_ENDPOINT_SECRET
        )
    }catch(err:any){
        return res.status(400).send(`Webhook error :${err.message}`)
    }

    if(event.type==="checkout.session.completed"){
        const order=await Order.findById(event.data.object.metadata?.orderId);

        if(!order){
            return res.status(404).json({message:"Order not found!"})
        }

        order.totalAmount=event.data.object.amount_total;
        order.status="paid";
        await order.save();
    }

    res.status(200).send();
}