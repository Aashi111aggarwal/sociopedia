import jwt from 'jsonwebtoken';
//for middleware we use next function so next one will proceed
//to next step it will help the function to continue
export const verifyToken= async(req,res,next)=>{
try{
    //from the req from the frontend we are grabbing the 
    //authorization header thats where the token will be set on frontend 
    //fronted will be setting this so that we can grab it in bacckend through this key
let token= req.header("Authorization");

if(!token){
    return res.status(403).send("access denied");
}

//we want token to start with bearer=>this will be set on the
//frontend  ,gonna take everything from right side of bearer , token will be placed after
//it to verify=>slice func
if(token.startsWith("Bearer")){
    token=token.slice(7,token.length).trimLeft();
}/*The code you provided is verifying and decoding a JWT token using the jwt.verify() method and setting the decoded information to the req.user property.

jwt.verify() takes in two arguments: the token to verify and the secret key used to sign the token. If the token is valid, jwt.verify() returns an object containing the decoded payload, otherwise it throws an error.

In the code you provided, verified will contain the decoded payload if the token is valid. Then, req.user is set to the verified object, which can be used in subsequent middleware functions or routes to access the user information contained in the JWT payload.




*/
const verified= jwt.verify(token,process.env.JWT_SECRET);
req.user=verified;
next();
}
catch(err){
    res.status(500).json({error:err.message})
}
}