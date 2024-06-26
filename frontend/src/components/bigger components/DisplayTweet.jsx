import React from 'react'
import { useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'

import { CiHeart, CiEdit, CiBookmark } from 'react-icons/ci'
import { FcLike } from 'react-icons/fc'
import { MdDelete } from 'react-icons/md';
// import { IoBookmark } from 'react-icons/io5'

import { axiosTokenInstance } from '../../axios/axiosTokenIntsance'
import { logoutCleanUp } from '../../helpers/logoutCleanUp'
import { getTweetCreationDisplayTime } from '../../helpers/getTweetCreationDisplayTime'

import { useDispatch, useSelector } from 'react-redux'
import { setLikeOrDislike, deleteTweet } from '../../redux/tweetSlice'
import { decreaseTweetsCount } from '../../redux/userSlice'

import MiniAvatar from '../small components/MiniAvatar'
import { navigateToProfilePage } from '../../helpers/navigationUtils' 


const DisplayTweet = ({currTweet, displayTweetProps}) => {

    const {
        openEditATweet, 
        setEditTweetContent, 
        setOldTweetContent, 
        setToBeEditedTweetId
    } = displayTweetProps; 

    const loggedInUserDetails = useSelector(store => store?.user?.loggedInUserDetails); 
    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const liked = currTweet?.likes?.includes(loggedInUserDetails?._id); 
    const likeCount = currTweet?.likes?.length; 

    const handleLikeOrDislike = async (tweet_id) => {
        try{
            dispatch(setLikeOrDislike({
                tweetId : tweet_id, 
                loggedInUserId : loggedInUserDetails._id 
            })); 
            const res = await axiosTokenInstance().patch(`${import.meta.env.VITE_BACKEND_URL}/api/tweet/like-or-dislike/${tweet_id}`); 
            // toast.success(res?.data?.message); 
        }
        catch(err){
            console.log(err); 
            if(err?.response?.data?.logout){
                logoutCleanUp(dispatch); 
                navigate('/'); 
            }
        }
    }

    const editTweet = async (currTweet) => {
        openEditATweet(); 
        setToBeEditedTweetId(currTweet?._id); 
        setEditTweetContent(currTweet?.description); 
        setOldTweetContent(currTweet?.description); 
    }

    const deleteTweetHandler = async (tweet_id) => {
        try{
            dispatch(deleteTweet({
                tweetId : tweet_id, 
                loggedInUserId : loggedInUserDetails._id 
            })); 
            dispatch(decreaseTweetsCount()); 
            const res = await axiosTokenInstance().delete(`${import.meta.env.VITE_BACKEND_URL}/api/tweet/${tweet_id}`); 
            // toast.success(res?.data?.message); 
        }
        catch(err){
            console.log(err); 
            if(err?.response?.data?.logout){
                logoutCleanUp(dispatch); 
                navigate('/'); 
            }
        }
    }

    const displayTime = getTweetCreationDisplayTime(currTweet); 

    const isLoggedInUserTweet = (loggedInUserDetails._id === currTweet?.userId._id); 
    // const [isBookmarkedByUser, setIsBookMarkedByUser] = useState(loggedInUserDetails?.bookmarks?.includes(currTweet?._id)); 

    return (
        <div className='flex px-4 py-3 h-auto w-full border-b-[1px] border-gray-500'>
            <div onClick={ (e) => navigateToProfilePage(e, dispatch, navigate, currTweet.userId._id) } className='cursor-pointer h-[45px] w-[55px] rounded-full'>
                <MiniAvatar 
                    userId={currTweet?.userId?._id}
                    name={currTweet?.userId?.name}
                    secureImageURL={currTweet?.userId?.profile_pic}
                    height={45}
                    width={45}
                />
            </div>
            <div className='ml-2 flex flex-col w-full h-auto rounded-lg overflow-hidden'>
                <div> 
                    <span onClick={ (e) => navigateToProfilePage(e, dispatch, navigate, currTweet.userId._id) } className='cursor-pointer text-white font-semibold py-2'> { currTweet?.userId?.name } </span>
                    <span onClick={ (e) => navigateToProfilePage(e, dispatch, navigate, currTweet.userId._id) } className='cursor-pointer text-gray-500 font-regular text-sm'> { `@${currTweet?.userId?.username}` } </span>
                    <span className='text-gray-500'>  &#183; </span>
                    <span className='text-gray-500 text-sm'> {displayTime} </span>
                </div>
                <div className='py-1 text-white'>
                    {currTweet?.description} 
                </div>
                {   
                    currTweet?.image && 
                    <div className='w-full flex items-center justify-center border-[1px] border-gray-500 rounded-xl overflow-hidden mt-1'>
                        <img 
                            src={currTweet?.image}
                        />
                    </div>
                }
                <div className='h-[28px] flex items-center justify-start gap-2'>
                    <div className='w-[60px] flex justify-center'>
                        <button onClick={() => handleLikeOrDislike(currTweet?._id)} className='rounded-full h-[20px] w-[20px] mx-2 mt-[2px] flex items-center justify-center'>
                            {
                                liked && 
                                <FcLike />
                            }
                            {
                                !liked && 
                                <CiHeart className='inline text-lg mt-[2px] text-white cursor-pointer hover:text-red-500 rounded-full'/>    
                            }
                        </button>
                        <span className='text-white'> {likeCount} </span> 
                    </div>
                    <div className={`w-[40px] flex justify-center cursor-pointer ${!isLoggedInUserTweet && 'hidden'}`}>
                        <button onClick={ () => editTweet(currTweet) } className='rounded-full h-[24px] w-[24px] hover:bg-[#323333]/60'>
                            <CiEdit className='text-white text-lg rounded-full w-[22px] h-[24px] p-[2px]' />
                        </button>
                    </div>
                    {/*
                    <div className='w-[40px] flex justify-center cursor-pointer'>
                        <button className='rounded-full h-[24px] w-[24px] pl-[0.5px] hover:bg-[#323333]/60'>
                            {   
                                !isBookmarkedByUser && 
                                <CiBookmark className='text-white text-lg rounded-full w-[22px] h-[22px] px-[2px]' />
                            }
                            {
                                isBookmarkedByUser &&
                                <IoBookmark className='text-white text-lg rounded-full w-[22px] h-[22px] px-[2px]' />
                            }
                        </button>
                    </div>
                    */}
                    <div className={`w-[40px] flex justify-center cursor-pointer ${!isLoggedInUserTweet && 'hidden'}`}>
                        <button onClick={() => deleteTweetHandler(currTweet._id)} className='hover:bg-[#323333]/60 rounded-full h-[24px] w-[24px] pl-[1px]'>
                            <MdDelete className='text-white text-lg mt-[0px] rounded-full w-[22px] h-[24px] px-[2px]' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayTweet