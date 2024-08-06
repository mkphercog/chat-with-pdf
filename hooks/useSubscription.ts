"use client";

import { setHasActiveMembershipInFirebase } from "@/actions/setHasActiveMembership";
import { FB_COLL, FREE_DOC_LIMIT, PRO_DOC_LIMIT } from "@/constants";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const useSubscription = () => {
  const [hasActiveMembership, setHasActiveMembership] = useState<
    boolean | null
  >(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  const [snapshot, loading, error] = useDocument(
    user && doc(db, FB_COLL.users, user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [filesSnapshot, filesLoading] = useCollection(
    user && collection(db, FB_COLL.users, user.id, FB_COLL.files)
  );

  useEffect(() => {
    if (!snapshot) return;
    const data = snapshot.data();

    if (data === undefined) {
      const setFreePlan = async () => {
        await setHasActiveMembershipInFirebase();
      };
      setFreePlan();
      setHasActiveMembership(false);
      return;
    }

    setHasActiveMembership(data?.hasActiveMembership);
  }, [snapshot]);

  useEffect(() => {
    if (!filesSnapshot || hasActiveMembership === null) return;

    const files = filesSnapshot.docs;
    const userLimit = hasActiveMembership ? PRO_DOC_LIMIT : FREE_DOC_LIMIT;

    setIsOverFileLimit(files.length >= userLimit);
  }, [filesSnapshot, hasActiveMembership]);

  return {
    hasActiveMembership,
    loading,
    error,
    isOverFileLimit,
    filesLoading,
  };
};
export default useSubscription;
