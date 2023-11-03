"use client"
import { GhostIcon } from "lucide-react";
import { trpc } from "../_trpc/client";
import UploadButton from "./ui/UploadButton";

const Dashboard = () => {
  const {data: files, isLoading} = trpc.getUserFiles.useQuery();

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
        <div></div>
      ) : (
        isLoading ? (
            <div></div>
        ) : (
            <div className="mt-16 flex flex-col items-center gap-2 ">
                <GhostIcon className="h-8 w-8 text-zinc-800 "/>
                <h3>Meio vazio por aqui...</h3>
                <p>Vamos inserir seu primeiro PDF!</p>
            </div>
        )
      )}
    </main>
  );
};

export default Dashboard;
