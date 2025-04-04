
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Ders, öğrenci veya tarih ara..."
        className={`w-full pl-10 bg-muted/30 border-none focus:ring-0 ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
