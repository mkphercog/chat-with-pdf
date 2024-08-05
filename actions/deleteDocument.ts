"use server";

import { adminDb, adminStorage } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { ROUTES } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const deleteDocument = async (docId: string) => {
  auth().protect();
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .listDocuments()
    .then((docs) => {
      docs.map((doc) => doc.delete());
    });

  await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .delete();

  await adminStorage
    .bucket(process.env.FIREBASE_STORAGE_BUCKET)
    .file(`users/${userId}/files/${docId}`)
    .delete();

  try {
    const index = await pineconeClient.index(indexName);
    await index.namespace(docId).deleteAll();
  } catch (error) {
    console.error(error);
  }

  revalidatePath(ROUTES.dashboard.root());
};

export default deleteDocument;
