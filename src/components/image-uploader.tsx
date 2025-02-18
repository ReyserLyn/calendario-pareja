"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhotosMonthOptions } from "@/types/pocketbase-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";

export const ImageUploader: React.FC<{
  sessionId: string;
  month: PhotosMonthOptions;
  onSuccess: (imageUrl: string) => void;
  isOpen?: boolean;
  setIsOpen?: () => void;
}> = ({ onSuccess, setIsOpen }) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");

  const formSchema = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
      } catch {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const imageUrl = URL.createObjectURL(values.image);
      onSuccess(imageUrl);
      if (setIsOpen) setIsOpen();
      toast.success("Imagen cargada temporalmente");
    } catch (error) {
      toast.error("Error al cargar la imagen");
      console.error("Upload error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" flex flex-col space-y-8"
      >
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto max-w-md">
              <FormLabel
                className={`text-lg ${
                  fileRejections.length !== 0
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                Sube tu imagen
              </FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-input p-8 transition-colors hover:border-primary ${
                    isDragActive ? "border-primary bg-muted/50" : "bg-muted/30"
                  }`}
                >
                  <input {...getInputProps()} type="file" />
                  <div className="flex flex-col items-center gap-4 text-center">
                    {preview && typeof preview === "string" ? (
                      <div className="max-h-[400px] max-w-full overflow-hidden">
                        <Image
                          src={preview}
                          alt="Uploaded image"
                          width={0}
                          height={0}
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="h-auto w-auto max-h-[400px] max-w-full object-scale-down"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="h-12 w-12 text-muted-foreground transition-colors group-hover:text-primary" />
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">
                            {isDragActive
                              ? "Suelta la imagen aquí"
                              : "Haz clic para seleccionar o arrastra una imagen"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Formatos soportados: PNG, JPG, JPEG
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Tamaño máximo: 1MB
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-center">
                {fileRejections.length !== 0 &&
                  "La imagen debe ser menor a 1MB y en formato PNG, JPG o JPEG"}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mx-auto h-12 rounded-full px-8 text-lg font-semibold transition-transform hover:scale-105"
        >
          Subir imagen
        </Button>
      </form>
    </Form>
  );
};
