'use client'
import React from 'react'
import { SignedIn, SignedOut, UserButton,SignUpButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <div><header>
            <div className="flex items-center justify-between p-4 bg-blue-100 shadow-md">
              <h1 className="text-2xl font-bold justify-between flex gap-2 ">
                <Sparkles className="h-8 w-8 text-blue-500" />
                LinkedIn Caption Generator
              </h1>
              <div className="flex items-center space-x-4">
                <SignedIn>
                  <Link href="/generated-captions" passHref>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:inline-flex"
                    >
                      Generated Captions
                    </Button>
                  </Link>
                  <UserButton />
                </SignedIn>

                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:inline-flex"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>
      </header>
      </div>
  )
}
