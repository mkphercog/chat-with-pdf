"use server";

import { FB_COLL } from "@/constants";
import { adminDb, adminStorage, adminAuth } from "@/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";

const deleteFilesWithAccount = async (userId: string) => {
  const userRef = adminDb.collection(FB_COLL.users).doc(userId);

  const userFiles = await userRef.collection(FB_COLL.files).listDocuments();

  if (userFiles.length) {
    for (const file of userFiles) {
      const currentFileId = file.id;
      const hasChat = await file.collection(FB_COLL.chat).get();

      if (hasChat.docs.length) {
        await file
          .collection(FB_COLL.chat)
          .listDocuments()
          .then((chatMessages) => {
            console.info(`--- Deleting chat from file ${currentFileId} ---"`);
            chatMessages.map(async (message) => await message.delete());
          });
      }
      console.info(`--- Deleting file ${currentFileId} from DB ---"`);
      await file.delete();

      console.info(`--- Deleting file ${currentFileId} from storage ---"`);
      await adminStorage
        .bucket(process.env.FIREBASE_STORAGE_BUCKET)
        .file(`${FB_COLL.users}/${userId}/${FB_COLL.files}/${currentFileId}`)
        .delete();

      try {
        console.info(
          `--- Deleting namespace ${currentFileId} from pinecone ---"`
        );
        const index = pineconeClient.index(indexName);
        await index.namespace(currentFileId).deleteAll();
      } catch (error) {
        console.error(error);
      }
    }
  }

  console.info(`--- Deleting user ${userId} from DB ---"`);
  await userRef.delete();
  console.info(`--- Deleting user ${userId} from Firebase auth ---"`);
  await adminAuth.deleteUser(userId);
};
export default deleteFilesWithAccount;
