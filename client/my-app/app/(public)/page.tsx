"use client";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useRouter } from "next/navigation";
import { UserRole } from "@/lib/types";

export default function Home() {
  const router = useRouter();

  const selectRole = (role: UserRole) => {
    localStorage.setItem("userRole", role);
    if (role === UserRole.Victim) router.push("/victim");
    else if (role === UserRole.Rescuer) router.push("/dashboard");
    else if (role === UserRole.commander) router.push("/overview");
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 h-full w-full 
          bg-[radial-gradient(#4a5568_1px,transparent_1px)] 
          [background-size:20px_20px]"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2 tracking-tight">
          Emergency Response
        </h1>
        <p className="text-neutral-400 text-center mb-8">
          Rapid coordination when every second counts
        </p>

        <CardSpotlight className="h-auto w-full max-w-sm">
          <h2 className="text-xl font-bold relative z-20 mt-2 text-white text-center">
            Select Your Role
          </h2>
          <p className="text-neutral-300 mt-2 relative z-20 text-sm text-center">
            Choose how you want to enter the system
          </p>

          <div className="mt-6 space-y-3 relative z-20">
            <button
              onClick={() => selectRole(UserRole.Victim)}
              className="w-full flex items-center gap-3 rounded-lg border border-red-500/30 
                                    bg-red-500/10 px-4 py-3 text-left text-white 
                                    hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
            >
              <span className="text-2xl">🚨</span>
              <div>
                <p className="font-semibold">I Need Help</p>
                <p className="text-xs text-neutral-400">Report an emergency</p>
              </div>
            </button>

            <button
              onClick={() => selectRole(UserRole.Rescuer)}
              className="w-full flex items-center gap-3 rounded-lg border border-emerald-500/30 
                                    bg-emerald-500/10 px-4 py-3 text-left text-white 
                                    hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300"
            >
              <span className="text-2xl">🚑</span>
              <div>
                <p className="font-semibold">Rescue Team</p>
                <p className="text-xs text-neutral-400">
                  View tasks & coordinate
                </p>
              </div>
            </button>

            <button
              onClick={() => selectRole(UserRole.commander)}
              className="w-full flex items-center gap-3 rounded-lg border border-blue-500/30 
                                    bg-blue-500/10 px-4 py-3 text-left text-white 
                                    hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
            >
              <span className="text-2xl">🧠</span>
              <div>
                <p className="font-semibold">Command Center</p>
                <p className="text-xs text-neutral-400">Monitor & optimize</p>
              </div>
            </button>
          </div>
        </CardSpotlight>
      </div>
    </main>
  );
}
