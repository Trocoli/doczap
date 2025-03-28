"use client";

import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "./button";
import { DialogContent } from "@/components/ui/dialog";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropzone = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingProgress, setUploadingProgress] = useState<number>(0);

  const router = useRouter();

  const { toast } = useToast();

  const { startUpload } = useUploadThing("PDFUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    /* 
    mutations don't run at component mount, only when called
    */
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadingProgress(0);

    const interval = setInterval(() => {
      setUploadingProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        console.log(acceptedFile);
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        // handle file uploading
        const res = await startUpload(acceptedFile);
        if (!res) {
          return toast({
            title: "Algo deu errado...",
            description: "Por favor tente novamente mais tarde",
            variant: "destructive",
          });
        }
        const [fileResponse] = res;
        const key = fileResponse?.key;
        if (!key) {
          return toast({
            title: "Algo deu errado...",
            description: "Por favor tente novamente mais tarde",
            variant: "destructive",
          });
        }

        clearInterval(progressInterval);
        setUploadingProgress(100);
        startPolling({ key });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full ">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg
            cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold ">Clique aqui</span> ou arraste
                  para inserir um PDF
                </p>
                <p className="text-xs text-zinc-500">
                  PDF (até 4mb no plano grátis!)
                </p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div
                  className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] 
                outline-zinc-200 divide-x divide-zinc-200"
                >
                  <div className="px-3 py-2 h-full grid place-items-center ">
                    <File className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate ">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadingProgress}
                    className="h-1 w-full bg-zinc-200"
                    indicatorColor={
                      uploadingProgress === 100 ? "bg-green-500" : ""
                    }
                  />

                  {uploadingProgress === 100 ? (
                    <div className="flex gap-1  items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecionando...
                    </div>
                  ) : null}
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
        }}
        asChild
      >
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
