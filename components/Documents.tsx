import PlaceholderDocument from "./PlaceholderDocument";
import { adminDb } from "@/firebaseAdmin";
import Document from "./Document";
import { protectedUserId } from "@/actions/protectedUserId";
import { FB_COLL } from "@/constants";

const Documents = async () => {
  const { userId } = await protectedUserId();

  const documentsSnapshot = await adminDb
    .collection(FB_COLL.users)
    .doc(userId)
    .collection(FB_COLL.files)
    .get();

  return (
    <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
      {documentsSnapshot.docs.map((doc) => {
        const { name, downloadUrl, size } = doc.data();
        return (
          <Document
            key={doc.id}
            id={doc.id}
            name={name}
            size={size}
            downloadUrl={downloadUrl}
          />
        );
      })}

      <PlaceholderDocument />
    </div>
  );
};
export default Documents;
