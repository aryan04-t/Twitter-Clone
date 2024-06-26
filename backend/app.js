import express from 'express' 
import dotenv from 'dotenv' 
import cors from 'cors'

import cloudinary from 'cloudinary' 

import connectToMongoDB from './db/connectToMongoDB.js'

import awakenTheServerRoute from './routes/awakenTheServerRoute.js'
import authRoutes from './routes/authRoutes.js'
import cloudinaryRoutes from './routes/cloudinaryRoutes.js' 
import userRoutes from './routes/userRoutes.js' 
import tweetRoutes from './routes/tweetRoutes.js' 


dotenv.config(); 
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const PORT = process.env.PORT || 8000; 
const app = express(); 


app.use(express.json()); 

app.use(cors({
    origin : process.env.FRONTEND_URL 
}))


app.use('/', awakenTheServerRoute); 
app.use('/api/auth', authRoutes); 
app.use('/api/cloudinary', cloudinaryRoutes); 
app.use('/api/user', userRoutes); 
app.use('/api/tweet', tweetRoutes); 


connectToMongoDB().then( () => {
    app.listen( PORT, (err) => {
        if(err){
            console.log(`Error occured while starting the server ${err.message}`); 
        }
        else{
            console.log(`Server started successfully on port no.: ${PORT}`); 
            console.log(`Press ctrl and click me: http://localhost:${PORT}`); 
        } 
    }); 
})