import { Plus, FileBarChart, Calendar, Users, Search as SearchIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Student } from "@/types/calendar";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup, 
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudents } from "@/hooks/useStudents";
import { useStudentStore } from "@/store/studentStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { StudentSearchResults } from "./StudentSearchResults";

export default function SideMenu() {
  const { students } = useStudents();
  const location = useLocation();
  const { openDialog, setSelectedStudent } = useStudentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleAddStudent = () => {
    openDialog();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(query.length > 0);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const menuItems = [
    { path: "/calendar", icon: Calendar, label: "Takvim" },
    { path: "/students", icon: Users, label: "Öğrenciler" },
    { path: "/reports", icon: FileBarChart, label: "Raporlar" },
  ];

  return (
    <div className="flex flex-col h-full bg-background w-full">
      <SidebarGroup className="space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="block"
          >
            <SidebarMenuButton 
              className="w-full hover:bg-secondary rounded-md transition-colors"
              data-active={isActive(item.path)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        ))}
      </SidebarGroup>

      <SidebarGroup className="mt-6">
        <SidebarGroupLabel className="px-2">Öğrenciler</SidebarGroupLabel>
        <SidebarGroupContent className="mt-2">
          <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <div className="space-y-2">
              <div className="px-2">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Öğrenci ara..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-8"
                  />
                </div>
              </div>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <StudentSearchResults 
                  students={filteredStudents}
                  onStudentClick={handleStudentClick}
                  searchQuery={searchQuery}
                />
              </SheetContent>
            </div>
          </Sheet>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleAddStudent}
                className="w-full hover:bg-secondary rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Öğrenci Ekle</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <ScrollArea className="h-[200px] px-1">
              {students.map((student) => (
                <SidebarMenuItem key={student.id}>
                  <SidebarMenuButton 
                    onClick={() => handleStudentClick(student)}
                    className="w-full hover:bg-secondary rounded-md transition-colors group"
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: student.color }}
                    />
                    <span className="truncate group-hover:text-secondary-foreground">
                      {student.name}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </ScrollArea>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}