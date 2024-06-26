import nodemailer from 'nodemailer' 
import bcryptjs from 'bcryptjs'; 
import jwt from 'jsonwebtoken'

import userModel from '../models/userModel.js'; 


export const validateNonExistenceOfEmailInDB = async (req, res) => {
    try{
        const {email} = req.body; 
        
        const checkEmail = await userModel.findOne({email}); 

        if(checkEmail){
            
            console.log('This email already has an account linked to it, this email cannot be used for creating a new account'); 

            return res.status(400).json({
                message : "This email already has an account linked to it, this email cannot be used for creating a new account",
                error : true 
            }); 
        }
        
        return res.status(200).json({
            message : 'Succesfully validated non-existence of email in database', 
            success : true 
        }); 
    }
    catch(err){
        console.log(`Error occured in authController while validating non-existence of user's email in database: ${err.message}`); 
        return res.status(500).json({
            message : 'Internal server error', 
            error : true
        }); 
    }
}


export const sendOTP = async (req, res) => {
    try{
        const {email, name} = req.body; 
        const otp = `${Math.floor(100000 + Math.random() * 900000)}` 

        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.SENDER_EMAIL}`,
                pass: `${process.env.SENDER_EMAIL_APP_PASSWORD}`
            }
        });

        const mailDetails = {
            from: `${process.env.SENDER_EMAIL}`,
            to: email,
            subject: 'Twitter Clone OTP Verification',
            html: 
                `   
                     <div style="background-color: black; border-radius: 10px; width: 290px; height:290px;">
                        <div>
                            <h1 style="color: white; text-align: center; margin-bottom: 10px; padding-top: 38px;"> Suppp!!! </h1>
                            <h1 style="color: white; margin-bottom: 30px; margin-top: 0px; padding: 0px; text-align: center; font-family: sans; color: #23c560;"> ${name} </h1>
                            <h2 style="color: white; text-align: center; margin-bottom: 10px;"> Here's your OTP for verifying your G-mail </h2>
                            <h1 style="color: #1d9bf0; text-align: center; margin-top: 10px;"> ${otp} </h1>
                        </div>
                    <div>
                `
        };

        mailTransporter.sendMail(mailDetails, (err, data) => {
            if(err){
                console.log(err);
                res.status(500).json({
                    message : 'OTP sending process failed due to internal server error',
                    success : false 
                });
            }
            else{
                res.status(200).json({
                    message : 'OTP sent successfully on given G-mail',
                    success : true,
                    otp
                })
            }
        });
    }
    catch(err){
        console.log(`Error occured while sending email: ${err.message}`); 
        res.status(500).json({
            message : 'Internal server error',
            error : true 
        })
    }
}


export const validateNonExistenceOfUsernameInDB = async (req, res) => {
    try{
        const {username} = req.body; 
        const checkUsername = await userModel.findOne({username}); 

        if(checkUsername){
            return res.status(400).json({
                message : "This username is already taken, please pick a new username for proceeding ahead",
                error : true 
            }); 
        }
        
        return res.status(200).json({
            message : 'Succesfully validated non-existence of username in database', 
            success : true 
        }); 
    }
    catch(err){
        console.log(`Error occured in authController while validating non-existence of user's username preference in database: ${err.message}`); 
        return res.status(500).json({
            message : 'Internal server error', 
            error : true
        }); 
    }
}


export const signUp = async (req, res) => {
    try{
        const {name, email, username, password, profile_pic, cloudinary_img_public_id} = req.body; 

        if(!name || !email || !username || !password){
            return res.status(400).json({
                message : 'Invalid backend call, at least one of the input fields is missing' 
            })
        } 

        const salt = await bcryptjs.genSalt(10); 
        const hashPassword = await bcryptjs.hash(password, salt); 

        const payload = {
            name, 
            email, 
            username, 
            password : hashPassword, 
            profile_pic, 
            cloudinary_img_public_id 
        }

        const user = new userModel(payload); 
        const userSave = await user.save(); 

        return res.status(201).json({ 
            message : 'User created successfully', 
            data : userSave, 
            success : true 
        }); 
    }
    catch(err){
        console.log(`Error occured in authController while signing up the user: ${err.message}`); 
        return res.status(500).json({
            message : 'Internal server error', 
            error : true
        }); 
    }
};


export const checkEmailForLogin = async (req, res) => {
    try{
        const {email} = req.body; 
        const user = await userModel.findOne({email}).select("-password"); 
        if(user){
            return res.status(200).json({
                message : "User Verified", 
                success : true, 
                data : user
            }); 
        }
        else{
            return res.status(400).json({
                message : "User doesn't exist" 
            })
        }
    }
    catch(err){
        console.log(`Error occured in authController while checking the email: ${err.message}`); 
        return res.status(500).json({
            message : 'Internal server error' 
        })
    }
}



export const checkPasswordAndLogin = async (req, res) => {
    try{
        const {password, _id} = req.body; 
        const user = await userModel.findById(_id); 
        
        if(user){
            
            const hashedPassword = user.password; 
            const isPasswordCorrect = await bcryptjs.compare(password, hashedPassword); 
            
            if(isPasswordCorrect){
                
                const tokenPayload = {
                    id : user._id
                };
                
                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
                    expiresIn : '15d' 
                });

                return res.status(200).json({
                    message : 'Logged In successfully', 
                    token, 
                    success : true
                })
            }
            else{
                return res.status(400).json({
                    message : 'User entered wrong password', 
                    success : false
                })
            }
        }
        else{
            return res.status(400).json({
                message : "User doesn't exits", 
                error : true 
            })
        }
    }
    catch(err){
        console.log(`Error occured in authControler while verifying user password: ${err.message}`); 
        return res.status(500).json({
            message : 'Internal server error', 
            error :true 
        }); 
    }
};