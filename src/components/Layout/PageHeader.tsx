import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BackButton } from "@/components/ui/back-button";

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, backTo, backLabel, actions, children }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-md hover:bg-accent" />
        {backTo && <BackButton to={backTo} label={backLabel} />}
      </div>
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {children || actions ? <div className="ml-auto">{children || actions}</div> : null}
    </div>
  );
}