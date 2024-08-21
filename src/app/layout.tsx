import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KardsAI",
  description: "Revolutionize your learning with AI-powered flashcards. Study smarter not harder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>

          <html suppressHydrationWarning={true} lang="en">
            <body suppressHydrationWarning={true} className={inter.className}>
              {
                /*
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                
                */
              }
              {children}
            </body>
          </html>

    </ClerkProvider>
  );
}
