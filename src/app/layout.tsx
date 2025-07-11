import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkedIn Caption Generator",
  description: "Generate captions for your LinkedIn posts about your projects using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header>
          <div className="flex items-center justify-between p-4 bg-blue-100 shadow-md">
            <h1 className="text-2xl font-bold">LinkedIn Caption Generator</h1>
            <div className="flex items-center space-x-4" >
              <SignedIn >
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton>Sign In</SignInButton>
                <SignUpButton>Sign Up</SignUpButton>
              </SignedOut>
            </div>
          </div>
      </header>
        {children}
      </body>
      </html>
    </ClerkProvider>
  );
}
