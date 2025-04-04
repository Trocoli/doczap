"use client";
import { GhostIcon, Loader2, MessageSquare, Plus, TrashIcon } from "lucide-react";
import { trpc } from "../_trpc/client";
import UploadButton from "./ui/UploadButton";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [currentDeletingFile, setCurrentDeletingFile] = useState<
    string | null
  >();

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentDeletingFile(id);
    },
    onSettled() {
      setCurrentDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div
        className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200
     pb-5 sm:flex-row sm:items-center sm:gap-0 "
      >
        <h1 className="mb-3 font-bold text-5xl text-gray-900">Meus arquivos</h1>
        <UploadButton />
      </div>

      {/* display all user files */}
      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2 "
                >
                  <div className="pt-6 px-6 flex 2-full items-center justify-between space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-[#894def] to-purple-300" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate-text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2 ">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 " />
                    mocked
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      deleteFile({ id: file.id });
                    }}
                  >
                    {currentDeletingFile === file.id ? (<Loader2 className="h-4 w-4 animate-spin" />) : <TrashIcon className="h-4 w-4 " />}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2 ">
          <GhostIcon className="h-8 w-8 text-zinc-800 " />
          <h3>Meio vazio por aqui...</h3>
          <p>Vamos inserir seu primeiro PDF!</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
