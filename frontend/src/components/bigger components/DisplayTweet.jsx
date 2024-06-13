import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { CiHeart, CiEdit, CiBookmark } from 'react-icons/ci'
import { FcLike } from 'react-icons/fc'
import { MdDelete } from 'react-icons/md';
import { IoBookmark } from 'react-icons/io5'

import { axiosTokenInstance } from '../../axios/axiosTokenIntsance'
import { logoutCleanUp } from '../../helpers/logoutCleanUp'

import { useDispatch, useSelector } from 'react-redux'
import { getTweetSliceRefresh } from '../../redux/tweetSlice'

import MiniAvatar from '../small components/MiniAvatar'


const DisplayTweet = ({currTweet, openEditATweet, setEditTweetContent, setOldTweetContent, setToBeEditedTweetId}) => {

    const loggedInUserDetails = useSelector(store => store.user.loggedInUserDetails); 
    const dispatch = useDispatch();

    const [liked, setLiked] = useState(currTweet?.likes?.includes(loggedInUserDetails?._id)); 
    const [likeCount, setLikeCount] = useState(currTweet?.likes?.length); 

    useEffect( () => {
        setLiked(currTweet?.likes?.includes(loggedInUserDetails?._id)); 
        setLikeCount(currTweet?.likes?.length); 
        setDisplayTime(getTweetCreationDisplayTime()); 
    }, [currTweet])

    const handleLikeOrDislike = async (tweet_id) => {
        try{
            if(liked) setLikeCount(likeCount-1); 
            else setLikeCount(likeCount+1); 
            
            setLiked(!liked); 

            const res = await axiosTokenInstance().patch(`${import.meta.env.VITE_BACKEND_URL}/api/tweet/like-or-dislike/${tweet_id}`); 

            // toast.success(res?.data?.message); 
            dispatch(getTweetSliceRefresh());
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
            const res = await axiosTokenInstance().delete(`${import.meta.env.VITE_BACKEND_URL}/api/tweet/${tweet_id}`); 
            toast.success(res?.data?.message); 
            dispatch(getTweetSliceRefresh()); 
        }
        catch(err){
            console.log(err); 
            if(err?.response?.data?.logout){
                logoutCleanUp(dispatch); 
                navigate('/'); 
            }
        }
    }

    const getTweetCreationDisplayTime = () => {

        // I am hard coding time logic for IST (Indian Standard Time) 
        const tweetCreatedOnDate = currTweet.createdAt.split('T')[0].split('-').reverse().map( (str) => parseInt(str));
        const tweetCreatedOnUTC = currTweet.createdAt.split('T')[1].split(':').map( (str) => parseInt(str));
        
        const now = new Date(); 
        const offSetHrs = 5; 
        const offSetMins = 30; 
        
        let tweetCreationLocalTimeHrsPart = tweetCreatedOnUTC[0] + offSetHrs; 
        let tweetCreationLocalTimeMinsPart = tweetCreatedOnUTC[1] + offSetMins; 

        if(Math.floor(tweetCreationLocalTimeMinsPart / 60) >= 1){
            tweetCreationLocalTimeHrsPart += Math.floor(tweetCreationLocalTimeMinsPart / 60); 
            tweetCreationLocalTimeMinsPart = tweetCreationLocalTimeMinsPart % 60; 
        }

        let tweetCreatedOnLocalDate1stPart = tweetCreatedOnDate[0];

        if(Math.floor(tweetCreationLocalTimeHrsPart / 24) >= 1){
            tweetCreatedOnLocalDate1stPart += 1; 
            tweetCreationLocalTimeHrsPart = tweetCreationLocalTimeHrsPart % 24; 
        }

        const tweetCreatedOnLocalDate = [tweetCreatedOnLocalDate1stPart, tweetCreatedOnDate[1], tweetCreatedOnDate[2]]; 
        const tweetCreatedOnLocalTime = [tweetCreationLocalTimeHrsPart, tweetCreationLocalTimeMinsPart, tweetCreatedOnUTC[2]]; 
        
        const currLocalDate = [now.getDate(), now.getMonth()+1, now.getFullYear()]; 
        const currLocalTime = [now.getHours(), now.getMinutes(), now.getSeconds()]; 

        let displayTime; 
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']; 
        if(tweetCreatedOnLocalDate[0] === currLocalDate[0]){
            if(tweetCreatedOnLocalTime[0] === currLocalTime[0]){
                if(tweetCreatedOnLocalTime[1] === currLocalTime[1]){
                    const timeDiffInSecs = currLocalTime[2] - tweetCreatedOnLocalTime[2];
                    if(timeDiffInSecs === 1){
                        displayTime = `${timeDiffInSecs}sec ago`; 
                    }
                    else{
                        displayTime = `${timeDiffInSecs}secs ago`; 
                    }
                }
                else{
                    const timeDiffInMins = currLocalTime[1] - tweetCreatedOnLocalTime[1]; 
                    if(timeDiffInMins === 1){
                        displayTime = `${timeDiffInMins}min ago`;	
                    }
                    else{
                        displayTime = `${timeDiffInMins}mins ago`;
                    }
                }
            }
            else{
                const timeDiffInHrs = currLocalTime[0] - tweetCreatedOnLocalTime[0]; 
                if(timeDiffInHrs === 1){
                    displayTime = `${timeDiffInHrs}hr ago`;	
                }
                else{
                    displayTime = `${timeDiffInHrs}hrs ago`; 
                }
            }
        }
        else{
            if(tweetCreatedOnLocalDate[0]%10 === 1 && tweetCreatedOnLocalDate[0] !== 11){
                displayTime = `${tweetCreatedOnLocalDate[0]}st ${months[tweetCreatedOnLocalDate[1]-1]} ${tweetCreatedOnLocalDate[2]}`; 
            }
            else if(tweetCreatedOnLocalDate[0]%10 === 2 && tweetCreatedOnLocalDate[0] !== 12){
                displayTime = `${tweetCreatedOnLocalDate[0]}nd ${months[tweetCreatedOnLocalDate[1]-1]} ${tweetCreatedOnLocalDate[2]}`; 
            }
            else if(tweetCreatedOnLocalDate[0]%10 === 3 && tweetCreatedOnLocalDate[0] !== 13){
                displayTime = `${tweetCreatedOnLocalDate[0]}rd ${months[tweetCreatedOnLocalDate[1]-1]} ${tweetCreatedOnLocalDate[2]}`; 
            }
            else{
                displayTime = `${tweetCreatedOnLocalDate[0]}th ${months[tweetCreatedOnLocalDate[1]-1]} ${tweetCreatedOnLocalDate[2]}`; 
            }
        }

        return displayTime; 
    }

    const [displayTime, setDisplayTime] = useState(getTweetCreationDisplayTime()); 

    const isLoggedInUserTweet = (loggedInUserDetails._id === currTweet?.userId._id); 
    const [isBookmarkedByUser, setIsBookMarkedByUser] = useState(loggedInUserDetails?.bookmarks?.includes(currTweet?._id)); 

    return (
        <div className='flex px-4 py-3 h-auto w-full border-b-[1px] border-gray-500'>
            <div>
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
                    <span className='text-white font-semibold py-2'> { currTweet?.userId?.name } </span>
                    <span className='text-gray-500 font-regular text-sm'> { `@${currTweet?.userId?.username}` } </span>
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