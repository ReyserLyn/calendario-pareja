"use client";

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
import { PasswordField } from "@/components/ui/password-input";
import { login, validateAuth } from "@/lib/pocketbase";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "../ui/input";

const formSchema = z.object({
  username: z
    .string({
      required_error: "El nombre de usuario no puede estar vacío.",
    })
    .min(1, "El nombre de usuario no puede estar vacío.")
    .max(50, "El nombre de usuario no puede tener más de 50 caracteres."),
  password: z
    .string({
      required_error: "La contraseña no puede estar vacía.",
    })
    .min(1, "La contraseña no puede estar vacía.")
    .max(50, "La contraseña no puede tener más de 50 caracteres."),
});

export default function LoginModal({ onLogin }: { onLogin: () => void }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    shouldFocusError: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateAuth();
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await login(values.username, values.password);
      toast.success("Sesión iniciada correctamente");
      setOpen(false);
      onLogin();
    } catch {
      toast.error("Credenciales inválidas o error de autenticación");
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Iniciar sesión</Button>
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
            <DialogTitle className="sm:text-center">Inicia sesión</DialogTitle>
            <DialogDescription className="sm:text-center">
              Ingresa tus credenciales para acceder
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <PasswordField
              name="password"
              description={
                <Link href="/reset" onClick={() => setOpen(false)}>
                  ¿Olvidaste tu contraseña?
                </Link>
              }
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar sesión
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
          Al iniciar sesión, aceptas nuestros{" "}
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
