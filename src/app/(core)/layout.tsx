import AppSidebar from "@/components/Sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PomodoroProvider } from "@/context/pomodoro";
import { Toaster } from "sonner";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PomodoroProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="absolute flex h-24 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-18">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="w-full h-screen bg-background p-12 py-6 overflow-y-auto">{children}</div>
        </SidebarInset>
        <Toaster />
      </PomodoroProvider>
    </SidebarProvider>
  );
}
