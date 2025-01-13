// import type { NextAuthConfig } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';

// export const authConfig = {
//     trustHost: true,
//     providers: [
//         Credentials({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'Email', type: 'text' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             authorize: async (credentials) => {
//                 // You can add custom authorization logic here, e.g., check the database
//                 const user = await findUserByEmail(credentials?.email);

//                 if (user && validatePassword(credentials?.password, user.password)) {
//                     return { id: user.id, email: user.email, isAdmin: user.isAdmin };
//                 }

//                 return null;
//             },
//         }),
//     ],
// } satisfies NextAuthConfig;
