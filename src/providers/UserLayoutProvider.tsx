"use client";

import "@/styles/layout/user/layout.scss";
import Header from "@/components/layout/user/Header";
import React from "react";
import Sidebar from "@/components/layout/user/Sidebar";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@radix-ui/themes";

function UserLayoutProvider({ children }: { children: React.ReactNode }) {
  const { data: session }: { data: any } = useSession();
  return (
    <>
      <NextTopLoader showSpinner={false} color="#fbe385" />

      <div className="userLayoutProvider">
        <Sidebar />
        <div>
          {session?.user.verified === false && (
            <div
              style={{
                width: "100%",
                padding: ".7rem 1.5rem",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fbe385",
                gap: "2rem",
              }}
            >
              <p style={{ color: "black", fontWeight: "bold" }}>
                Please verify your email
              </p>
              <Link href={`/auth/new?email=${session?.user.email}`}>
                <Button>Verify</Button>
              </Link>
            </div>
          )}
          <Header />
          {children}
        </div>
      </div>
    </>
  );
}

export default UserLayoutProvider;
