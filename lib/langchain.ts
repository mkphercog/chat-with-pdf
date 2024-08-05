import { ChatOpenAI } from "@langchain/openai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
});

export const indexName = "chat-with-pdf";

const fetchMessagesFromDB = async (docId: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  console.log("--- Fetching chat history from firestore database");

  const chats = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .collection("chat")
    .orderBy("createdAt", "desc")
    // .limit(LIMIT)
    .get();

  const chatHistory = chats.docs.map((doc) =>
    doc.data().role === "human"
      ? new HumanMessage(doc.data().message)
      : new AIMessage(doc.data().message)
  );

  console.log(`--- Fetched last ${chatHistory.length} messages successfully`);
  console.log(chatHistory.map((msg) => msg.content.toString()));

  return chatHistory;
};

const generateDocs = async (docId: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  console.log("--- Fetching the download URL from Firebase ---");

  const firebaseRef = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(docId)
    .get();
  const downloadUrl = firebaseRef.data()?.downloadUrl;

  if (!downloadUrl) {
    throw new Error("Download URL not found!");
  }

  console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);

  const response = await fetch(downloadUrl);
  const data = await response.blob();

  console.log("--- Loading PDF document ---");
  const loader = new PDFLoader(data);
  const docs = await loader.load();

  console.log("--- Splitting the document into smaller parts ---");
  const splitter = new RecursiveCharacterTextSplitter();

  const splitDocs = await splitter.splitDocuments(docs);
  console.log(`--- Split into ${splitDocs.length} parts ---`);

  return splitDocs;
};

const namespaceExists = async (
  index: Index<RecordMetadata>,
  namespace: string
) => {
  if (namespace === null) throw new Error("No namespace value provided!");
  const { namespaces } = await index.describeIndexStats();
  return namespaces?.[namespace] !== undefined;
};

export const generateEmbeddingsInPineconeVectorStore = async (
  docId: string
) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  let pineconeVectorStore;

  console.log("--- Generating embeddings... ---");
  const embeddings = new OpenAIEmbeddings();

  const index = pineconeClient.index(indexName);
  const namespaceAlreadyExists = await namespaceExists(index, docId);

  if (namespaceAlreadyExists) {
    console.log(`--- Namespace ${docId} already exists! ---`);

    pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: docId,
    });

    return pineconeVectorStore;
  } else {
    const splitDocs = await generateDocs(docId);

    console.log(
      `--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store ---`
    );

    pineconeVectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: docId,
      }
    );

    return pineconeVectorStore;
  }
};

const generateLangchainCompletion = async (docId: string, question: string) => {
  let pineconeVectorStore;

  pineconeVectorStore = await generateEmbeddingsInPineconeVectorStore(docId);

  if (!pineconeVectorStore) {
    throw new Error("Pinecone vector store not found!");
  }

  console.log("--- Creating a retriever ---");
  const retriever = pineconeVectorStore.asRetriever();

  const chatHistory = await fetchMessagesFromDB(docId);

  console.log("--- Defining a prompt template ---");
  const historyAwarePrompt = ChatPromptTemplate.fromMessages([
    ...chatHistory,

    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation.",
    ],
  ]);

  console.log("--- Creating a history-aware retriever chain ---");
  const historyAwareRetrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt: historyAwarePrompt,
  });

  console.log("--- Defining a prompt template for answering question ---");
  const historyAwareRetrieverPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "Answer the user's questions based on the below context:\n\n{context}",
    ],
    ...chatHistory,

    ["user", "{input}"],
  ]);

  console.log("--- Creating a document combining chain ---");
  const historyAwareCombineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt: historyAwareRetrieverPrompt,
  });

  console.log("--- Creating a main retriever chain ---");
  const conversationalRetrievalChain = await createRetrievalChain({
    retriever: historyAwareRetrieverChain,
    combineDocsChain: historyAwareCombineDocsChain,
  });

  console.log("--- Running the chain with a sample conversation ---");
  const reply = await conversationalRetrievalChain.invoke({
    chat_history: chatHistory,
    input: question,
  });

  console.log(`--- Reply: ${reply.answer}`);
  return reply.answer;
};

export { model, generateLangchainCompletion };
