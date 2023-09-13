"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import React from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const login = (provider: string) => {
    try {
      signIn(provider, { callbackUrl: "http://localhost:3000/admin" });
      toast.success("Logged In!");
    } catch (error: any) {
      // Handle errors, possibly by displaying an error message using toast.error() or other means
      console.error("Login failed:", error);
      toast.error(`Error: ${error.message}`);
    }
  };
  return (
    <div>
      <button onClick={() => login("github")}>Login With Github</button>
      <button onClick={() => login("google")}>Login With Google</button>
    </div>
  );
};

export default Page;
