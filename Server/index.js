const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const https = require('https')
const fs = require('fs')
const { uuid } = require('uuidv4');
// ket noi db
require('./models/db');
const limiter = rateLimit({
    // 15 minutes
      windowMs: 15 * 60 * 1000,
    // limit each IP to 100 requests per windowMs
      max: 100
    });
app.use(limiter);
app.use(bodyParser.json({limit:"50mb"}));
app.use(helmet())
app.use(cors());
app.use(morgan("common"));
const userRoute = require("./routes/user_route");
const chatRoute = require("./routes/chatRoutes")
const messageRoute = require("./routes/messageRoutes")
const postRoute = require("./routes/postRoutes");
const path = require("path");
dotenv.config();

app.use(express.json());

//ROUTER
app.use("/laihieu/user",userRoute);
app.use("/laihieu/chat",chatRoute);
app.use("/laihieu/message",messageRoute);
app.use("/laihieu/post",postRoute)

app.get('/',(req,res)=>{
    res.json("trangchu")
})

// const server = https.createServer({
//     key: fs.readFileSync(path.join(__dirname,'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname,'cert', 'cert.pem'))
// },app)
const server = app.listen(8000,()=>{
    console.log("Server is running...");
})

const io = require("socket.io")(server)
if(io){
    console.log("ok")
}
io.on("connection",(socket)=>{
    let roomid = "";
    console.log('connected to socket.io'+socket.id)
    socket.on('message recieved',(data)=>{
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
        
        socket.broadcast.to(roomid).emit("message recieved",JSON.stringify(dulieusauchuyendoi))
    })
    socket.on("join chat", (room) => {
        roomid="";
        socket.join(room);
        roomid = room;
        console.log(roomid+"User Joined Room: " + room);
    });
})
