const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { uuid } = require('uuidv4');
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

app.get('/',(req,res)=>{
    res.json("trangchu")
})

const server = app.listen(8000,()=>{
    console.log("Server is running...");
})

const io = require("socket.io")(server)
if(io){
    console.log("ok")
}
io.on("connection",(socket)=>{
    console.log('connected to socket.io'+socket.id)
    socket.on('data',(data)=>{
        let obj = JSON.parse(data);
        let dulieusauchuyendoi ={
            _id: uuid(),
            text : obj[0].text,
            createdAt : obj[0].createdAt,
            user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
            }
        }

        socket.emit("message recieved",JSON.stringify(dulieusauchuyendoi))
    })
})
