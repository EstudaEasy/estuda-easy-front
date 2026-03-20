import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ResourceShareService from "@/services/resource/ResourceShareService";
import ResourceShareLinkService from "@/services/resource/ResourceShareLinkService";
import { Copy, Link as LinkIcon, Users, Trash2, Globe } from "lucide-react";
import { ResourceShareItem, ResourceShareLinkResponse } from "@/types";

interface ShareResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
}

export default function ShareResourceModal({
  isOpen,
  onClose,
  resourceId,
}: ShareResourceModalProps) {
  const [activeTab, setActiveTab] = useState("link");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [shareLink, setShareLink] = useState<ResourceShareLinkResponse | null>(null);
  const [shares, setShares] = useState<ResourceShareItem[]>([]);

  const fetchLinkData = async () => {
    try {
      setIsLoading(true);
      const res = await ResourceShareLinkService.find(resourceId);
      setShareLink(res.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error("Erro ao carregar link:", error);
      }
      setShareLink(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSharesData = async () => {
    try {
      setIsLoading(true);
      const res = await ResourceShareService.list(resourceId);
      const data = res.data;
      setShares(Array.isArray(data) ? data : data.shares || []);
    } catch (error) {
      console.error("Erro ao carregar compartilhamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && resourceId) {
      if (activeTab === "link") fetchLinkData();
      else fetchSharesData();
    }
  }, [isOpen, resourceId, activeTab]);

  const handleGenerateLink = async (permission: "read" | "edit") => {
    try {
      setIsGenerating(true);
      const res = await ResourceShareLinkService.generate(resourceId, { permission });
      setShareLink(res.data);
      toast.success("Link gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      toast.error("Erro ao gerar link de compartilhamento");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveLink = async () => {
    try {
      setIsGenerating(true);
      await ResourceShareLinkService.remove(resourceId);
      setShareLink(null);
      toast.success("Link de convite removido");
    } catch (error) {
      console.error("Erro ao remover link:", error);
      toast.error("Erro ao desativar link");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRemoveShare = async (shareId: number) => {
    try {
      await ResourceShareService.remove(resourceId, shareId);
      setShares((prev) => prev.filter((s) => s.id !== shareId));
      toast.success("Acesso revogado!");
    } catch (error) {
      console.error("Erro ao remover acesso:", error);
      toast.error("Erro ao revogar acesso");
    }
  };

  const handleCopyLink = () => {
    if (shareLink?.id) {
      const url = `${window.location.origin}/share/${shareLink.id}?resourceId=${resourceId}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Recurso</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon size={14} /> Link Compartilhável
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={14} /> Pessoas com Acesso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="mt-4 space-y-4">
            {isLoading && activeTab === "link" ? (
              <div className="py-8 text-center text-gray-500 animate-pulse">
                Carregando permissões do link...
              </div>
            ) : shareLink ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="text-blue-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Qualquer pessoa com o link</p>
                    <p className="text-sm text-gray-500">
                      Permissão atual:{" "}
                      <strong>{shareLink.permission === "edit" ? "Edição" : "Leitura"}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleCopyLink}>
                    <Copy className="mr-2 h-4 w-4" /> Copiar Link
                  </Button>
                  <Button variant="destructive" onClick={handleRemoveLink} disabled={isGenerating}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LinkIcon className="text-gray-500" size={24} />
                </div>
                <h4 className="text-gray-900 font-medium mb-1">Nenhum link ativo</h4>
                <p className="text-gray-500 text-sm mb-4">
                  Gere um link para que outras pessoas acessem este recurso.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateLink("read")}
                    disabled={isGenerating}
                  >
                    Link de Leitura
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleGenerateLink("edit")}
                    disabled={isGenerating}
                  >
                    Link de Edição
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            {isLoading && activeTab === "users" ? (
              <div className="py-8 text-center text-gray-500 animate-pulse">
                Carregando usuários...
              </div>
            ) : shares.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Ninguém mais tem acesso a este recurso.
              </div>
            ) : (
              <div className="space-y-3">
                {shares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {(share.user?.name?.[0] || "U").toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {share.user?.name || "Usuário"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {share.permission === "edit" ? "Editor" : "Leitor"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveShare(share.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
