"use client";

import "@/styles/layout/user/sidebar.scss";
import {
  BsHandbagFill,
  BsLightbulb,
  BsLightbulbOff,
  BsLightningCharge,
  BsLightningChargeFill,
} from "react-icons/bs";
// import ThemeSwitch from "../ui/user/sidebar/Switch";
import { GiClothes, GiConverseShoe } from "react-icons/gi";
import { MdSportsGymnastics } from "react-icons/md";
import { AiFillGift } from "react-icons/ai";
import { IoDiamondSharp } from "react-icons/io5";
import Link from "next/link";
import { Switch } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Your logic to determine the initial state
    const initialCheckedState =
      localStorage.getItem("theme") === "dark" ||
      localStorage.getItem("theme") === "system";
    setChecked(initialCheckedState);
    // const theme = systemTheme;
    // setChecked(theme === "dark");
    // console.log(checked, theme, resolvedTheme, theme);
  }, []);

  const toggleDarkMode = () => {
    // Toggle the theme between 'light' and 'dark' (or your theme logic)
    setTheme(theme === "light" ? "dark" : "light");
    const initialCheckedState = localStorage.getItem("theme") === "dark";
    setChecked(initialCheckedState);
  };
  return (
    <div className="userSidebar">
      <Link href="/" className="sidebar__logo">
        <p>Vista Cart</p>
      </Link>
      <div className="sidebar__menu">
        <p>Explore</p>
        <div>
          <Link href="/">
            <BsLightningCharge style={{ color: "#FBE385" }} />
            <p>New In</p>
          </Link>
          <Link href="/clothings">
            <GiClothes style={{ color: "#C09443" }} />
            <p>Clothings</p>
          </Link>
          <Link href="/shoes">
            <GiConverseShoe style={{ color: "purple" }} />
            <p>Shoes</p>
          </Link>
          <Link href="/accessories">
            <BsHandbagFill style={{ color: "#AA7D61" }} />
            <p>Accessories</p>
          </Link>
          <Link href="/activewear">
            <MdSportsGymnastics style={{ color: "#F8CADA" }} />
            <p>Activewear</p>
          </Link>
          <Link href="/gifts">
            <AiFillGift style={{ color: "red" }} />
            <p>Gifts</p>
          </Link>
          <Link href="/inspiration">
            <IoDiamondSharp style={{ color: "aqua" }} />
            <p>inspiration</p>
          </Link>
        </div>
      </div>
      <div className="sidebar__dark" onClick={toggleDarkMode}>
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
