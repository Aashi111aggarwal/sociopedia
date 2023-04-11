import express from "express";
//importing controllers
import {
    getUser,
    getUserFriends,
    addRemoveFriend,

}from "../controllers/user.js"

import {verifyToken} from "../middleware/auth.js"

const router=express.Router();

//read routes represent routes to grab info we arent actually 
//saving anything to the db or updating anything in db

// *******read********
//since we created router in index.js file with users if
//if user or frontend is sending a particular user id over 
//here "/:id" grab this id and call our db with this partcular
//id. this is how we do a query strings from frotend thats we call
//query string string thst will grab a pareticular id
router.get("/:id",verifyToken,getUser);
//this will basically just grab the user frnds
//if we need to call this separately

router.get("/:id/friends",verifyToken,getUserFriends);

// update
//we use patch here as it is update function
//we will pass current user's id who logged in and 
//friend id who want to add or remove
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);

export default router;