import React from 'react' 
import { FaUser } from 'react-icons/fa' 


const Avatar = ({name, secureImageURL, height, width}) => {

    let avatarName = ""; 

    if(name){
        const splitName = name.split(" "); 
        if(splitName.length > 1){
            avatarName = splitName[0][0] + splitName[1][0]; 
        }
        else{
            avatarName = splitName[0][0]; 
        }
    }

    const randomBgColour = [
        'bg-sky-400',
        'bg-lime-400',
        'bg-green-400',
        'bg-emerald-400',
        'bg-purple-400',
    ]

    const randomNumber = Math.floor(Math.random() * 5);

    return(

        <div className="flex flex-col justify-center items-center select-none">
            {
                secureImageURL ? (
                    <img 
                        src={secureImageURL} 
                        alt="User Profile Pic" 
                        className='mt-4 mx-5 rounded-full overflow-hidden border-2 border-white'
                        height={height}
                        width={width}
                    />
                ) : name ? (
                        <div className={`mt-4 p-5 overflow-hidden h-[240px] w-[240px] rounded-full text-[140px] flex items-center justify-center font-serif ${randomBgColour[randomNumber]}`}>
                            {avatarName}
                        </div>
                    ) : (
                        <div className='mt-4 bg-white p-5 rounded-full'>
                            <FaUser className='text-[200px]' />
                        </div>
                    )
            }
        </div>
    )
} 


export default Avatar; 