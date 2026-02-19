"use client";

import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  InputGroup,
  InputLabel,
  Input,
  Button,
} from "@/components/base";
import { useAuth } from "@/context/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LuSave } from "react-icons/lu";
import { useEffect } from "react";
import z from "zod";
import UserService from "@/services/user/UserService";
import { PhoneInput } from "@/components/PhoneInput/page";

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
    <main>
      <header>
        <Typography size="4xl" weight="bold" color="dark">
          Meu Perfil
        </Typography>
        <Typography size="lg" weight="normal" color="dark">
          Gerencie suas informações pessoais
        </Typography>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        <Card className="sticky">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="w-32 h-32 flex items-center text-center text-4xl text-extrabold justify-center bg-primary rounded-full">
              <span>{"U"}</span>
            </div>
            <div className="text-center">
              <Typography size="2xl" weight="bold" color="dark">
                {user?.name || "Usuário"}
              </Typography>
              <Typography size="base" weight="normal" color="dark">
                {user?.email || "usuario@exemplo.com"}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[500px]">
          <CardHeader>
            <Typography size="xl" weight="semibold" color="dark">
              Informações Pessoais
            </Typography>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <InputGroup>
                  <InputLabel htmlFor="name">Nome</InputLabel>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Input {...field} error={fieldState.error?.message} />
                    )}
                  />
                </InputGroup>
                {/* <InputGroup>
                  <InputLabel htmlFor="email">E-mail</InputLabel>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Input {...field} error={fieldState.error?.message} />
                    )}
                  />
                </InputGroup> */}
                <InputGroup>
                  <InputLabel htmlFor="phoneNumber">Telefone</InputLabel>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field, fieldState }) => (
                      <>
                        <PhoneInput {...field} />
                        <Typography size="xs" color="danger" className="mt-1">
                          {fieldState.error?.message}
                        </Typography>
                      </>
                    )}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="birthdate">Data de nascimento</InputLabel>
                  <Controller
                    control={control}
                    name="birthdate"
                    render={({ field, fieldState }) => (
                      <Input {...field} type="date" error={fieldState.error?.message} />
                    )}
                  />
                </InputGroup>

                <InputGroup>
                  <InputLabel htmlFor="newPassword">Nova Senha</InputLabel>
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <Input {...field} type="password" error={fieldState.error?.message} />
                    )}
                  />
                </InputGroup>
                <InputGroup>
                  <InputLabel htmlFor="confirmNewPassword">Confirmar Nova Senha</InputLabel>
                  <Controller
                    control={control}
                    name="confirmNewPassword"
                    render={({ field, fieldState }) => (
                      <Input {...field} type="password" error={fieldState.error?.message} />
                    )}
                  />
                </InputGroup>
              </div>
              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="full"
                  disabled={isSubmitting || isLoading}
                >
                  <Typography size="base" weight="medium">
                    <LuSave className="inline-block mr-2" />
                    Salvar Alterações
                  </Typography>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
