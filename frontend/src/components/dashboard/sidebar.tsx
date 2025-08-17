'use client'
import Image from 'next/image';
import React from "react";
import {House, Storefront, Gear, UsersThree, Clock} from "@phosphor-icons/react";
import SidebarButton from "./sidebarButton";

export default function Sidebar() {
  return (
    <div data-layer="Sidebar" data-expand="off" className="Sidebar fixed left-0 top-0 p-5 h-screen bg-white shadow-[1px_0px_4px_0px_rgba(0,0,0,0.05)] inline-flex flex-col justify-between items-center">
    <div data-layer="Sidebar items" className="SidebarItems flex flex-col justify-start items-center gap-3">
        <div data-layer="Logo Text" data-property-1="Variant2" className="LogoText w-8 h-8 relative rounded-md overflow-hidden">
              <Image
                src = "/icons/Logo Text.svg"
                alt="Info icon"
                width={40}
                height={40}                
                />
        </div>

        <div data-layer="Sidebar buttons" className="SidebarButtons self-stretch py-2 flex flex-col justify-start items-center gap-2 ">
            <div data-layer="Separator" className="Separator self-stretch h-2 relative">
                <div data-layer="Separator" className="Separator h-px left-[9px] top-[4px] w-full bg-black/10" />
            </div>
            {/*Import sidebar button*/}
            <SidebarButton 
              icon={<House className="!w-5 !h-5 text-gray-400" />}
              label='Home'
            />
            <SidebarButton
              icon={<Storefront className="!w-5 !h-5 text-gray-400" />}
              label='Manage Services'
            />
            <SidebarButton
              icon={<Clock className="!w-5 !h-5 text-gray-400" />}
              label='Business Hours'
            />
            <SidebarButton
              icon={<UsersThree className="!w-5 !h-5 text-gray-400" />}
              label='Manage Team'
            />
            <SidebarButton
              icon={<Gear className="!w-5 !h-5 text-gray-400" />}
              label='Settings'
            />
            
        </div>
    </div>
    <div data-layer="Profile settings" className="ProfileSettings self-stretch flex flex-col justify-start items-center gap-2">
        <div data-layer="Separator" className="Separator self-stretch h-2 relative">
                <div data-layer="Separator" className="Separator h-px left-[9px] top-[4px] w-full bg-black/10" />
        </div>
        <img data-layer="Profile Picture" data-show-profile-photo="on" className="ProfilePicture w-10 h-10 rounded-lg outline-1 outline-black/10" src="https://placehold.co/40x40" />
    </div>
    <div data-layer="Dock Icon" className="DockIcon w-6 h-6 left-[68px] top-[24px] absolute bg-Grays-White rounded outline outline-1 outline-black/5">
      <Image
        src = "/icons/Dock Icon.svg"
        alt="Info icon"
        width={40}
        height={40}                
        />
    </div>
</div>
  );
}
