"use server";

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain";
import { ROUTES } from "@/routes";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const generateEmbeddings = async (docId: string) => {
  auth().protect();

  await generateEmbeddingsInPineconeVectorStore(docId);

  revalidatePath(ROUTES.dashboard.root());

  return { completed: true };
};
