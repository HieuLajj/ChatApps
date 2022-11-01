const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
// ket noi db
require('./models/db');
app.use(bodyParser.json({limit:"50mb"}));
app.use(cors());
app.use(morgan("common"));
const userRoute = require("./routes/user_route");
const chatRoute = require("./routes/chatRoutes")
const messageRoute = require("./routes/messageRoutes")
dotenv.config();

app.use(express.json());

//ROUTER
app.use("/laihieu/user",userRoute);
app.use("/laihieu/chat",chatRoute);
app.use("/laihieu/message",messageRoute);

app.listen(8000,()=>{
    console.log("Server is running...");
})