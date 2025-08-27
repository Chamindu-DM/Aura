'use client'

import { useState } from 'react';
import SidebarButton from '@/components/dashboard/sidebarButton';
import Sidebar from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div 
        data-layer="Container" 
        className={`Container w-full self-stretch inline-flex justify-start items-start overflow-hidden transition-all duration-300 ${
          sidebarExpanded ? 'pl-[256px]' : 'pl-[80px]'
        }`}
      >
        {/* Sidebar*/}
        <Sidebar onToggle={setSidebarExpanded} />
        
        {/* Main content */}
        <div data-layer="Main Container" className="MainContainer w-full self-stretch p-4 bg-gray-100">
            {children}
        </div>
      </div>
    </div>
  );
}
