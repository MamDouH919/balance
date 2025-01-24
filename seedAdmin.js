import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
      name: {
          type: String,
          required: true,
      },
      email: {
          type: String,
          required: true,
          unique: true,
      },
      password: {
          type: String,
          required: true,
      },
      role: {
          type: String,
          required: true,
          enum: ["superAdmin", "admin", "user"],
      },
      isActive: {
          type: Boolean,
          default: true,
      },
  },
  {
      timestamps: true,
  }
);

UserSchema.virtual("vouchers", {
  ref: "Vouchers",
  localField: "_id",
  foreignField: "userId",
});

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

const users = [
  {
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: '$2a$10$7i7sc2ClWK/XdvAYKHAiZOISGQh1JRNY8y2pe6IgogbpouM3HJQmy', // This will be hashed
    role: 'superAdmin',
    isActive: true,
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpassword', // This will be hashed
    role: 'admin',
    isActive: true,
  },
];

const seedUsers = async () => {
  try {
    if (connection.isConnected) {
      return;
    }

    await mongoose.connect("mongodb+srv://mamdouhmohammed919:3c5zq5FybeVeSgiy@cluster0.ztsuv.mongodb.net/FRTE")
      .then(() => console.log("connected"))
      .catch((err) => console.log(err))

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
    console.log('Error seeding users:', err);
  }
};

seedUsers();
