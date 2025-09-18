import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: "success" | "warning" | "info" | "default";
}

export const MetricCard = ({ title, value, subtitle, icon: Icon, color = "default" }: MetricCardProps) => {
  const getIconColor = () => {
    switch (color) {
      case "success": return "text-metric-success";
      case "warning": return "text-metric-warning";
      case "info": return "text-metric-info";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Card className="p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-muted ${getIconColor()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
};