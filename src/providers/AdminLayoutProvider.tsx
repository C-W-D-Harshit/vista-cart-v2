"use client";

import "@/styles/layout/admin/Layout.scss";
import Header from "@/components/layout/admin/Header";
import React from "react";
import Sidebar from "@/components/layout/admin/Sidebar";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";

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
      <div className="mobAdmin">
        <h1>Use Pc to view admin panel</h1>
        <Link href="/">
          <h3>Go back</h3>
        </Link>
      </div>
    </>
  );
}

export default AdminLayoutProvider;
