import express from 'express'; 

import protectRoute from '../middlewares/protectRoute.js';
import { getLoggedInUserDetails, getUserDetails, addOrRemoveTweetFromBookmarks, getAllOtherUserDetails, followOrUnfollowUser } from '../controllers/userController.js'; 

const router = express.Router(); 


router.get('/logged-in-user-details', protectRoute, getLoggedInUserDetails); 
router.get('/user-details/:user_id', protectRoute, getUserDetails); 

router.get('/all-other-user-details', protectRoute, getAllOtherUserDetails); 

router.patch('/follow-or-unfollow/:user_id', protectRoute, followOrUnfollowUser);

router.patch('/add-or-remove-tweet-from-bookmarks/:tweet_id', protectRoute, addOrRemoveTweetFromBookmarks)


export default router; 