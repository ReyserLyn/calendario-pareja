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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
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
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    shouldFocusError: false,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

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
                    <Link href="reset">Olvidaste tu contraseña?</Link>
                  }
                />

                <Button type="submit" className="w-full">
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
