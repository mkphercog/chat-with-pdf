"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { ROUTES } from "@/routes";
import { revalidatePath } from "next/cache";
import { protectedUserId } from "./protectedUserId";
import { FB_COLL } from "@/constants";

const deleteDocument = async (docId: string) => {
  const { userId } = await protectedUserId();

  const currentDoc = adminDb
    .collection(FB_COLL.users)
    .doc(userId)
    .collection(FB_COLL.files)
    .doc(docId);
  const hasChat = await currentDoc.collection(FB_COLL.chat).get();

  if (hasChat.docs.length) {
    await currentDoc
      .collection(FB_COLL.chat)
      .listDocuments()
      .then((docs) => {
        docs.map((doc) => doc.delete());
      });
  }

  await currentDoc.delete();

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`${FB_COLL.users}/${userId}/${FB_COLL.files}/${docId}`)
    .delete();

  try {
    const index = pineconeClient.index(indexName);
    await index.namespace(docId).deleteAll();
  } catch (error) {
    console.error(error);
  }

  revalidatePath(ROUTES.dashboard.root());
};

export default deleteDocument;
