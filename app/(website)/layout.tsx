// "use client";
// import NavBar from '@/Component/Header';
// import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation';

// export default function Page() {
//   const session = useSession();

//   console.log(session);


//   // If no session, redirect to login
//   if (!session) {
//     redirect('/login');
//   }

//   console.log(session);

//   return (
//     <div>
//       <NavBar />

//     </div>
//   );
// }

// import React from 'react'

// import Box from '@mui/material/Box'
// import NavBar from '@/Component/Header'
// import { getServerSession } from 'next-auth'
// import { authOptions } from '@/lib/authOptions'
// import { redirect } from "next/navigation";
// import { Stack } from '@mui/material'

// const Layout = async (
//     {
//         children,
//     }: {
//         children: React.ReactNode
//     }
// ) => {
//     const session = await getServerSession(authOptions); // Explicitly pass authOptions

//     if (!session || !session.user) {
//         redirect('/login');
//     }

//     return (
//         // <Handshake>
//         <Box display={"flex"} flexDirection={"column"} height={"calc(100dvh - 50px)"}>
//             <Stack height={"100%"}>
//                 <NavBar />
//                 <Box px={2} height={"100%"}>
//                     {children}
//                 </Box>
//             </Stack>
//             {/* <Footer /> */}
//         </Box>
//         // </Handshake>
//     )
// }

// export default Layout


import React from 'react'
import DashboardLayout from './_component/Layout';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dynamic = "force-dynamic"

const Layout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    const session = await getServerSession(authOptions); // Explicitly pass authOptions

    if (!session || !session.user) {
        redirect('/login');
    }
    // await delay(2000); // 2-second delay

    return (
        <div>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </div>
    )
}

export default Layout
