import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditMode } from "@/types/calendar";
import { motion } from "framer-motion";

interface RecurringLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEditModeSelect: (mode: EditMode) => void;
  isUpdate?: boolean;
}

export default function RecurringLessonDialog({
  isOpen,
  onClose,
  onEditModeSelect,
  isUpdate = false
}: RecurringLessonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Tekrarlanan Dersi Düzenle' : 'Tekrarlanan Ders Oluştur'}
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mt-4"
        >
          {isUpdate ? (
            <>
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onEditModeSelect('single')}
              >
                Sadece Bu Dersi Düzenle
              </Button>
              
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onEditModeSelect('future')}
              >
                Bu Ders ve Sonraki Dersleri Düzenle
              </Button>
              
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => onEditModeSelect('all')}
              >
                Tüm Seriyi Düzenle
              </Button>
            </>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Tekrarlanan ders serisi oluşturmak üzeresiniz.
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}