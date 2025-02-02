import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Görevler",
  description: "Görev yönetimi",
};

interface TasksLayoutProps {
  children: React.ReactNode;
}

export default function TasksLayout({ children }: TasksLayoutProps) {
  return (
    <div className="flex-1 flex flex-col space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Görevler</h2>
          <p className="text-muted-foreground">
            Görev yönetimi sayfası
          </p>
        </div>
      </div>
      <div className="flex-1 space-y-4">{children}</div>
    </div>
  );
} 