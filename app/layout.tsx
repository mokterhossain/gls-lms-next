import "./globals.css";

import { ThemeProvider } from "./context/theme-context";
import FloatingThemeSwitcher from "./components/FloatingThemeSwitcher";

import { DrawerProvider } from "./components/ui/drawer";
import DrawerPanel from "./components/ui/drawer-panel";

import { ConfirmProvider } from "./components/ui/confirm-dialog";
import { ToastProvider } from "./components/ui/toast-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">

        <ThemeProvider>

          <ToastProvider>
            <ConfirmProvider>
              <DrawerProvider>

                {/* GLOBAL UI */}
                <FloatingThemeSwitcher />

                {/* MUST be inside DrawerProvider */}
                <DrawerPanel />

                {/* APP */}
                {children}

              </DrawerProvider>
            </ConfirmProvider>
          </ToastProvider>

        </ThemeProvider>

      </body>
    </html>
  );
}