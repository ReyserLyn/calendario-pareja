"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/ui/password-input";
import { createUser, login } from "@/lib/pocketbase";
import Image from "next/image";

const passwordSchema = z
  .string({
    required_error: "La contraseña no puede estar vacía.",
  })
  .regex(/^.{8,20}$/, {
    message: "Minimo 8 caracteres y máximo 20.",
  });

const passwordZodSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

const formSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario es obligatorio",
    })
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(50, "El nombre de usuario no puede exceder 50 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  passwordZodSchema,
});

export default function RegisterModal({
  onRegister,
}: {
  onRegister: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      passwordZodSchema: {
        password: "",
        confirmPassword: "",
      },
    },
    shouldFocusError: false,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createUser({
        username: values.username,
        email: values.email,
        password: values.passwordZodSchema.password,
        id: "",
        tokenKey: "",
      });
      toast.success("Registro exitoso");
      setOpen(false);

      await login(
        values.username.toLowerCase(),
        values.passwordZodSchema.password
      );

      onRegister();
    } catch (error: any) {
      toast.error(error.message);
      if (error.message.includes("usuario")) {
        form.setError("username", { message: error.message });
      }
      if (error.message.includes("correo")) {
        form.setError("email", { message: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Registrarse</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-100"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-5">
          <Image
            src="/img/logo.webp"
            alt="Logo"
            width={100}
            height={32}
            priority
            className="h-20 w-auto"
          />
          <DialogHeader>
            <DialogTitle className="sm:text-center">Registrate</DialogTitle>
            <DialogDescription className="sm:text-center">
              Ingresa los datos necesarios para registrarte
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa tu usuario" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="correo@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PasswordField
              name="passwordZodSchema.password"
              placeholder="Ingresa tu contraseña"
            />

            <PasswordField
              name="passwordZodSchema.confirmPassword"
              placeholder="Confirma tu contraseña"
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">O</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button variant="outline" className="w-full">
          Continuar con Google
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Al registrarte, aceptas nuestros{" "}
          <Link href="#" className="underline hover:no-underline">
            Términos de Servicio
          </Link>{" "}
          y nuestra{" "}
          <Link href="#" className="underline hover:no-underline">
            Política de Privacidad
          </Link>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
