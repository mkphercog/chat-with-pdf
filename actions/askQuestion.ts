"use server";

import { Message } from "@/components/Chat";
import { FREE_MESSAGES_LIMIT, PRO_MESSAGES_LIMIT } from "@/constants";
import { adminDb } from "@/firebaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";
import { protectedUserId } from "./protectedUserId";

export const askQuestion = async (id: string, question: string) => {
  const { userId } = await protectedUserId();

  const chatRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .collection("chat");
  const chatSnapshot = await chatRef.get();
  const userMessages = chatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  const userRef = await adminDb.collection("users").doc(userId).get();
  if (!userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= FREE_MESSAGES_LIMIT) {
      return {
        success: false,
        message: `You'll need to upgrade to PRO to ask more than ${FREE_MESSAGES_LIMIT} questions!`,
      };
    }
  }

  if (userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_MESSAGES_LIMIT) {
      return {
        success: false,
        message: `You've reached the PRO limit of ${PRO_MESSAGES_LIMIT} questions per document!`,
      };
    }
  }

  const userMessage: Message = {
    role: "human",
    message: question,
    createdAt: new Date(),
  };

  await chatRef.add(userMessage);

  const reply = await generateLangchainCompletion(id, question);

  const aiMessage: Message = {
    role: "ai",
    message: reply,
    createdAt: new Date(),
  };

  await chatRef.add(aiMessage);

  return {
    success: true,
    message: null,
  };
};
