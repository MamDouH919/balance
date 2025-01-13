// import { auth } from "./auth";
// import { redirect } from "next/navigation";

// export async function checkRole(allowedRoles: string[]) {
//     const session = await auth.validateSession();
//     if (!session) {
//         redirect("/login");
//     }
//     if (!allowedRoles.includes(session.user.role)) {
//         redirect("/unauthorized");
//     }
// }

// export async function getCurrentUser() {
//     const session = await auth.validateSession();
//     if (!session) {
//         return null;
//     }
//     return session.user;
// }

