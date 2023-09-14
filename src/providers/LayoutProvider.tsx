"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AdminLayoutProvider from "./AdminLayoutProvider";
import UserLayoutProvider from "./UserLayoutProvider";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  if (path.startsWith("/admin")) {
    return <AdminLayoutProvider>{children}</AdminLayoutProvider>;
  }
  if (path.startsWith("/auth")) {
    return <>{children}</>;
  }
  if (path.startsWith("/denied")) {
    return <>{children}</>;
  }

  return <UserLayoutProvider>{children}</UserLayoutProvider>;
}
