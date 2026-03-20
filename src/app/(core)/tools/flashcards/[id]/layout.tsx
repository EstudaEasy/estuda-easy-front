import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return { title: "Flashcards | EstudaEasy" };
  }

  try {
    const res = await fetch(`${baseUrl}/decks/${id}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: `${data.name} | EstudaEasy`,
        openGraph: {
          title: `${data.name} | EstudaEasy`,
          description: data.description || "Confira este deck de flashcards no EstudaEasy!",
          images: [{ url: "/images/EstudaEasyLogoPrincipal.png" }],
        },
      };
    }
  } catch (error) {
    console.error("SEO Metadata Error (Flashcards):", error);
  }

  return { title: "Flashcards | EstudaEasy" };
}

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
