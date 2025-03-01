import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    user:{
        id:{
            type:String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    payment: {
        type: String,
        required: true,
    },
    products:[{
        id:{
            type: Number,
            required: true,
        },
        name:{
            type: String,
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        imagesUrls: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    status:{
        type: String,
        required: true,
    },
},
{
    timestamps: true, 
})

export default mongoose.model('Order', OrderSchema)