"use client";

import { generateEmbeddings } from "@/actions/generateEmbeddings";
import { useToast } from "@/components/ui/use-toast";
import { FB_COLL } from "@/constants";
import { db, storage } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export enum StatusText {
  UPLOADING = "Uploading file...",
  UPLOADED = "File uploaded successfully",
  SAVING = "Saving file to database...",
  GENERATING = "Generating AI Embeddings, This will only take a few seconds...",
  DONE = "Done!",
}

export type Status = StatusText[keyof StatusText];

const useUpload = () => {
  const [progress, setProgress] = useState<number | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    if (!file || !user) return;

    const fileIdToUploadTo = uuidv4();
    const storageRef = ref(
      storage,
      `${FB_COLL.users}/${user.id}/${FB_COLL.files}/${fileIdToUploadTo}`
    );

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setStatus(StatusText.UPLOADING);
        setProgress(percent);
      },
      (error) => {
        console.error("Error uploading file: ", error);
      },
      async () => {
        setStatus(StatusText.UPLOADED);

        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        setStatus(StatusText.SAVING);

        await setDoc(
          doc(db, FB_COLL.users, user.id, FB_COLL.files, fileIdToUploadTo),
          {
            name: file.name,
            size: file.size,
            type: file.type,
            downloadUrl,
            ref: uploadTask.snapshot.ref.fullPath,
            createdAt: new Date(),
          }
        );
        setFileName(file.name);
        setStatus(StatusText.GENERATING);
        await generateEmbeddings(fileIdToUploadTo);

        setFileId(fileIdToUploadTo);
        setStatus(StatusText.DONE);
      }
    );
  };

  useEffect(() => {
    if (status === StatusText.DONE) {
      toast({
        variant: "success",
        title: "Success!",
        description: `File "${fileName}" uploaded correctly.`,
      });
    }
  }, [fileName, status, toast]);

  return {
    progress,
    status,
    fileId,
    handleUpload,
  };
};
export default useUpload;
