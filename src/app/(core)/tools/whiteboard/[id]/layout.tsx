import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    return { title: "Whiteboard | EstudaEasy" };
  }

  try {
    const res = await fetch(`${baseUrl}/whiteboards/${id}`);
    if (res.ok) {
      const data = await res.json();
      return {
        title: `${data.title} | EstudaEasy`,
        openGraph: {
          title: `${data.title} | EstudaEasy`,
          description: "Confira este Quadro Branco incrível no EstudaEasy!",
          images: [{ url: "/images/EstudaEasyLogoPrincipal.png" }],
        },
      };
    }
  } catch (error) {
    console.error("SEO Metadata Error (Whiteboard):", error);
  }

  return { title: "Whiteboard | EstudaEasy" };
}

export default function WhiteboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
