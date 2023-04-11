 import User from "../models/User";

 //read 
 export const getUser=async(req,res)=>{
    try{
       // grab id from req.params like query string we can grab id from that 
        //particular string
const{id}=req.params;
//use that particular id to grab the info of the user
const user=await User.findById(id);
//send back to the frontend all relevant info of user 
res.status(200).json(user);
    }
    catch(err){
        res.status(404).json({message:err.message});
    }
 }

 //grab all userfrnds related to id  that has been specified

 export const getUserFriends= async(req,res)=>{

    try{
        const{id}=req.params;
        const user=await User.findById(id);
        //we will use promise.all nd we will make multiple
        //api calls to db
        //grab each id that user has and we gonna do Uset.findby(id) and grab all the info from frnd's
        //id
        const friends=await Promise.all(
            user.friends.map((id)=>
                User.findById(id))
            );
    //we are gonna make sure that we format this in proper way for frontend
    //we will do frnds . map nd set up all the info that we need to send
        const formattedFriends=friends.map(
            ({_id,firstName,lastName,occupation,location,picturePath})=>{
                return {_id,firstName,lastName,occupation,location,picturePath};
            }
        );
        
    
        res.status(200).json(formattedFriends);
    }
    catch(err){

    }res.status(404).json({,message:referrerPolicy.message});

 }