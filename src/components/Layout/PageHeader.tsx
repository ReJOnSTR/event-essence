import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, backTo, backLabel, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b bg-white sticky top-0 z-10">
      <SidebarTrigger className="h-8 w-8 shrink-0" />
      {backTo && <BackButton to={backTo} label={backLabel} />}
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
}