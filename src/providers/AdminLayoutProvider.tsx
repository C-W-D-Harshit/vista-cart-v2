"use client";

import "@/styles/layout/admin/Layout.scss";
import Header from "@/components/layout/admin/Header";
import React from "react";
import Sidebar from "@/components/layout/admin/Sidebar";

function AdminLayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="adminLayoutProvider">
      <Sidebar />
      <div>
        <Header />
        {children}
      </div>
    </div>
  );
}

export default AdminLayoutProvider;
