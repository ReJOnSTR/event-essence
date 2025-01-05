import { Outlet } from "react-router-dom";
import SideMenu from "@/components/Layout/SideMenu";
import PageHeader from "@/components/Layout/PageHeader";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <SideMenu />
      <div className="flex-1 flex flex-col">
        <PageHeader />
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;