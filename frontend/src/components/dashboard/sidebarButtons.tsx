import { House } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button"

export default function SidebarButton() {
  return (
      <Button size="icon" className="size-8">
      <House size={32} />
    </Button>
  );
}