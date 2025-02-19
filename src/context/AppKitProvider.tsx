"use client";
import React, { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { ethersAdapter, projectId, networks } from "@/config";

// 1. Get projectId at https://cloud.reown.com
if (!projectId) {
  throw new Error("Project ID is not defined");
}
// 2. Create a metadata object
const metadata = {
  name: "Mock Uniswap",
  description: "DESC",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

export const modal = createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "light",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

export function AppKitProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
