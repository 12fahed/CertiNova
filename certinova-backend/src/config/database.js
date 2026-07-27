import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\n❌ Configuration Error: MONGODB_URI is missing.');
    console.error('Please copy .env.example to .env and provide a valid MongoDB connection string.\n');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error(`Error: ${error.message}`);
    console.error('Ensure your MONGODB_URI is correct and your database is accessible.\n');
    process.exit(1);
  }
};

export default connectDB;
