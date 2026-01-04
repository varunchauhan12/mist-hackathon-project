import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDB=async ()=>{
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/test');
}

connectToDB()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:",err);
})

export default connectToDB;
