"use server";

import { FB_COLL } from "@/constants";
import { protectedUserId } from "./protectedUserId";
import { adminDb } from "@/firebaseAdmin";

export const setHasActiveMembershipInFirebase = async () => {
  const { userId } = await protectedUserId();

  await adminDb
    .collection(FB_COLL.users)
    .doc(userId)
    .set({ hasActiveMembership: false });
};
