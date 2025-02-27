"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";

const formSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Por favor, sube una imagen"),
});

type FormDataType = z.infer<typeof formSchema>;

interface ImageUploaderProps {
  onSuccess: (imageUrl: string) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onSuccess,
  className,
}) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      form.setValue("image", file);
      form.clearErrors("image");
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

  const onSubmit = async (values: FormDataType) => {
    try {
      // Se genera una URL temporal para la imagen subida
      const imageUrl = URL.createObjectURL(values.image);
      onSuccess(imageUrl);
      toast.success("Imagen cargada temporalmente");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error al cargar la imagen");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormControl>
                <div
                  {...getRootProps()}
                  className={`group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-input p-4 transition-colors hover:border-primary ${
                    isDragActive ? "border-primary bg-muted/50" : "bg-muted/30"
                  }`}
                >
                  <input {...getInputProps()} type="file" />
                  <div className="flex flex-col items-center gap-4 text-center">
                    {preview && typeof preview === "string" ? (
                      <div className="max-h-[300px] max-w-full overflow-hidden">
                        <Image
                          src={preview}
                          alt="Uploaded image preview"
                          width={0}
                          height={0}
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="h-auto w-auto max-h-[300px] max-w-full object-scale-down"
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
          className="mt-6 w-full h-12 rounded-lg text-lg font-semibold transition-transform hover:scale-105"
        >
          Subir imagen
        </Button>
      </form>
    </Form>
  );
};
