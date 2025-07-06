import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js';
import pickupRoutes from './routes/pickupRoutes.js';
dotenv.config();
console.log('Connecting to MongoDB URI:', process.env.MONGODB_URI);


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/pickups', pickupRoutes);

// MongoDB connection with error handling and retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout for server selection
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    setTimeout(connectDB, 5001);
  }
};


// Initial database connection
connectDB();

// Handle MongoDB connection errors
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
  setTimeout(connectDB, 5001);
});

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectDB, 5001);
});

// Home route
app.get('/', (req, res) => {
  res.send('EcoRecycle Hub API is running');
});
