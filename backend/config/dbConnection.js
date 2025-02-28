import mongoose from 'mongoose';

// Connect to database
const connectToDatabase = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');
    } catch (err) {
        console.log('Error connecting to database:', err);
    }
}

export default connectToDatabase;
