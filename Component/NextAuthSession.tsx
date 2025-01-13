"use client"; // Mark this as a client component

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth"; // Import Session type

interface NextAuthSessionProps {
    session: Session | null; // The session passed from server
    children: React.ReactNode;
}

const NextAuthSession = ({ session, children }: NextAuthSessionProps) => {    
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
};

export default NextAuthSession;
