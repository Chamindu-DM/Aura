// Sidebar component placeholder
export default function Sidebar() {
  return (
    <div data-layer="Sidebar" data-expand="off" className="Sidebar self-stretch p-5 relative bg-white shadow-[1px_0px_4px_0px_rgba(0,0,0,0.05)] inline-flex flex-col justify-between items-center">
    <div data-layer="Sidebar items" className="SidebarItems flex flex-col justify-start items-center gap-3">
        <div data-layer="Logo Text" data-property-1="Variant2" className="LogoText w-8 h-8 relative rounded-md overflow-hidden">
            <div data-layer="Frame 1010106717" className="Frame1010106717 w-8 h-8 left-0 top-0 absolute bg-[conic-gradient(from_97deg_at_57.34%_44.79%,_#FF3B30_0deg,_#FF9000_132deg,_#FF675F_241deg,_#FF3B30_360deg)]">
                <div data-layer="Logo Text" className="LogoText w-5 h-5 left-[6.02px] top-[5.33px] absolute bg-white" />
            </div>
        </div>

        <div data-layer="Sidebar buttons" className="SidebarButtons self-stretch py-2 flex flex-col justify-start items-center gap-2">
            <div data-layer="Separator" className="Separator self-stretch h-2 relative">
                <div data-layer="Separator" className="Separator w-7 h-px left-[9px] top-[4px] absolute bg-black/10" />
            </div>
            {/*Import sidebar button*/}
            <div data-layer="Sidebar collapsed button" data-show-alert-dot="false" data-state="pressed" className="SidebarCollapsedButton w-12 h-12 p-2 bg-Labels-Primary rounded-lg inline-flex justify-center items-center gap-2">
                <div data-layer="Home" data-fill="off" className="Home w-6 h-6 relative overflow-hidden">
                    <div data-layer="Vector" className="Vector w-4 h-5 left-[3px] top-[3px] absolute bg-Grays-White" />
                </div>
            </div>
            <div data-layer="Sidebar collapsed button" data-show-alert-dot="false" data-state="enabled" className="SidebarCollapsedButton w-12 h-12 p-2 rounded-lg inline-flex justify-center items-center gap-2">
                <div data-layer="Storefront" className="Storefront w-6 h-6 relative overflow-hidden">
                    <div data-layer="Vector" className="Vector w-5 h-4 left-[2.25px] top-[3px] absolute bg-Labels-Secondary/60" />
                </div>
            </div>
            <div data-layer="Button" data-show-alert-dot="false" data-state="enabled" className="Button w-12 h-12 p-2 rounded-lg inline-flex justify-center items-center gap-2">
                <div data-layer="Clock" className="Clock w-6 h-6 relative overflow-hidden">
                    <div data-layer="Vector" className="Vector w-5 h-5 left-[2.25px] top-[2.25px] absolute bg-Labels-Secondary/60" />
                </div>
            </div>
            <div data-layer="Button" data-show-alert-dot="false" data-state="enabled" className="Button w-12 h-12 p-2 rounded-lg inline-flex justify-center items-center gap-2">
                <div data-layer="UsersThree" className="Usersthree w-6 h-6 relative overflow-hidden">
                    <div data-layer="Vector" className="Vector w-6 h-4 left-[0.75px] top-[4.50px] absolute bg-Labels-Secondary/60" />
                </div>
            </div>
            <div data-layer="Button" data-show-alert-dot="false" data-state="enabled" className="Button w-12 h-12 p-2 rounded-lg inline-flex justify-center items-center gap-2">
                <div data-layer="Gear" className="Gear w-6 h-6 relative overflow-hidden">
                    <div data-layer="Vector" className="Vector w-5 h-5 left-[2.19px] top-[2.19px] absolute bg-Labels-Secondary/60" />
                </div>
            </div>
        </div>
    </div>
    <div data-layer="Profile settings" className="ProfileSettings self-stretch flex flex-col justify-start items-center gap-2">
        <div data-layer="Separator" className="Separator self-stretch h-2 relative">
            <div data-layer="Separator" className="Separator w-7 h-px left-[9px] top-[4px] absolute bg-black/10" />
        </div>
        <img data-layer="Profile Picture" data-show-profile-photo="on" className="ProfilePicture w-10 h-10 rounded-lg outline outline-1 outline-black/10" src="https://placehold.co/40x40" />
    </div>
    <div data-layer="Dock Icon" className="DockIcon w-6 h-6 left-[76px] top-[28px] absolute bg-Grays-White rounded outline outline-1 outline-black/5">
        <div data-layer="Bounding box" className="BoundingBox w-6 h-6 left-0 top-0 absolute bg-zinc-300" />
        <div data-layer="dock_to_right" className="DockToRight w-4 h-4 left-[3px] top-[3px] absolute bg-black/50" />
    </div>
</div>
  );
}
