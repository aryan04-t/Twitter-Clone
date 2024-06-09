import React from 'react'

import { HiOutlineUser } from "react-icons/hi2" 
import { GoHomeFill, GoBell } from "react-icons/go"  
import { IoSearchOutline, IoBookmarkOutline, IoLogOutOutline } from "react-icons/io5" 

import Avatar from './Avatar'

import TwitterLogo from '../assets/logo.png'
import AddPostButton from './AddPostButton'


const LeftSideBar = () => {

    const iconCSS = 'w-[28px] h-[28px] text-white '; 
    const iconLabelCSS = 'hidden xl:flex items-center text-white px-3'; 
    const containerOfIconAndLogo = 'flex h-full w-fit mx-auto xl:ml-5 my-2 hover:bg-[#323333]/60 p-2 rounded-full select-none '; 
    const row = 'w-full rounded-full cursor-pointer'; 

    return (
        
        <div className='hidden min-[500px]:flex w-[70px] max-w-[70px] h-full flex-col justify-between xl:min-w-[270px]'>
            
            <div>

                <div className='rounded-full bg-black h-[40px] w-[40px] overflow-hidden cursor-pointer hover:bg-[#323333]/60 my-4 mx-auto xl:ml-6'>
                    <img 
                        src={TwitterLogo} 
                        alt='twitter-log' 
                        height={40} 
                        width={40} 
                    />
                </div>

                <div>
                    <div className={row}>
                        <div className={containerOfIconAndLogo}>
                            <div>
                                <GoHomeFill className={iconCSS} />
                            </div>
                            <div className={iconLabelCSS}>
                                Home
                            </div>
                        </div>
                    </div>
                    <div className={row}>
                        <div className={containerOfIconAndLogo}>
                            <div>
                                <IoSearchOutline className={iconCSS} /> 
                            </div>
                            <div className={iconLabelCSS}>
                                Explore 
                            </div>
                        </div>
                    </div>
                    <div className={row}>
                        <div className={containerOfIconAndLogo}>
                            <div>
                                <GoBell className={iconCSS} /> 
                            </div>
                            <div className={iconLabelCSS}>
                                Notification 
                            </div>
                        </div>
                    </div>
                    <div className={row}>
                        <div className={containerOfIconAndLogo}>
                            <div>
                                <HiOutlineUser className={iconCSS} /> 
                            </div>
                            <div className={iconLabelCSS}>
                                Proile 
                            </div>
                        </div>
                    </div>
                    <div className={row}>
                        <div className={containerOfIconAndLogo}>
                            <div>
                                <IoBookmarkOutline className={iconCSS} /> 
                            </div>
                            <div className={iconLabelCSS}>
                                Bookmarks 
                            </div>
                        </div>
                    </div>
                    <div className={row}>
                        <div className={containerOfIconAndLogo + 'hover:bg-red-600'}>
                            <div>
                                <IoLogOutOutline className={iconCSS  + 'rotate-180'} /> 
                            </div>
                            <div className={iconLabelCSS}>
                                Logout 
                            </div>
                        </div>
                    </div>
                </div>

                <button className='hidden xl:flex justify-center items-center bg-[#1d9bf0] h-[50px] w-[220px] hover:bg-blue-500 py-3 px-[96px] mt-2 rounded-full ml-4 overflow-hidden'>
                    <p className='text-white font-bold text-lg'> Post </p> 
                </button>

                <AddPostButton CSS={'xl:hidden h-[40px] w-[40px] bg-blue-500 rounded-full shadow-[0px_0px_5px_1px_rgba(247,247,247,1)] overflow-hidden my-4 mx-auto xl:ml-6 flex items-center justify-center'} />
        
            </div>
            
            <div className='flex xl:px-4 xl:py-2 xl:h-[65px] xl:w-[240px] rounded-full cursor-pointer select-none hover:bg-[#323333]/60 mx-auto xl:ml-4 mb-3'> 
                <Avatar heightVal={45} widthVal={45} /> 
                <div className='hidden ml-1 xl:ml-3 xl:flex xl:flex-col'> 
                    <h3 className='text-white font-semibold p-0 m-0'> Aryan Tomar </h3>
                    <p className='text-gray-500 text-md'> @aryan04-t </p>
                </div> 
            </div> 
        </div>
    )
}

export default LeftSideBar