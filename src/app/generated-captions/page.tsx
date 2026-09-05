"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import React from "react";

export default function GeneratedCaptionsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    // Optionally render nothing while redirecting
    return null;
  }

  // Replace this with your actual generated captions UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Your Generated Captions</h1>
        {/* Render your list of generated captions here */}
        <p className="text-gray-600">No captions to show yet.</p>
      </div>
    </div>
  );
}