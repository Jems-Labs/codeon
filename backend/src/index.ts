const express = require("express");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();
const http = require("http");
const {Server} = require("socket.io");



const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());


app.listen(process.env.PORT, ()=>{console.log("Server started")})