import "./globals.css";
import AuthProvider from "@/context/AuthContext";
import { WebSocketProvider } from "@/context/WebSocketContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
          <WebSocketProvider>
            <main className="">{children}</main>
          </WebSocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
