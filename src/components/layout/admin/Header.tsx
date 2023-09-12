"use client";

import "@/styles/layout/admin/Header.scss";
import { Avatar, Button, DropdownMenu, Tooltip } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import { BiBell } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";

const Header = () => {
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
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                fallback="S"
                radius="full"
              />
              <div>
                <div>
                  <p>Harshit</p>
                  <AiOutlineDown />
                </div>
                <p>Admin</p>
              </div>
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
            <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                <DropdownMenu.Separator />
                <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator />
            <DropdownMenu.Item>Share</DropdownMenu.Item>
            <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default Header;
