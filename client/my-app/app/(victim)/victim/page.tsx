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
    <main className="min-h-screen p-4 relative flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start space-y-4 lg:space-y-0 lg:space-x-4 ">
      <div
        className="w-full md:w-[80%] lg:w-[50%] mx-auto lg:mx-0 lg:ml-4 relative h-125 border-2 border-gray-300 rounded-md overflow-hidden"
        style={{ zIndex: 20 }}
      >
        <Map />
      </div>
      <div></div>
    </main>
  );
}
