import SideNavigation from "@/components/common/SideNavigation";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SideNavigation />
      <div>{children}</div>
    </>
  );
}

export default Layout;
