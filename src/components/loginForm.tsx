"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { pocketbaseClient } from "@/lib/pocketbase";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

export function LoginForm({
  className,
  onClose,
  onLogin,
  ...props
}: React.ComponentProps<"div"> & {
  onClose: () => void;
  onLogin: () => void;
}) {
  const router = useRouter();
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
      const isValid = await pocketbaseClient.validateAuth();
      setIsAuthenticated(isValid);
      if (isValid) router.push("/");
    };

    checkAuth();
  }, [router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await pocketbaseClient.login(values.username, values.password);
      toast.success("Sesión iniciada correctamente");

      onClose();
      onLogin();
      router.push("/");
    } catch {
      toast.error("Credenciales inválidas o error de autenticación");
    } finally {
      setIsLoading(false);
    }
  }

  if (isAuthenticated) return null;

  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="font-dancing text-4xl font-bold mb-3">
                    Calendario parejas
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Inicia sesión para tu album
                  </p>
                </div>

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
                  description={
                    <Link href="/reset" onClick={onClose}>
                      Olvidaste tu contraseña?
                    </Link>
                  }
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Iniciar sesión
                </Button>
              </div>
            </form>
          </Form>

          <div className="relative hidden md:flex items-center justify-center h-full w-full">
            <Image
              src="/img/logo.webp"
              alt="Logo de calendar app"
              className="h-auto w-auto max-w-full max-h-full"
              width={250}
              height={50}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al hacer clic en iniciar sesión, aceptas nuestros{" "}
        <a href="#">Términos de Servicio</a> y nuestra{" "}
        <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}
