import DashboardHeader from "@/components/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen w-full flex-col max-md:flex-col-reverse">
            <DashboardHeader/>
            <div className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                {children}
            </div>
        </main>
    )
}