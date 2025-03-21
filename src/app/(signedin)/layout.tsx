import Navbar from "@/components/NavBar";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = async ({ children }) => {
  const user = await getCurrentUser();

  console.log("user", user);

  if (!user) {
    redirect("/auth");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
