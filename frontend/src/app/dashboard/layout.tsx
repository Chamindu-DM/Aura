export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar placeholder */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Dashboard Navigation</h2>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
