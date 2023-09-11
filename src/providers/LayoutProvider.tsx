"use client"

import React from 'react';
import {usePathname} from "next/navigation"
import AdminLayoutProvider from './AdminLayoutProvider';

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode
  }) {

    const path = usePathname()

    if (path.startsWith("/admin")) {
        return (
            <AdminLayoutProvider>
                {children}
            </AdminLayoutProvider>
        )
    }

  return (
    <div>LayoutProvider</div>
  )
}

