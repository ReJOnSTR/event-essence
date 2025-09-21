import { Student } from "@/types/calendar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import StudentDialogContent from "./StudentDialogContent";

interface StudentDialogWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  student?: Student;
  studentName: string;
  setStudentName: (name: string) => void;
  studentPrice: number;
  setStudentPrice: (price: number) => void;
  studentColor: string;
  setStudentColor: (color: string) => void;
  isSaving?: boolean;
}

const dialogVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.98,
    y: 4
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.25,
      ease: [0.23, 1, 0.32, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    y: 4,
    transition: { 
      duration: 0.2,
      ease: [0.23, 1, 0.32, 1]
    }
  }
};

export default function StudentDialogWrapper({
  isOpen,
  onClose,
  onSave,
  onDelete,
  student,
  studentName,
  setStudentName,
  studentPrice,
  setStudentPrice,
  studentColor,
  setStudentColor,
  isSaving = false,
}: StudentDialogWrapperProps) {
  const isMobile = useIsMobile();
  
  const handleSave = async () => {
    if (!studentName.trim() || isSaving) {
      return;
    }
    onSave();
  };

  const content = (
    <StudentDialogContent
      student={student}
      studentName={studentName}
      setStudentName={setStudentName}
      studentPrice={studentPrice}
      setStudentPrice={setStudentPrice}
      studentColor={studentColor}
      setStudentColor={setStudentColor}
      onDelete={onDelete}
      isSaving={isSaving}
    />
  );

  const footer = (
    <motion.div 
      className="flex gap-2 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.15 }}
    >
      <Button variant="outline" onClick={onClose} disabled={isSaving} className="flex-1 sm:flex-none">
        İptal
      </Button>
      <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none">
        {isSaving ? 'Kaydediliyor...' : student ? "Güncelle" : "Ekle"}
      </Button>
    </motion.div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={isSaving ? undefined : onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>
              {student ? "Öğrenci Düzenle" : "Öğrenci Ekle"}
            </DrawerTitle>
            <DrawerDescription>
              Öğrenci bilgilerini buradan ekleyebilir veya düzenleyebilirsiniz.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[60vh]">
            {content}
          </div>
          <DrawerFooter>
            {footer}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={isSaving ? undefined : onClose}>
      <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto p-0">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-6"
            >
              <DialogHeader>
                <DialogTitle>
                  {student ? "Öğrenci Düzenle" : "Öğrenci Ekle"}
                </DialogTitle>
                <DialogDescription>
                  Öğrenci bilgilerini buradan ekleyebilir veya düzenleyebilirsiniz.
                </DialogDescription>
              </DialogHeader>

              {content}

              <DialogFooter className="flex items-center justify-end mt-6">
                {footer}
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}