"use client";

import { Avatar, DropdownMenu, Tooltip } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineSearch } from "react-icons/ai";
import { BiCart, BiHeart } from "react-icons/bi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import "@/styles/layout/user/header.scss";
import Image from "next/image";

const Header = () => {
  const { data: session }: { data: any } = useSession();
  const user = false;
  const logout = async () => {
    signOut();
    toast.success("Logged Out!");
  };
  const userName = session?.user?.name as string;

  const userInitials = session?.user?.name ? session?.user?.name[0] : "S";

  function extractFirstName(username: string): string | null {
    // Define the separator character (e.g., underscore or space)
    const separator = " "; // Change this to the appropriate separator

    // Split the username into parts based on the separator
    const parts = username.split(separator);

    // Check if there is at least one part (the first name)
    if (parts.length > 0) {
      return parts[0]; // The first part is the first name
    } else {
      return null; // No first name found
    }
  }

  const firstName = session?.user ? extractFirstName(userName) : "User";

  const userImage = session?.user?.image || "/user.avif";
  return (
    <div className="header">
      <div className="header__search">
        <AiOutlineSearch />
        <input type="text" placeholder="Search for Products..." />
      </div>
      <div className="header__cart">
        <BiCart />
        <span>3</span>
      </div>
      <div className="header__cart">
        <BiHeart />
        <span className="span_v">2</span>
      </div>
      {session ? (
        <div className="header__user">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {/* <Avatar
                src={userImage}
                // src="/user.avif"
                fallback={userInitials}
                // fallback="b"
                radius="full"
                size={"3"}
              /> */}
              <div className="header_user_img">
                <Image
                  alt={userInitials}
                  src={userImage}
                  width={50}
                  height={50}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>
                <Link href="/account">Account</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={logout}>Logout</DropdownMenu.Item>
              {session?.user?.role === "admin" && (
                <>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>
                    <Link href="/admin">Admin</Link>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      ) : (
        <div className="header__user">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <div className="header_user_img">
                <Image
                  alt={userInitials}
                  src={userImage}
                  width={50}
                  height={50}
                />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <Link href="/auth/login">
                <DropdownMenu.Item>Login</DropdownMenu.Item>
              </Link>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      )}
    </div>
  );
};

export default Header;
