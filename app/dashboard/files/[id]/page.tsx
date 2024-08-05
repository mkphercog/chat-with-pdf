import { FC } from "react";
import { protectedUserId } from "@/actions/protectedUserId";
import Chat from "@/components/Chat";
import PdfView from "@/components/PdfView";
import { adminDb } from "@/firebaseAdmin";

type ChatToFilePageProps = {
  params: {
    id: string;
  };
};

const ChatToFilePage: FC<ChatToFilePageProps> = async ({ params: { id } }) => {
  const { userId } = await protectedUserId();

  const ref = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .doc(id)
    .get();
  const url = ref.data()?.downloadUrl;

  return (
    <div className="h-[calc(100vh-81px)] grid grid-rows-10 lg:grid-cols-5 overflow-hidden">
      <div className="h-full row-span-5 col-span-5 lg:col-span-2 lg:row-span-10 overflow-y-auto">
        <Chat id={id} />
      </div>
      <div className="h-full row-span-5 col-span-5 lg:col-span-3 lg:row-span-10 bg-gray-100 border-r-2 lg:border-indigo-600 lg:-order-1 overflow-auto">
        <PdfView url={url} />
      </div>
    </div>
  );
};
export default ChatToFilePage;
