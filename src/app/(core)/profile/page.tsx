"use client";

import { Typography, Card, CardContent, CardHeader } from "@/components/base";
import { LuUser, LuLock, LuPhone, LuCalendar } from "react-icons/lu";

export default function Profile() {
  return (
    <main>
      <header>
        <Typography size="4xl" weight="bold" color="dark">
          Meu Perfil
        </Typography>
        <Typography size="lg" weight="normal" color="light">
          Gerencie suas informações pessoais
        </Typography>
      </header>

      <div>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div>
              <span>{"U"}</span>
            </div>
            <div>
              <Typography size="2xl" weight="bold" color="dark">
                {"Usuário"}
              </Typography>
              <Typography size="base" weight="normal" color="light">
                {"usuario@exemplo.com"}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className={`w-full`}>
          <CardHeader>
            <Typography size="xl" weight="semibold" color="dark">
              Informações Pessoais
            </Typography>
          </CardHeader>

          <CardContent>
            <form>
              <div>
                <label>
                  <LuUser size={18} />
                  <Typography size="sm" weight="medium" color="dark">
                    Nome Completo
                  </Typography>
                </label>
              </div>

              <div>
                <label>
                  <LuLock size={18} />
                  <Typography size="sm" weight="medium" color="dark">
                    Nova Senha
                  </Typography>
                </label>
              </div>

              <div>
                <label>
                  <LuPhone size={18} />
                  <Typography size="sm" weight="medium" color="dark">
                    Telefone
                  </Typography>
                </label>
              </div>

              <div>
                <label>
                  <LuCalendar size={18} />
                  <Typography size="sm" weight="medium" color="dark">
                    Data de Nascimento
                  </Typography>
                </label>
              </div>

              <div></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
