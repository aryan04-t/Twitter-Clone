import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { axiosTokenInstance } from '../axios/axiosTokenIntsance'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setLoggedInUserDetails } from '../redux/userSlice'
import { logoutCleanUp } from '../helpers/logoutCleanUp'


export const useGetLoggedInUserDetails = () => {
        
    const navigate = useNavigate(); 
    const dispatch = useDispatch(); 

    const fetchLoggedInUserDetails = () => {
        axiosTokenInstance().get(`${import.meta.env.VITE_BACKEND_URL}/api/user/logged-in-user-details`)
        .then( (response) => {
            dispatch(setLoggedInUserDetails(response?.data?.data)); 
        }) 
        .catch( (err) => {
            toast.error(err?.response?.data?.message); 
            console.log(err); 
            if(err?.response?.data?.logout){
                logoutCleanUp(dispatch); 
                navigate('/'); 
            }
        })
    }

    useEffect( () => {
        if(!localStorage.getItem('jwt')){ 
            toast.error("Unauthenticated Access Attempt \n Access Denied"); 
            logoutCleanUp(dispatch);  
            navigate('/'); 
        }
        else{
            fetchLoggedInUserDetails(); 
        }
    }, [])
}