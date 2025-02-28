import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";
import AuthProvider from "@/context/AuthContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <WebSocketProvider>
            <TooltipProvider>
              <main className="">{children}</main>
            </TooltipProvider>

          </WebSocketProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
