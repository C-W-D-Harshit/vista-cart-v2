"use client";

import "@/styles/layout/admin/Layout.scss";
import Header from "@/components/layout/admin/Header";
import React from "react";
import Sidebar from "@/components/layout/admin/Sidebar";
import NextTopLoader from "nextjs-toploader";

function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader showSpinner={false} color="#5c59e8" />
      <div className="adminLayoutProvider">
        <Sidebar />
        <div>
          <Header />
          {children}
        </div>
      </div>
    </>
  );
}

export default AdminLayoutProvider;
