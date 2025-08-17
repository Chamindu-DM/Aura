export default function Dashboard() {
  return (
    <div data-layer="Vertical Container" className="VerticalContainer self-stretch bg-white rounded-lg">
      <div data-layer="Web App Nav Bar" className="WebAppNavBar self-stretch px-10 py-4 relative bg-Grays-White border-b border-black/10 inline-flex justify-between items-center">
    <div data-layer="Search Field" className="SearchField w-96 self-stretch px-3 py-2.5 bg-Fills-Quaternary/10 rounded-xl flex justify-start items-center gap-2">
        <div data-layer="Search Icon" className="SearchIcon w-4 h-4 relative overflow-hidden">
            <div data-layer="Vector" className="Vector w-3.5 h-3.5 left-[1.49px] top-[1.49px] absolute bg-Labels-Secondary/60" />
        </div>
        <div data-layer="Search Placeholder" className="SearchPlaceholder flex-1 justify-center text-Labels-Secondary/60 text-base font-medium font-['Inter_Tight'] leading-snug">Search for appointments, clients,...</div>
    </div>
    <div data-layer="Header" className="Header h-10 flex justify-end items-center gap-7">
        <div data-layer="App Grid" className="AppGrid w-6 h-6 relative overflow-hidden">
            <div data-layer="Icon" className="Icon w-4 h-4 left-[3px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-neutral-800" />
        </div>
        <div data-layer="Notification Bell" className="NotificationBell w-6 h-6 relative overflow-hidden">
            <div data-layer="Vector" className="Vector w-4 h-5 left-[3px] top-[2.25px] absolute bg-Labels-Primary" />
        </div>
    </div>
    <div data-layer="divider" className="Divider w-[1512px] h-0 left-[-96px] top-[75px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-black/0" />
</div>
      <div data-layer="Frame 1010106719" className="Frame1010106719 w-full h-[1000px] p-2 bg-lime-500" />
    </div>
  );
}
