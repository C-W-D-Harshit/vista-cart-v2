"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import "@radix-ui/themes/styles.css";
import { Theme, ThemePanel } from "@radix-ui/themes";

function NextThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Theme>{children}</Theme>
    </ThemeProvider>
  );
}

export default NextThemeProvider;
