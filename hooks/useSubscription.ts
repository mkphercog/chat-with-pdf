"use client";

import { FREE_DOC_LIMIT, PRO_DOC_LIMIT } from "@/constants/plans";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [filesSnapshot, filesLoading] = useCollection(
    user && collection(db, "users", user.id, "files")
  );

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();
    //I comment this because I do not implement stripe yet, and I always has no data from firebase about hasActiveMembership
    // if (!data) return;

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
}
export default useSubscription;
