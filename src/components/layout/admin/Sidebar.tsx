"use client";

import "@/styles/layout/admin/Sidebar.scss";
import { usePathname } from "next/navigation";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { BiSolidDashboard } from "react-icons/bi";
import Link from "next/link";
import { Switch } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsCart3, BsCreditCard2FrontFill, BsPeopleFill } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { PiTruckDuotone } from "react-icons/pi";
import { RxExit } from "react-icons/rx";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

interface MenuItem {
  icon: React.ReactNode; // Assuming BiSolidDashboard returns React components
  text: string;
  link: string;
}

const Sidebar = () => {
  const path = usePathname();
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Your logic to determine the initial state
    const initialCheckedState = localStorage.getItem("theme") === "dark";
    setChecked(initialCheckedState);
  }, []);

  const toggleDarkMode = () => {
    // Toggle the theme between 'light' and 'dark' (or your theme logic)
    setTheme(theme === "light" ? "dark" : "light");
    const initialCheckedState = localStorage.getItem("theme") === "dark";
    setChecked(initialCheckedState);
  };
  const data: MenuItem[] = [
    {
      icon: <BiSolidDashboard />,
      text: "overview",
      link: "/admin",
    },
    {
      icon: <BsCart3 />,
      text: "orders",
      link: "/admin/orders",
    },
    {
      icon: <HiMiniShoppingBag />,
      text: "products",
      link: "/admin/products",
    },
    {
      icon: <BsPeopleFill />,
      text: "customers",
      link: "/admin/customers",
    },
    {
      icon: <TbReportAnalytics />,
      text: "reports",
      link: "/admin/reports",
    },
    {
      icon: <BsCreditCard2FrontFill />,
      text: "transactions",
      link: "/admin/transactions",
    },
    {
      icon: <PiTruckDuotone />,
      text: "Shipment",
      link: "/admin/shipment",
    },
  ];
  const logout = async () => {
    signOut();
    toast.success("Logged Out!");
  };
  return (
    <div className="adminSidebar">
      <div className="adminSidebar__logo">
        <HiMiniShoppingBag />
        <p>Vista</p>
      </div>
      <div className="adminSidebar__menu">
        {data.map((dat: MenuItem, i: number) => {
          return (
            <div
              key={i}
              className={path === dat.link ? "adminSidebar__menu_act" : ""}
            >
              <Link href={dat.link}>
                {dat.icon}
                <p>{dat.text}</p>
              </Link>
              <div style={{ opacity: path === dat.link ? "1" : "0" }} />
            </div>
          );
        })}
      </div>
      <div className="adminSidebar__menu">
        <div onClick={logout}>
          <div>
            <RxExit />
            <p>Logout</p>
          </div>
          <div style={{ display: "none" }} />
        </div>
      </div>
      <div onClick={toggleDarkMode}>
        <p>Dark Mode</p>
        <Switch
          radius="full"
          mr="2"
          // onCheckedChange={toggleDarkMode}
          checked={checked}
        />
      </div>
    </div>
  );
};

export default Sidebar;
