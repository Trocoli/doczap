"use client";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  url: string;
}

const PDFRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast();

  const [numOfPages, setNumOfPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { width, ref } = useResizeDetector();

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center ">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
            }}
            aria-label="previous page"
            variant="ghost"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              className="w-12 h-8"
              defaultValue={currentPage}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numOfPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={numOfPages === undefined || currentPage === numOfPages}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > numOfPages! ? numOfPages! : prev + 1
              );
            }}
            aria-label="next page"
            variant="ghost"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            onLoadError={() => {
              toast({
                title: "Erro ao carregar PDF",
                description: "Por favor tente novamente mais tarde",
                variant: "destructive",
              });
            }}
            onLoadSuccess={({ numPages }) => {
              setNumOfPages(numPages);
            }}
            file={url}
            className="max-h-full "
          >
            <Page width={width ? width : 1} pageNumber={currentPage} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PDFRenderer;
