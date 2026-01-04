import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectToDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test",(req,res)=>{
    res.send("Server is running..!!");
})

await connectToDB();

// socket.io setup
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"],
        credentials:true
    }
});

io.on("connection",(socket)=>{
    console.log("New user connected:",socket.id);

    socket.on("disconnect",()=>{
        console.log("User disconnected:",socket.id);
    })
})

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})