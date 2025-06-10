import { listener } from "./tools/listener";
import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import http from "http";
import { Server } from "socket.io";
import {clerkMiddleware} from '@clerk/express'
import userRoutes from './routes/user'



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware())


app.use("/api/user",  userRoutes);
//listening all socket events here
listener(io);

app.listen(process.env.PORT, () => {
  console.log("Server started");
});
