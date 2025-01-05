import React from 'react';
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { CalendarEvent } from "@/types/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface CalendarInteractionHandlerProps {
  children: React.ReactNode;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
}

export const CalendarInteractionHandler = ({
  children,
  onDateSelect,
  onEventClick,
  onEventUpdate,
}: CalendarInteractionHandlerProps) => {
  const session = useSession();
  const { toast } = useToast();

  const handleDateSelect = (date: Date) => {
    if (!session) {
      toast({
        title: "Giriş Yapmanız Gerekiyor",
        description: "Takvimi düzenlemek için lütfen giriş yapın.",
        variant: "destructive",
      });
      return;
    }
    onDateSelect(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (!session) {
      toast({
        title: "Giriş Yapmanız Gerekiyor",
        description: "Dersleri düzenlemek için lütfen giriş yapın.",
        variant: "destructive",
      });
      return;
    }
    onEventClick(event);
  };

  const handleEventUpdate = (event: CalendarEvent) => {
    if (!session) {
      toast({
        title: "Giriş Yapmanız Gerekiyor",
        description: "Dersleri düzenlemek için lütfen giriş yapın.",
        variant: "destructive",
      });
      return;
    }
    onEventUpdate(event);
  };

  return (
    <div className="relative">
      {React.cloneElement(children as React.ReactElement, {
        onDateSelect: handleDateSelect,
        onEventClick: handleEventClick,
        onEventUpdate: handleEventUpdate,
      })}
      
      {!session && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] flex items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="shadow-lg">
                <LogIn className="h-4 w-4 mr-2" />
                Düzenlemek için Giriş Yapın
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Takvimi görüntüleyebilirsiniz ancak düzenlemek için giriş yapmanız gerekmektedir.
              </p>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};