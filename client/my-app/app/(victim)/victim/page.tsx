"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse rounded-md" />
  ),
});

export default function VictimPage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen p-4 relative">
      <div
        className="container mx-auto w-full md:w-[80%] lg:w-[70%] relative "
        style={{ zIndex: 20 }}
      >
        <Map />
      </div>
    </main>
  );
}
