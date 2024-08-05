"use server";
import { auth } from "@clerk/nextjs/server";

export const protectedUserId = async () => {
  auth().protect();
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not found!");
  }

  return user;
};
