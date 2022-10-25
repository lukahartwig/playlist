import "tailwindcss/tailwind.css";

import { ReactNode } from "react";
import { Inter } from "@next/font/google";
import { NavHeader } from "./NavHeader";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <html lang="en" className={`h-full ${inter.className}`}>
      <body className="h-full">
        <div className="min-h-full">
          <NavHeader />
          <div className="py-10">
            <main>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
