'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from "react";
import { 
  House, 
  Storefront, 
  Gear, 
  UsersThree, 
  Clock, 
  CaretRight,
  CaretDown,
  SignOut
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  onToggle?: (expanded: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthContext();

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const handleLogout = async () => {
    await logout();
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const menuItems = [
    { 
      icon: House, 
      label: 'Dashboard', 
      key: 'dashboard',
      href: '/dashboard'
    },
    { 
      icon: Storefront, 
      label: 'Services', 
      key: 'services',
      href: '/services'
    },
    { 
      icon: Clock, 
      label: 'Appointments', 
      key: 'appointments',
      href: '/appointments'
    },
    { 
      icon: UsersThree, 
      label: 'Team', 
      key: 'team',
      href: '/team'
    },
    { 
      icon: Gear, 
      label: 'Settings', 
      key: 'settings',
      href: '/settings'
    },
  ];

  if (isExpanded) {
    return (
      <div 
        className="bg-white fixed left-0 top-0 h-screen w-[256px] flex flex-col justify-between p-5 border-r border-black/10"
        data-layer="Sidebar" 
        data-expand="on"
      >
        {/* Header */}
        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex gap-2 items-start">
              <div className="h-6 w-[86px]">
                <Image
                  src="/images/Logo.svg"
                  alt="Aura Logo"
                  width={86}
                  height={24}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0 bg-white border-black/5 "
                onClick={handleToggle}
              >
                <Image
                  src="/icons/Dock Icon.svg"
                  alt="Collapse sidebar"
                  width={12}
                  height={12}
                  className='!w-5 !h-5 text-gray-400'
                />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-2 w-full">
              {/* Navigation Header */}
              <div className="flex items-center w-full">
                <span className="font-['Inter'] text-[12px] text-black/50 tracking-[-0.12px]">
                  Navigation Menu
                </span>
                <div className="flex-1 flex items-center py-1">
                  <div className="h-px w-full bg-black/10" />
                </div>
              </div>

              {/* Navigation Items */}
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.key} href={item.href} className="w-full">
                    <Button
                      variant="ghost"
                      className={`w-full max-w-[280px] justify-start gap-2 px-3 py-2 h-auto rounded-lg ${
                        isActive 
                          ? 'bg-black text-white hover:bg-black/90' 
                          : 'text-[rgba(60,60,67,0.6)] hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                      <span className="font-['Inter_Tight'] font-medium text-[15px] leading-[22px]">
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-2 items-center py-1 w-full">
            <div className="h-px w-full bg-black/10" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex h-10 items-center justify-between w-full p-0 hover:bg-gray-50">
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 rounded-lg border border-black/10 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {user?.profilePhoto ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profilePhoto}`}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="font-['Inter_Tight'] font-semibold text-sm text-black/70">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-['Inter_Tight'] font-semibold text-[15px] leading-[20px] text-black/70 text-left">
                      {getUserDisplayName()}
                    </span>
                  </div>
                </div>
                <CaretDown size={16} className="text-black/50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <SignOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="Sidebar fixed left-0 top-0 p-5 h-screen bg-white shadow-[1px_0px_4px_0px_rgba(0,0,0,0.05)] inline-flex flex-col justify-between items-center w-20"
      data-layer="Sidebar" 
      data-expand="off"
    >
      <div className="SidebarItems flex flex-col justify-start items-center gap-3">
        <div className="LogoText w-8 h-8 relative rounded-md overflow-hidden">
          <Image
            src="/icons/Logo Text.svg"
            alt="Aura Logo"
            width={32}
            height={32}
          />
        </div>

        <div className="SidebarButtons self-stretch py-2 flex flex-col justify-start items-center gap-2">
          <div className="Separator self-stretch h-2 relative">
            <div className="Separator h-px left-[9px] top-[4px] w-full bg-black/10" />
          </div>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.key} href={item.href}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 p-0 ${
                    isActive 
                      ? 'bg-black text-white hover:bg-black/90' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="ProfileSettings self-stretch flex flex-col justify-start items-center gap-2">
        <div className="Separator self-stretch h-2 relative">
          <div className="Separator h-px left-[9px] top-[4px] w-full bg-black/10" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 p-0 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-lg border border-black/10 bg-gray-100 flex items-center justify-center overflow-hidden">
                {user?.profilePhoto ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profilePhoto}`}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="font-['Inter_Tight'] font-semibold text-sm text-black/70">
                    {getUserInitials()}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <SignOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="DockIcon w-6 h-6 absolute right-[-12px] top-6 bg-white rounded border-black/5 p-0"
        onClick={handleToggle}
      >
        <Image
          src="/icons/Dock Icon.svg"
          alt="Expand sidebar"
          width={12}
          height={12}
          className='!w-5 !h-5 text-gray-400'
        />
      </Button>
    </div>
  );
}
