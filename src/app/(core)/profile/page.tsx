"use client";

import { useAuth } from "@/context/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LuSave } from "react-icons/lu";
import { useEffect } from "react";
import z from "zod";
import UserService from "@/services/user/UserService";
import { PhoneInput } from "@/components/PhoneInput/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const profileSchema = z
  .object({
    name: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 2, {
        message: "O nome deve conter pelo menos 2 caracteres",
      }),
    phoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 10, {
        message: "O telefone deve conter pelo menos 10 caracteres",
      }),
    email: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: "E-mail inválido",
      }),
    birthdate: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (val.length >= 6 &&
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(val)),
        {
          message:
            "A nova senha deve conter pelo menos 6 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial",
        },
      ),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0) {
        return data.confirmNewPassword === data.newPassword;
      }
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmNewPassword"],
    },
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useAuth();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isLoading, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      newPassword: "",
      confirmNewPassword: "",
      birthdate: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        newPassword: "",
        confirmNewPassword: "",
        birthdate: user.birthdate || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    const formattedPhone = data.phoneNumber?.replace(/[^\d+]/g, "") || "";
    data.phoneNumber = formattedPhone;
    const onlyUpdatedData = Object.entries(data).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (value && value !== "" && value !== user?.[key as keyof typeof user]) {
          acc[key] = value;
        }

        return acc;
      },
      {},
    );

    if (Object.keys(onlyUpdatedData).length === 0) {
      alert("Nenhuma alteração para salvar");
      return;
    }

    try {
      await UserService.updateUser(String(user!.id), onlyUpdatedData);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil");
    }
  };

  return (
    <main className="flex flex-col gap-6 p-6">
      <header>
        <Typography variant="heading-1" color="dark">
          Meu Perfil
        </Typography>
        <Typography size="lg" weight="normal" color="light">
          Gerencie suas informações pessoais
        </Typography>
        <Separator className="mt-4" />
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <Card className="w-64 sticky top-6">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="w-32 h-32 flex items-center justify-center bg-primary rounded-full text-4xl font-extrabold text-white">
              <span>{user?.name?.[0]?.toUpperCase() ?? "U"}</span>
            </div>
            <div className="text-center">
              <Typography size="2xl" weight="bold" color="dark">
                {user?.name || "Usuário"}
              </Typography>
              <Typography size="md" weight="normal" color="light">
                {user?.email || "usuario@exemplo.com"}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[400px]">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Nome</Label>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="name" {...field} aria-invalid={!!fieldState.error} />
                        {fieldState.error && (
                          <Typography size="sm" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phoneNumber">Telefone</Label>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field, fieldState }) => (
                      <>
                        <PhoneInput {...field} />
                        {fieldState.error && (
                          <Typography size="sm" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="birthdate">Data de nascimento</Label>
                  <Controller
                    control={control}
                    name="birthdate"
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          id="birthdate"
                          {...field}
                          type="date"
                          aria-invalid={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <Typography size="sm" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </div>

                <Separator />

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          id="newPassword"
                          {...field}
                          type="password"
                          aria-invalid={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <Typography size="sm" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                  <Controller
                    control={control}
                    name="confirmNewPassword"
                    render={({ field, fieldState }) => (
                      <>
                        <Input
                          id="confirmNewPassword"
                          {...field}
                          type="password"
                          aria-invalid={!!fieldState.error}
                        />
                        {fieldState.error && (
                          <Typography size="sm" color="error">
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={isSubmitting || isLoading}>
                <LuSave />
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
