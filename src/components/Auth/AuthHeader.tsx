import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface AuthHeaderProps {
  lessons?: any[];
  onSearchSelect?: (lesson: any) => void;
}

export default function AuthHeader({ lessons = [], onSearchSelect }: AuthHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    if (!lessons || lessons.length === 0) {
      toast({
        title: "Ders bulunamadı",
        description: "Arama yapılacak ders bulunmamaktadır.",
        variant: "destructive",
      });
      setIsSearching(false);
      return;
    }

    const results = lessons.filter((lesson) => {
      const searchableText = `${lesson.title} ${lesson.description || ''} ${format(new Date(lesson.start), 'dd MMMM yyyy HH:mm', { locale: tr })}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectResult = (lesson: any) => {
    if (onSearchSelect) {
      onSearchSelect(lesson);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Sadece takvim sayfasında arama özelliğini göster
  const showSearch = location.pathname === "/calendar";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        <div className="flex-1">
          {showSearch && (
            <div className="relative">
              <div className="flex items-center gap-2">
                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Ders ara..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {searchResults.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 w-full md:w-[300px] mt-1 bg-background border rounded-md shadow-lg z-50">
                  <div className="p-2 space-y-1 max-h-[300px] overflow-auto">
                    {searchResults.map((result) => (
                      <Button
                        key={result.id}
                        variant="ghost"
                        className="w-full justify-start text-left"
                        onClick={() => handleSelectResult(result)}
                      >
                        <div>
                          <div className="font-medium">{result.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(result.start), 'dd MMMM yyyy HH:mm', { locale: tr })}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Giriş Yap
          </Button>
          <Button size="sm">Kayıt Ol</Button>
        </div>
      </div>
    </header>
  );
}