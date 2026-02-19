import Sidebar from "@/components/Sidebar/sidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <Sidebar></Sidebar>
      <div className="w-full h-screen ml-75 bg-background p-12 py-6 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
