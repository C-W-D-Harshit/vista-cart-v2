"use client";

import { handleRemove } from "@/actions/account";
import { AlertDialog, Button, Select, Separator, Flex } from "@radix-ui/themes";
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
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" size={"3"}>
            Delete Account
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content style={{ maxWidth: 450 }}>
          <AlertDialog.Title>Delete Account</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure?
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button
                variant="solid"
                color="red"
                onClick={() => {
                  handleRemove({ id: session?.user?.id });
                  signOut();
                  toast("Account Deleted");
                }}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
};

export default Page;
