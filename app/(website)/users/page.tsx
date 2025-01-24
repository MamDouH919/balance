import React from "react";
import UsersList from "./_List";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await getServerSession(authOptions); // Explicitly pass authOptions

    if ((!session || !session.user)) {
        redirect('/login');
    }

    if (session?.user?.role === "user") {
        redirect('/');
    }

    return (
        <UsersList />
    );
};

export default Page;
