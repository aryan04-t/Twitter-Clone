import React, { useState, useEffect } from 'react' 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

import validateInputFields from '../helpers/validateInputFields' 


const SignUpPage = () => {

    const navigate = useNavigate(); 

    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 

    const [isEmailErrorTextInvisible, setIsEmailErrorTextInvisible] = useState(true);  
    const [emailErrorText, setEmailErrorText] = useState('Display Email Error Text'); 

    const [isNameErrorTextInvisible, setIsNameErrorTextInvisible] = useState(true);  
    const [nameErrorText, setNameErrorText] = useState('Display Name Error Text'); 


    const handleChange = (e) => {
        const value = e.target.value; 
        if(e.target.name === 'name'){
            validateInputFields('name', value, {
                setIsNameErrorTextInvisible,
                setNameErrorText
            }); 
            setName(value); 
        }
        if(e.target.name === 'email'){
            validateInputFields('email', value, {
                setIsEmailErrorTextInvisible,
                setEmailErrorText
            }); 
            setEmail(value); 
        }
    }

    const [isVerifyButtonDisabled, setIsVerifyButtonDisabled] = useState(true); 

    useEffect( () => {
        if(isEmailErrorTextInvisible && isNameErrorTextInvisible){
            setIsVerifyButtonDisabled(false); 
        }
        else{
            setIsVerifyButtonDisabled(true); 
        }
    }, [isEmailErrorTextInvisible, isNameErrorTextInvisible]); 


    const verifyEmail = (e) => {

        e.preventDefault(); 
        e.stopPropagation(); 

        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`, {
            email,
            name 
        })
        .then( (res) => {
            toast.success(res?.data?.message);
            navigate('/verify-email', {
                state : {
                    otp : res.data.otp 
                }
            }); 
        })
        .catch( (err) => {
            toast.error(err?.response?.data?.message);
            console.log(err); 
            navigate('/'); 
        })
    }


    return (
        <div className='h-full w-full flex flex-col items-center'>
            <div className='w-full flex justify-center items-center'>
                <h1 className='mt-10 h-[60px] w-[500px] text-3xl sm:text-4xl font-semibold text-white px-5 flex justify-start items-center'>
                    Create your account 
                </h1>
            </div>
            <form onSubmit={verifyEmail} className='flex flex-col items-center w-full'>
                <div className='w-full flex justify-center items-center'>
                    <label htmlFor='name' className='mt-10 pl-4 w-[500px] text-white h-10 text-2xl pr-6 flex items-center'>
                        Name
                    </label>
                </div>
                <div className='w-full flex justify-center items-center'>
                    <input 
                        name='name' 
                        type='text' 
                        id='name' 
                        value={name} 
                        onChange={handleChange} 
                        className={`mt-2 h-[50px] w-[500px] px-4 py-2 mx-5 rounded-md border-2 border-gray-500 bg-black outline-none text-white text-lg focus:border-[#1d9bf0] focus:border-[3px] ${isNameErrorTextInvisible ? '' : 'focus:border-red-500 border-red-500'}`}
                        placeholder='Enter your name here' 
                        required 
                    />
                </div>
                <div className='w-full flex justify-center items-center'>
                    <div className={`text-[15px] text-red-500 pl-2 pr-1 mx-5 font-mono rounded-md mt-2 w-[490px] ${isNameErrorTextInvisible && 'invisible'}`}>
                        {nameErrorText}
                    </div> 
                </div>
                <div className='w-full flex justify-center items-center'>
                    <label htmlFor='email' className='mt-5 pl-5 w-[500px] text-white h-10 text-2xl pr-6 flex items-center'>
                        G-mail
                    </label>
                </div>
                <div className='w-full flex justify-center items-center'>
                    <input 
                        name='email' 
                        type='text' 
                        id='email' 
                        value={email} 
                        onChange={handleChange} 
                        className={`mt-2 h-[50px] w-[500px] px-4 py-2 mx-5 rounded-md border-2 border-gray-500 bg-black outline-none focus:border-[#1d9bf0] focus:border-[3px] text-white text-lg ${isEmailErrorTextInvisible ? '' : 'focus:border-red-500 border-red-500'}`}
                        placeholder='Enter your e-mail here' 
                        required 
                    />
                </div>
                <div className='w-full flex justify-center items-center'>
                    <div className={`text-[15px] text-red-500 pl-2 pr-1 mx-5 font-mono rounded-md mt-2 w-[490px] ${isEmailErrorTextInvisible && 'invisible'}`}>
                        {emailErrorText}
                    </div>
                </div> 
                <div className='w-full flex justify-center items-center'>
                    <button disabled={isVerifyButtonDisabled} className={`mt-10 w-[280px] h-[50px] text-xl font-semibold rounded-full ${isVerifyButtonDisabled ? 'bg-gray-600' : 'bg-white hover:bg-[#1d9bf0] hover:text-white'}`}>
                        Verify Email 
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignUpPage