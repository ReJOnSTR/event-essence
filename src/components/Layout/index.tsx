import { Outlet } from "react-router-dom";
import SideMenu from "@/components/Layout/SideMenu";
import { PageHeader } from "@/components/Layout/PageHeader";
import { useState } from "react";

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex h-screen">
      <SideMenu searchTerm={searchTerm} />
      <div className="flex-1 flex flex-col">
        <PageHeader title="Calendar" />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;