"use client";

import "@/styles/layout/admin/Header.scss";
import { Avatar, Button, DropdownMenu, Tooltip } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import { BiBell } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  // console.log(session);
  const path = usePathname();
  const data = [
    {
      path: "/admin",
      title: "Dashboard",
      description: "Detailed information about your store",
    },
    {
      path: "/admin/orders",
      title: "Orders",
      description: "Manage and view orders placed by customers",
    },
    {
      path: "/admin/products",
      title: "Products",
      description: "Add, edit, and manage your store's products",
    },
    {
      path: "/admin/customers",
      title: "Customers",
      description: "Manage your customer base and their information",
    },
    {
      path: "/admin/reports",
      title: "Reports",
      description: "View detailed reports and analytics",
    },
    {
      path: "/admin/transactions",
      title: "Transactions",
      description: "View and manage financial transactions",
    },
    {
      path: "/admin/shipment",
      title: "Shipment",
      description: "Track and manage shipments and deliveries",
    },
  ];

  const foundItems = data.filter((item) => path === item.path);

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

  const logout = async () => {
    signOut();
    toast.success("Logged Out!");
  };
  return (
    <div className="adminHeader">
      {foundItems.length > 0 ? (
        foundItems.map((item) => (
          // Render content when a match is found
          <div key={item.path}>
            <p>{item.title}</p>
            <p>{item.description}</p>
          </div>
        ))
      ) : (
        // Render "Not Found" message only once
        <div>
          <p>Not Found</p>
          <p>Go Back To Main Menu</p>
        </div>
      )}
      <div>
        <div className="adminHeader__search">
          <BsSearch />
          <input type="text" placeholder="Search..." />
        </div>

        <Tooltip content="Notifications">
          <div className="adminHeader__noti">
            <BiBell />
            <span />
          </div>
        </Tooltip>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="adminHeader__user">
              <Avatar
                src={session?.user?.image as string}
                fallback={userInitials}
                radius="full"
              />
              <div>
                <div>
                  <p>{firstName}</p>
                  <AiOutlineDown />
                </div>
                <p>Admin</p>
              </div>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <Link href={"/"}>
              <DropdownMenu.Item>Store</DropdownMenu.Item>
            </Link>
            <DropdownMenu.Item>Account</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color="red" onClick={logout}>
              Logout
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default Header;
