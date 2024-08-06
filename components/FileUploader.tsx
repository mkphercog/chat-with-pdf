"use client";

import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
  FileCheck2,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscription from "@/hooks/useSubscription";
import { useToast } from "./ui/use-toast";
import {
  FREE_FILE_MAX_SIZE_IN_BYTES,
  PRO_FILE_MAX_SIZE_IN_BYTES,
  FREE_FILE_MAX_SIZE_IN_KB,
  PRO_FILE_MAX_SIZE_IN_KB,
} from "@/constants";
import { ROUTES } from "@/routes";

const FileUploader = () => {
  const { hasActiveMembership } = useSubscription();
  const { progress, status, fileId, handleUpload } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription();
  const { toast } = useToast();
  const router = useRouter();
  const fileSizeLimit = hasActiveMembership
    ? {
        bytes: PRO_FILE_MAX_SIZE_IN_BYTES,
        kb: PRO_FILE_MAX_SIZE_IN_KB,
      }
    : {
        bytes: FREE_FILE_MAX_SIZE_IN_BYTES,
        kb: FREE_FILE_MAX_SIZE_IN_KB,
      };

  useEffect(() => {
    if (fileId) {
      router.push(ROUTES.dashboard.fileView(fileId));
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file?.size >= fileSizeLimit.bytes) {
        toast({
          variant: "destructive",
          title: "File to big",
          description: `Max size ${fileSizeLimit.kb}.`,
        });
        return;
      }

      if (file) {
        if (!isOverFileLimit && !filesLoading) {
          await handleUpload(file);
        } else {
          toast({
            variant: "destructive",
            title: "Free account detected",
            description:
              "You have reached the maximum number of files allowed for your account. Please upgrade to PRO to add more documents.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Wrong file extension",
          description: "Pdf's only accepted",
        });
      }
    },
    [
      fileSizeLimit.bytes,
      fileSizeLimit.kb,
      filesLoading,
      handleUpload,
      isOverFileLimit,
      toast,
    ]
  );

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (
      <RocketIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-indigo-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-indigo-600" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-indigo-600 animate-pulse" />
    ),
    [StatusText.DONE]: (
      <FileCheck2 className="h-20 w-20 text-indigo-600 animate-accordion-down" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress =
    progress !== null && progress >= 0 && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-indigo-300 text-white border-indigo-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          {
            // @ts-ignore
            statusIcons[status]
          }

          <p className="text-indigo-600 animate-pulse">{status?.toString()}</p>
        </div>
      )}
      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed mt-10 w-[90%] border-indigo-600 text-indigo-600 rounded-lg h-96 flex justify-center items-center
        ${isFocused || isDragAccept ? "bg-indigo-300" : "bg-indigo-100"}
        `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>
                  Drag &apos;n&apos; drop some file here, or click to select
                  file, max file size {fileSizeLimit.kb}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default FileUploader;
