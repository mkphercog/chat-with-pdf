import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";
import { FC } from "react";

type ChatToFilePageProps = {
  params: {
    id: string;
  };
};

const ChatToFilePage: FC<ChatToFilePageProps> = async ({ params: { id } }) => {
  auth().protect();
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not found!");
  }

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();
  const url = ref.data()?.downloadUrl;

  return (
    <div className="h-dvh grid lg:grid-cols-5 overflow-hidden">
      <div className="h-full col-span-5 lg:col-span-2 overflow-y-auto">
        <Chat id={id} />
      </div>
      <div className="h-full col-span-5 lg:col-span-3 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        <PdfView url={url} />
      </div>
    </div>
  );
};
export default ChatToFilePage;
