"use client";

import "@/styles/layout/user/layout.scss";
import Header from "@/components/layout/user/Header";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/user/Sidebar";
import NextTopLoader from "nextjs-toploader";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@radix-ui/themes";
import MobHeader from "@/components/layout/user/MobHeader";
import useCartStore from "@/store/cart";
import useWishlistStore from "@/store/wishlist";

function UserLayoutProvider({ children }: { children: React.ReactNode }) {
  const { data: session }: { data: any } = useSession();
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useWishlistStore.persist.rehydrate();
  }, []);
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
      <MobHeader />
    </>
  );
}

export default UserLayoutProvider;
