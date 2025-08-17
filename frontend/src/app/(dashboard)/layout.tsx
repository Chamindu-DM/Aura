import SidebarButton from '@/components/dashboard/sidebarButton';
import Sidebar from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div data-layer="Container" className="Container pl-[80px] w-full self-stretch inline-flex justify-start items-start overflow-hidden">
        {/* Sidebar*/}
        <Sidebar/>
        
        {/* Main content */}
        <div data-layer="Main Container" className="MainContainer w-full self-stretch p-4 bg-gray-100">
            {children}
        </div>
      </div>
    </div>
  );
}
