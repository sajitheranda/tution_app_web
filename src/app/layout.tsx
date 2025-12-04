import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata = {
  title: "MyTutor - Sri Lankan Teacher Platform",
  description: "Manage your individual, group, and mass classes efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}