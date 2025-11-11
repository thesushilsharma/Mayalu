import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SettingItemProps {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
}

export function SettingItem({
  id,
  title,
  description,
  defaultChecked,
}: SettingItemProps) {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex-1 space-y-1">
        <Label htmlFor={id} className="text-base font-medium">
          {title}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}
