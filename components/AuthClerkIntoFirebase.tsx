"use client";

import { auth as firebaseAuth } from "@/firebase";
import { useAuth, useClerk } from "@clerk/nextjs";
import { signInWithCustomToken, signOut } from "firebase/auth";

function AuthClerkIntoFirebase() {
  const { getToken } = useAuth();
  const { addListener } = useClerk();

  addListener(async (data) => {
    if (!data.user?.id || !data.session?.id) {
      await signOut(firebaseAuth);
    } else if (!firebaseAuth.currentUser) {
      const token = await getToken({ template: "integration_firebase" });
      await signInWithCustomToken(firebaseAuth, token || "");
    }
  });

  return null;
}
export default AuthClerkIntoFirebase;
