"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminLayoutProvider from "./AdminLayoutProvider";
import UserLayoutProvider from "./UserLayoutProvider";
import Loader from "@/components/essentials/Loader";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100dvh",
        }}
      >
        <Loader />
      </div>
    );
  }

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
