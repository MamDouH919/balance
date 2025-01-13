"use client"
import React from 'react'
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';

const ThemeProviderRTL = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppRouterCacheProvider
            options={{
                key: "muirtl",
                stylisPlugins: [prefixer, rtlPlugin]
            }}
        >
            {children}
        </AppRouterCacheProvider>
    )
}

export default ThemeProviderRTL