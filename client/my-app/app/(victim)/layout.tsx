export default function VictimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      <div
        className="absolute inset-0 h-full w-full 
          bg-[radial-gradient(#d1d5db_1px,transparent_1px)] 
          [background-size:20px_20px]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
