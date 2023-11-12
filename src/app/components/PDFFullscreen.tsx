import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import { Document, Page } from "react-pdf";
import SimpleBar from "simplebar-react";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

interface PDFFullscreenProps {
  fileUrl: string;
}

const PDFFullscreen = ({ fileUrl }: PDFFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numOfPages, setNumOfPages] = useState<number>();

  const { width, ref } = useResizeDetector();
  const { toast } = useToast();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error ao carregar PDF",
                  description: "Por favor tente novamente mais tarde",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => setNumOfPages(numPages)}
              file={fileUrl}
              className="max-h-full"
            >
              {new Array(numOfPages).fill(0).map((_, i) => (
                <Page key={i} width={width ? width : 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PDFFullscreen;
