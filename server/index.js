import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import {register }from "./controllers/auth.js";
//configurations

//The __filename in the Node.js returns 
//the filename of the code which is executed.
// It gives the absolute path of the code file.
//The import. meta meta-property exposes context-specific metadata to a JavaScript module. It contains information
// about the module, such as the module's URL
const __filename=fileURLToPath(import.meta.url);
//__dirname is an environment variable that tells you the absolute path of the directory
// containing the currently executing file.
const __dirname=path.dirname(__filename);

//DotEnv is a lightweight npm package that automatically loads environment
// variables from a .env file into the process.env 
//object. To use DotEnv, first install it using the command: npm i dotenv . Then in your app, require and configure the package like this: require('dotenv').config()
dotenv.config();

const app= express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

//filestorage
//to store file which will be uploaded on website in "public/assets" folder
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});

const upload=multer({storage});
//**********ROUTES WITH FILES************
//The app.post() function routes the HTTP POST 
//requests to the specified path with the specified 
//callback functions. 

app.post("/auth/register",upload.single("picture"),register);
//mongoose setup

//ROUTES*************
//this will help to keep file organised
app.use("/auth",authRoutes);
const PORT= process.env.PORT||6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
  app.listen(PORT,()=>console.log(`Server Port:${PORT}`));  
})
.catch((error)=>{
    console.log(`${error}did not connect`);
})

