"use client";

import { createContext, useContext, useState } from "react";

type DrawerContextType = {
  open: boolean;
  title: string;
  content: React.ReactNode;
  openDrawer: (title: string, content: React.ReactNode) => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

export function DrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState("");

  const openDrawer = (title: string, node: React.ReactNode) => {
    setTitle(title);
    setContent(node);
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
    // delay clearing content for smooth close animation
    setTimeout(() => {
      setContent(null);
      setTitle("");
    }, 300);
  };

  return (
    <DrawerContext.Provider
      value={{ open, openDrawer, closeDrawer, content, title }}
    >
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used inside DrawerProvider");
  return ctx;
}