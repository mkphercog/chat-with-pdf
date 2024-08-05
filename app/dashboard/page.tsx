import { protectedUserId } from "@/actions/protectedUserId";
import AuthClerkIntoFirebase from "@/components/AuthClerkIntoFirebase";
import Documents from "@/components/Documents";

import { FREE_DOC_LIMIT, PRO_DOC_LIMIT } from "@/constants";
import { adminDb } from "@/firebaseAdmin";

export const dynamic = "force-dynamic";

const Dashboard = async () => {
  const { userId } = await protectedUserId();

  const userDocs = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();
  const currentFilesCount = userDocs.docs.length;
  const userData = await adminDb.collection("users").doc(userId).get();
  const userLimit = userData.data()?.hasActiveMembership
    ? PRO_DOC_LIMIT
    : FREE_DOC_LIMIT;

  return (
    <div className="h-full max-w-7xl mx-auto">
      <AuthClerkIntoFirebase />

      <h1 className="text-3xl p-5 bg-gray-100 font-extralight text-indigo-600">
        My documents
        <span className="text-xl">{` (${currentFilesCount}/${userLimit})`}</span>
      </h1>

      <Documents />
    </div>
  );
};
export default Dashboard;
