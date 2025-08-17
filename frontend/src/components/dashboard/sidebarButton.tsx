'use client'
import React from "react";
import { Button } from "@/components/ui/button"

type SidebarButtonProps = Readonly<{
  icon: React.ReactNode;
  label: string;
  expanded?: boolean;
  onClick?: ()=> void;
}>;

export default function SidebarButton({icon,label,expanded=false, onClick}: SidebarButtonProps) {
  return (
      <Button 
        size={expanded ? "default":"icon"} 
        variant="secondary"
        className={"size-10 bg-white shadow-none"}
        onClick={onClick}
        aria-label={label}
      >
      {icon}
      {expanded && <span className="text-base font-medium">{label}</span>}
    </Button>
  );
}


{/*
  import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard Navigation</h2>
            <nav className="flex flex-col gap-2">
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/appointments">Appointments</Link>
              <Link href="/dashboard/clients">Clients</Link>
              <Link href="/dashboard/services">Services</Link>
              <Link href="/dashboard/settings">Settings</Link>
              <Link href="/dashboard/team">Team</Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

  */}