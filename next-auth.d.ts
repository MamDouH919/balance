import { type DefaultSession } from "next-auth";
import { UserRole } from "./lib/types";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole | null;
  userId: string | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
