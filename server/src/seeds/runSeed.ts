import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { seedInitialData } from './seedData';
import mongoose from 'mongoose';

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    await seedInitialData();
    console.log('🎉 Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding script failed:', err);
    process.exit(1);
  }
};

run();
