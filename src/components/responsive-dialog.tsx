import { ImageUploader } from "@/components/image-uploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function ResponsiveDialog({
  sessionId,
  month,
  onSuccess,
  isOpen,
  setIsOpen,
}: {
  sessionId: string;
  month: string;
  onSuccess: (imageUrl: string) => void;
  isOpen?: boolean;
  setIsOpen?: () => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Subir imagen</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Subir imagen</DialogTitle>
            <DialogDescription>
              Selecciona una imagen para subirla al álbum.
            </DialogDescription>
          </DialogHeader>
          <ImageUploader
            sessionId={sessionId}
            month={month}
            onSuccess={onSuccess}
            className="space-y-4"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Subir imagen</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Subir imagen</DrawerTitle>
          <DrawerDescription>
            Selecciona una imagen para subirla al álbum.
          </DrawerDescription>
        </DrawerHeader>
        <ImageUploader
          sessionId={sessionId}
          month={month}
          onSuccess={onSuccess}
          className="px-4 space-y-4"
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
