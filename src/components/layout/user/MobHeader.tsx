"use client";

import React from "react";
import "@/styles/layout/user/mobheader.scss";
import { usePathname } from "next/navigation";
import { AiOutlineSearch } from "react-icons/ai";
import {
  BiCart,
  BiHeart,
  BiHomeAlt,
  BiMenuAltLeft,
  BiSearchAlt,
} from "react-icons/bi";
import { useStore } from "zustand";
import useCartStore from "@/store/cart";
import useWishlistStore from "@/store/wishlist";
import "@/styles/layout/user/header.scss";
import { MdOutlineAccountBox } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { DropdownMenu } from "@radix-ui/themes";
import Image from "next/image";
import { BsShopWindow } from "react-icons/bs";

const MobHeader = () => {
  const path = usePathname();
  const cartNo = useStore(useCartStore, (state) => state.cartQuantity);
  const wishlistNo = useStore(useWishlistStore, (state) => state.wishlistCount);
  const { data: session }: { data: any } = useSession();
  // console.log(session);
  const router = useRouter();
  // console.log(store);
  // const user = false;
  const logout = async () => {
    signOut({ redirect: false });
    router.push("/");
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
    <div className="mobHeader">
      <Link href="/shop">
        <BsShopWindow />
      </Link>
      <Link href="/wishlist">
        <BiHeart />
        <span className="span_v">{wishlistNo}</span>
      </Link>
      <Link href="/">
        <BiHomeAlt />
      </Link>
      <Link href="/cart">
        <BiCart />
        <span>{cartNo}</span>
      </Link>
      {session ? (
        <div>
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
              <div className="heade_user_img">
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
        <div>
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

export default MobHeader;
