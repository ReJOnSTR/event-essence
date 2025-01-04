import { Student } from "@/types/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import StudentDialogContent from "./StudentDialogContent";

interface StudentDialogProps {
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
}

const dialogVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 10
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring",
      duration: 0.3,
      bounce: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function StudentDialog({
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
}: StudentDialogProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden p-0">
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

              <StudentDialogContent
                student={student}
                studentName={studentName}
                setStudentName={setStudentName}
                studentPrice={studentPrice}
                setStudentPrice={setStudentPrice}
                studentColor={studentColor}
                setStudentColor={setStudentColor}
                onDelete={handleDelete}
              />

              <DialogFooter className="flex items-center justify-end mt-6">
                <motion.div 
                  className="flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Button variant="outline" onClick={onClose}>
                    İptal
                  </Button>
                  <Button onClick={onSave}>
                    {student ? "Güncelle" : "Ekle"}
                  </Button>
                </motion.div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}