"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type DrawerType = "details" | "edit" | null;

type DrawerContextType = {
  isOpen: boolean;
  type: DrawerType;
  data: any;
  openDrawer: (type: DrawerType, data?: any) => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<DrawerType>(null);
  const [data, setData] = useState<any>(null);

  const openDrawer = (t: DrawerType, d?: any) => {
    setType(t);
    setData(d || null);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => {
      setType(null);
      setData(null);
    }, 250);
  };

  return (
    <DrawerContext.Provider
      value={{ isOpen, type, data, openDrawer, closeDrawer }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be inside DrawerProvider");
  return ctx;
};