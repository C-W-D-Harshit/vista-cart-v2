import React from "react";
import "@/styles/user/account.scss";
import Link from "next/link";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { MdOutlineSecurity } from "react-icons/md";
import { Separator } from "@radix-ui/themes";
import { BsCart4 } from "react-icons/bs";
import { AiFillSetting } from "react-icons/ai";
import { Metadata } from "next";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="accountLayout">
      <div className="accountSidebar">
        <Link href="/account">
          <RiAccountPinBoxLine />
          <p>Account Details</p>
        </Link>
        <Link href="/account/security">
          <MdOutlineSecurity />
          <p>Security</p>
        </Link>
        <Separator size={"4"} />
        <Link href="/account/orders">
          <BsCart4 />
          <p>Orders</p>
        </Link>
        <Link href="/account/settings">
          <AiFillSetting />
          <p>Settings</p>
        </Link>
      </div>
      {children}
    </div>
  );
};

export const metadata: Metadata = {
  title: "Account",
};

export default Layout;
