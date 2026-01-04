import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:100,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,
        select:false
    },
    role:{
        type:String,
        enum:['victim','rescue','logistics'],
        default:'victim',
        required:true,
        lowercase:true,
    },
    lastLocation:{
        lat:{
            type:Number,
            required:true
        },
        lng:{
            type:Number,
            required:true
        },
        updatedAt:{
            type:Date,
            default:Date.now
        }
    },
    refreshTokens:[
        {
            token:{
                type:String,
                required:true,
            },
            createdAt:{
                type:Date,
                default:Date.now,
                expires:7*24*60*60 // 7 days
            }
        }
    ]
},{timestamps:true});

userSchema.index({'refreshTokens.token':1});

const User=mongoose.model('User',userSchema);
export default User;