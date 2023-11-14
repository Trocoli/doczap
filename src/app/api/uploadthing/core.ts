import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { pinecone } from "@/app/lib/pinecone";
import {OpenAIEmbeddings} from 'langchain/embeddings/openai'

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  PDFUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user || !user.id) {
        throw new Error("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`, // file.url sometimes timeout
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );

        // load pdf into memory
        const blob = await response.blob();
        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();
        const numberOfPages = pageLevelDocs.length;

        // vectorize and index entire document
        const pineconeIndex = pinecone.Index("doczap");
        const embeddings = new OpenAIEmbeddings()



      } catch (error) {}
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
