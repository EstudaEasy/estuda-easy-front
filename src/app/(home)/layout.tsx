import Sidebar from "@/components/Sidebar/sidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <Sidebar></Sidebar>
      <div className="w-full h-screen ml-[300px]">{children}</div>
    </div>
  );
}
