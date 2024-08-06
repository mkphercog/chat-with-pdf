"use client";

import { useRouter } from "next/navigation";
import byteSize from "byte-size";
import useSubscription from "@/hooks/useSubscription";
import { FC, useTransition } from "react";
import { Button } from "./ui/button";
import { DownloadCloud, Trash2Icon } from "lucide-react";
import deleteDocument from "@/actions/deleteDocument";
import { ROUTES } from "@/routes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { useToast } from "./ui/use-toast";

type DocumentProps = {
  id: string;
  name: string;
  size: number;
  downloadUrl: string;
};

const Document: FC<DocumentProps> = ({ id, name, size, downloadUrl }) => {
  const router = useRouter();
  const [isDeleting, startTransition] = useTransition();
  const { hasActiveMembership } = useSubscription();
  const { toast } = useToast();

  const handleDeleteFile = () => {
    if (hasActiveMembership) {
      startTransition(async () => {
        await deleteDocument(id);
        toast({
          variant: "success",
          title: "Success!",
          description: `File "${name}" deleted correctly.`,
        });
      });
    } else {
      toast({
        variant: "destructive",
        title: "Free account detected",
        description: "You'll need to upgrade to PRO to delete files.",
      });
    }
  };

  return (
    <div className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-indigo-600 hover:text-white cursor-pointer group">
      <div
        className="flex-1"
        onClick={() => {
          router.push(ROUTES.dashboard.fileView(id));
        }}
      >
        <p className="font-semibold line-clamp-2">{name}</p>
        <p className="text-sm text-gray-500 group-hover:text-indigo-100">
          {byteSize(size).toString()}
        </p>
      </div>

      <div className="flex space-x-2 justify-end">
        <AlertDialog>
          <AlertDialogTrigger
            className="flex items-center border rounded-md px-4 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={isDeleting}
          >
            <Trash2Icon className="h-6 w-6 text-red-500" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                file {`"${name}"`}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-indigo-600"
                onClick={handleDeleteFile}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="outline" asChild>
          <a href={downloadUrl} download>
            <DownloadCloud className="h-6 w-6 text-indigo-600" />
          </a>
        </Button>
      </div>
    </div>
  );
};
export default Document;
