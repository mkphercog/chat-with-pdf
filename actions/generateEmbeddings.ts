"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { ROUTES } from "@/routes";
import { revalidatePath } from "next/cache";
import { protectedUserId } from "./protectedUserId";

export const generateEmbeddings = async (docId: string) => {
  await protectedUserId();

  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath(ROUTES.dashboard.root());

  return { completed: true };
};
