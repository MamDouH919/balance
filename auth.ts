import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/Users';

declare module "next-auth" {
    interface User {
        isAdmin?: boolean;
    }
}

export const {
    handlers: { GET, POST },
    auth,
} = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await dbConnect();  // Ensure database connection is established

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    // Return error if no user is found
                    throw new Error('No user found with this email');
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    // Invalid password error
                    throw new Error('Incorrect password');
                }

                // Return user data after successful authentication
                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    name: user.name,
                };
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            session.user = token
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
});
