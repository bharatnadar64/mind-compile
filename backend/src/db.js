// @ts-nocheck
// db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };
        await mongoose.connect(process.env.MONGO_URI, options);
        console.log("✓ MongoDB connection established");
    } catch (error) {
        console.error("✗ MongoDB connection failed:", error);
        process.exit(1);
    }
};

export default connectDB;