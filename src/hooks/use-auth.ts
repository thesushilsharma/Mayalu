"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/firebase-auth-provider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a Providers component");
  }
  return context;
};
