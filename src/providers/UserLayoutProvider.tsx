"use client";

import "@/styles/layout/user/layout.scss";
import Header from "@/components/layout/user/Header";
import React from "react";
import Sidebar from "@/components/layout/user/Sidebar";
import NextTopLoader from "nextjs-toploader";

function UserLayoutProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader showSpinner={false} color="#fbe385" />
      <div className="userLayoutProvider">
        <Sidebar />
        <div>
          <Header />
          {children}
        </div>
      </div>
    </>
  );
}

export default UserLayoutProvider;
