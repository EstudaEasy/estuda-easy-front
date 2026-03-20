import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return { title: "Quiz | EstudaEasy" };
  }

  try {
    const res = await fetch(`${baseUrl}/quizzes/${id}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: `${data.title} | EstudaEasy`,
        openGraph: {
          title: `${data.title} | EstudaEasy`,
          description: data.description || "Confira este Quiz incrível no EstudaEasy!",
          images: [{ url: "/images/EstudaEasyLogoPrincipal.png" }],
        },
      };
    }
  } catch (error) {
    console.error("SEO Metadata Error (Quiz):", error);
  }

  return { title: "Quiz | EstudaEasy" };
}

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
