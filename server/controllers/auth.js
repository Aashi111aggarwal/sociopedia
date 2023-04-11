import bcrypt from "bcrypt"; //encrypt password
import jwt from "jsonwebtoken"; // this will guve a way to send user a web token that they can use for authorization 
import User from "../models/User.js"

//register user

export const register=async(req,res)=>{
    try{
        const{
            firstname,
            lastname,
            email,
            password,
            picturepath,
            friends,
            location,
            occupation
        }=req.body;
const salt=await bcrypt.genSalt();
const passwordhash=await bcrypt.hash(password,salt);
 // we are gonna encrypt the password then we will save it
 //then after we save it when user tries to log in, password will be provided
 // we will solve that again and checjk if its correct one and we will guve them json web token

const newUser= new User({
    firstname,
    lastname,
    email,
    password,
    picturepath,
    friends,
    location,
    occupation,
    viewedProfile:Math.floor(Math.random()*10000),
    impressions:Math.floor(Math.random()*10000),

});
const saveduser=await newUser.save();
res.status(201).json(saveduser);
    } catch(err){
        res.status(500).json({error:err.message});
    }
};

//****log in  */
 export const login =async(req,res)=>{
    try{
        //grabbing email and password when user
        // tries to login
const{email,password}=req.body;
//we are using mongoose to try to find one that has this 
//specified email and will bring back all the user info here

const user= await User.findOne({email:email});
// if user cannot be found 
if(!user)return res.status(400).json({msg:"user does not exist"});
//if email found then we will match password
//using bcrypt to compare password they just sent and password stored in user database 
//both gonna use same salt and compare whether both has same hash or not

const isMatch= await bcrypt.compare(password,user.password);
if(!isMatch) return res.status(400).json({msg:"invalid credentials"});

/*A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.
 JWTs are often used for authentication and authorization purposes in web applications.

A JWT consists of three parts separated by dots: a header, a payload, and a signature. 
The header contains information about the type of token and the cryptographic algorithm used to sign the token. 
The payload contains the claims, which are statements about an entity (typically, the user) and additional metadata. 
The signature is created by taking the encoded header, the encoded payload, a secret key, and a specified cryptographic algorithm, 
and signing them to produce a unique string that can be used to verify the authenticity of the token.

Once a JWT is generated on the server, it can be sent to the client, 
which can store it in a cookie or in local storage. The client can then send the JWT to 
the server with each subsequent request, usually in the Authorization header of the HTTP request. 
The server can then decode the JWT, verify its signature, and use the claims contained in the payload 
to authenticate and authorize the request.*/
// using jwt, we gonna sign this with a id 
//and pass in secret string
//jwt_secret string stored in env file
// generates a JSON Web Token (JWT) using the jwt.
//sign() method from the jsonwebtoken library.

//the JWT payload is an object that contains the id property set to the _id field of a user object.

//the second argument to jwt.sign() is a string representing the secret used to sign the token. In this code snippet,
// it is being read from the JWT_SECRET environment variable.

//The resulting JWT can be used to authenticate
 //subsequent requests from the client, as it contains information that allows the server to identify the user. /
const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
//we gonna delete the entered password so it dont get sent to frontend
delete user.password;
res.status(200).json({token,user});
    }
    catch(err){
        res.status(500).json({error:err.message});

    }
 }