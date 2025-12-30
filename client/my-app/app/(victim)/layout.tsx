import VictimNavbar from "@/components/Navbar";
import RoleGaurd from "@/components/RollGaurd";
import { UserRole } from "@/lib/types";

export default function VictimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGaurd allowedRole={UserRole.Victim}>
      <div className="relative min-h-screen bg-white">
        {/* Background dots */}
        <div
          className="absolute inset-0 h-full w-full 
          bg-[radial-gradient(#d1d5db_1px,transparent_1px)] 
          [background-size:20px_20px] pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* Navbar */}
        <div
          className="fixed top-0 left-0 right-0 flex justify-center"
          style={{ zIndex: 50 }}
        >
          <VictimNavbar />
        </div>

        {/* Page Content */}
        <div className="relative pt-24" style={{ zIndex: 10 }}>
          {children}
        </div>
      </div>
    </RoleGaurd>
  );
}
