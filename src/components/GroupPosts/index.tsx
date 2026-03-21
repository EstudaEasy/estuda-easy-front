import { useState, useEffect } from "react";
import GroupPostService, { GroupPostResponse } from "@/services/group/GroupPostService";
import { GroupMember } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MoreVertical, Trash2, Edit2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getErrorMessage } from "@/lib/errorMessage";

interface GroupPostsProps {
  groupId: string;
  currentUserMember: GroupMember;
}

export default function GroupPosts({ groupId, currentUserMember }: GroupPostsProps) {
  const [posts, setPosts] = useState<GroupPostResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await GroupPostService.list(groupId);
      const data = res.data as any;
      // Trata diferentes formatos de resposta da API
      const extractedPosts = Array.isArray(data)
        ? data
        : data.posts || data.data?.posts || data.data || [];
      setPosts(extractedPosts);
    } catch (error: any) {
      console.error("Erro ao carregar posts:", error);
      toast.error(getErrorMessage(error, "Erro ao carregar os posts do grupo"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [groupId]);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      setIsSubmitting(true);
      await GroupPostService.create(groupId, { content: newPostContent });
      setNewPostContent("");
      fetchPosts();
      toast.success("Post criado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar post:", error);
      toast.error(getErrorMessage(error, "Erro ao criar post"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Tem certeza que deseja deletar este post?")) return;

    try {
      await GroupPostService.delete(groupId, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deletado");
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error(getErrorMessage(error, "Erro ao deletar post"));
    }
  };

  const handleUpdatePost = async (postId: string) => {
    if (!editContent.trim()) return;
    try {
      await GroupPostService.update(groupId, postId, { content: editContent });
      setEditingPostId(null);
      fetchPosts();
      toast.success("Post atualizado");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      toast.error(getErrorMessage(error, "Erro ao atualizar post"));
    }
  };

  const startEditing = (post: GroupPostResponse) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  return (
    <div className="space-y-6">
      {/* Create Post Area */}
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
        <Textarea
          placeholder="Escreva algo para compartilhar com o grupo..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="mb-3 resize-none border-none focus-visible:ring-0 shadow-none px-0"
          rows={3}
        />
        <div className="flex justify-end pt-2 border-t border-gray-100 mt-2">
          <Button
            onClick={handleCreatePost}
            disabled={isSubmitting || !newPostContent.trim()}
            className="rounded-full px-6"
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 animate-pulse">Carregando posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-100">
          <p className="mb-2 text-lg font-medium text-gray-700">Nenhum post encontrado</p>
          <p>Seja o primeiro a compartilhar algo com o grupo!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            // Adaptação para o objeto author do backend
            const author = post.author ||
              (post as any).user || { name: "Membro", id: post.authorId || (post as any).userId };
            const isAuthor = String(currentUserMember.userId) === String(author.id);
            const canDelete =
              isAuthor || currentUserMember.role === "admin" || currentUserMember.role === "owner";
            const canEdit = isAuthor;

            return (
              <div
                key={post.id}
                className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {author.name ? author.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{author.name}</p>
                      <p className="text-xs text-gray-500">
                        {post.createdAt
                          ? formatDistanceToNow(new Date(post.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })
                          : "Recentemente"}
                      </p>
                    </div>
                  </div>

                  {(canEdit || canDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-gray-700"
                        >
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit && (
                          <DropdownMenuItem onClick={() => startEditing(post)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                        )}
                        {canDelete && (
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {editingPostId === post.id ? (
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="mb-3 bg-white"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingPostId(null)}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={() => handleUpdatePost(post.id)}>
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
