"use client";
import React, { useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import "./styles.css";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme(); // Assume 'light' is the initial theme

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Switch.Root
          className="SwitchRoot"
          defaultChecked={theme === "dark"}
          checked={theme === "dark"}
          onCheckedChange={toggleTheme}
          value={theme}
        >
          <Switch.Thumb className="SwitchThumb" />
        </Switch.Root>
      </div>
    </form>
  );
};

export default ThemeSwitch;
