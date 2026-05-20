import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Ensure system environmental variables are mounted cleanly into memory matrix layouts
dotenv.config();

// 1. INSTANTIATE THE ENHANCED POSTGRESQL POOL CONNECTION ENGINE
export const sequelize = new Sequelize(
  process.env.DB_NAME || 'devsync_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    logging: false, // Prevents terminal screen logs flooding with raw transaction traces
    pool: {
      max: 5,        // Maximum active query pool channel slots
      min: 0,        // Minimum standby allocation lines
      acquire: 30000,// Maximum millisecond wait cycle window before connection timeout
      idle: 10000    // Idle thread closure window to release hardware resources
    }
  }
);

// 2. LIFECYCLE CONNECTIVITY MONITOR FUNCTION
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('🚀 PostgreSQL Cluster transaction engine mounted and verified via Sequelize.');
    
    // Auto-sync safe schema modifications in development space safely
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('⚙️ PostgreSQL relational data tables synchronized cleanly.');
    }
  } catch (error) {
    console.error('❌ Database connectivity failure exception caught:', error.message);
    process.exit(1); // Kill runtime node threads if critical schema link drop occurs
  }
};