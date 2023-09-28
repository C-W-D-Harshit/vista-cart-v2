"use client";

import { handleRemove } from "@/actions/account";
import { Button, Select, Separator } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import React from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session }: { data: any } = useSession();
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  return (
    <div className="account">
      <h2>Settings</h2>
      <p>
        Manage your <strong>Vista Cart</strong> account and theme here...
      </p>
      <Separator size={"4"} mb={"4"} mt={"4"} />
      <div style={{ margin: "2rem 0" }}>
        <h3 style={{ marginBottom: "1rem" }}>Theme</h3>
        <Select.Root onValueChange={(value) => setTheme(value as string)}>
          <Select.Trigger placeholder="Select a Theme" />
          <Select.Content>
            <Select.Item value="dark">Dark</Select.Item>
            <Select.Item value="light">Light</Select.Item>
            <Select.Item value="system">System</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <Button
        color="red"
        size={"3"}
        onClick={() => {
          handleRemove({ id: session?.user?.id });
          signOut();
          toast("Account Deleted");
        }}
      >
        Delete Account
      </Button>
    </div>
  );
};

export default Page;
