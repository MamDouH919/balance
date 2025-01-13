import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbConnect from './dbConnect';
import User from '@/models/Users';

const users = [
  {
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: 'superadminpassword', // This will be hashed
    role: 'super admin',
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpassword', // This will be hashed
    role: 'admin',
  },
];

const seedUsers = async () => {
  try {
    await dbConnect()

    // Delete existing users (optional, for clean seeding)
    await User.deleteMany({});

    // Hash the passwords before saving
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

    // Insert the users into the database
    await User.insertMany(users);
    console.log('Users seeded successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

seedUsers();
