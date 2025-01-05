import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Subject {
  id: string;
  name: string;
}

const subjects: Subject[] = [
  { id: "mathematics", name: "Matematik" },
  { id: "physics", name: "Fizik" },
  { id: "chemistry", name: "Kimya" },
  { id: "biology", name: "Biyoloji" },
  { id: "turkish", name: "Türkçe" },
  { id: "english", name: "İngilizce" },
  { id: "history", name: "Tarih" },
  { id: "geography", name: "Coğrafya" },
];

interface SubjectSelectProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
}

export function SubjectSelect({ selectedSubjects, onChange }: SubjectSelectProps) {
  const toggleSubject = (subjectId: string) => {
    if (selectedSubjects.includes(subjectId)) {
      onChange(selectedSubjects.filter(id => id !== subjectId));
    } else {
      onChange([...selectedSubjects, subjectId]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Öğrettiğiniz Dersler (En az bir ders seçiniz)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            type="button"
            onClick={() => toggleSubject(subject.id)}
            className={cn(
              "flex items-center justify-between px-3 py-2 text-sm border rounded-md transition-colors",
              selectedSubjects.includes(subject.id)
                ? "border-primary bg-primary/10 text-primary"
                : "border-input hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {subject.name}
            {selectedSubjects.includes(subject.id) && (
              <Check className="h-4 w-4 ml-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}